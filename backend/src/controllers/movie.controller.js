import { Movie } from "../models/movie.model.js";
import { Rating } from "../models/rating.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";





const topRatedMovies = asyncHandler(async (req, res) => {
  try {
    const topMovies = await Rating.aggregate([
        // group by movies and take avg 
      {
        $group: {
          _id: "$movieId",
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1, totalRatings: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $project: {
          _id: 0,
          movieId: "$movie._id",
          title: "$movie.title",
          thumbnail: "$movie.thumbnail",
          duration: "$movie.duration",
          year: "$movie.year",
          languages: "$movie.languages",
          avgRating: 1,
          totalRatings: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, topMovies, "Fetched top rated movies successfully"));
  } catch (error) {
    throw new ApiError(500, `Something went wrong while retrieving top rated movies: ${error.message}`);
  }
});


const moviesList = asyncHandler(async (req, res) => {
  try {
        const movies = await Movie.find().select("-owner -videoFile -description -genreId -totalRatings -totalRatingValue");
       return res.status(200).json(
        new ApiResponse(200, {
            moviesList : movies
        })
    )
  } catch (error) {
    throw new ApiError(500,`Something went wrong while retrieving all the movies ${error}`)
  }
})

const movieById = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id).populate("genres", "name -_id").select("-owner")
        if(!movie){
            throw new ApiError(404, "Movie not found")
        }

        const ratingStats = await Rating.aggregate([
           { $match : { movieId : movie._id}},
            {
                $group: {
                    _id : "$movie",
                    avgRating: { $avg : "$rating"},
                    totalRatings : {$sum:1}
                }
            }

        ])

         const { avgRating = 0, totalRatings = 0 } = ratingStats[0] || {};

        return res
        .status(200)
        .json(
            new ApiResponse(200, { movie, avgRating, totalRatings }, "Movie fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching the movie ${error}`)
    }
})

const addMovie = asyncHandler(async (req, res) => {
    try {
        
        const {  title, description, year } = req.body;
        const genres = JSON.parse(req.body.genres);
        const languages = JSON.parse(req.body.languages);

        if (
            [ title, description, year].some((field) => field?.trim() === "") || languages.length === 0
          ) {
            throw new ApiError(400, "All fields are required");
          }

          const owner  = req.user._id;
         

        // remember that this req.files is updated in req by multer, so this is what multer does it accepts media files frontend, upload on the server itself..then we take those files path(it will be in public/temp) here and upload those files on cloudinary and then gets deleted in cloudinary code

        const thumbnailServerPath = req.files?.thumbnail[0]?.path;
        const movieServerPath = req.files?.videoFile[0]?.path;

        if(!thumbnailServerPath) {
            throw new ApiError(400, "Thumbnail is required")
        }

        if(!movieServerPath) {
            throw new ApiError(400, "Movie path is required")
        }

        const thumbnail = await uploadOnCloudinary(thumbnailServerPath)
        const movieUpload = await uploadOnCloudinary(movieServerPath)

        if (!thumbnail || !movieUpload) {
            throw new ApiError(400, "Failed to upload files to Cloudinary");
          }


        const durationInMinutes = movieUpload?.duration ? (movieUpload.duration) / 60 : 0;
      

        const movie = await Movie.create({
            title,
            thumbnail: thumbnail.url,
            videoFile: movieUpload.url ,
            description,
            languages,
            genres,
            owner,
            year, 
            duration: durationInMinutes,
            
        })

        return res.status(201).json(
            new ApiResponse(201, {
                movie: movie,

            },
        "Movie added successfully")
        )

        
    } catch (error) {
        throw new ApiError(500, `Something went wrong while adding the movie ${error}`)
    }
})


const updateMovieDetails = asyncHandler(async (req, res) => {
    try {
        const  movieId  = req.params.id;
        const genres = req.body.genres ? JSON.parse(req.body.genres) : [];
        const languages = req.body.languages ? JSON.parse(req.body.languages) : [];
        const { title, description, year } = req.body;
        

    if (!movieId) {
      throw new ApiError(400, "Movie ID is required");
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new ApiError(404, "Movie not found");
    }
    if (title) movie.title = title;
    if (description) movie.description = description;
    if (year) movie.year = year;
    if (languages && languages.length > 0) movie.languages = languages;
    if (genres && genres.length > 0) movie.genres = genres;

    const newThumbnailPath = req.files?.thumbnail?.[0]?.path;
    const newVideoPath = req.files?.videoFile?.[0]?.path;

    if (newThumbnailPath) {
      if (movie.thumbnail) await deleteOnCloudinary(movie.thumbnail);
      const newThumbnail = await uploadOnCloudinary(newThumbnailPath);
      movie.thumbnail = newThumbnail.url;
    }

    if (newVideoPath) {
      if (movie.videoFile) await deleteOnCloudinary(movie.videoFile);
      const newVideo = await uploadOnCloudinary(newVideoPath);
      movie.videoFile = newVideo.url;
      movie.duration = newVideo.duration / 60; 
    }

    await movie.save();

    return res.status(200).json(
      new ApiResponse(200, { movie }, "Movie updated successfully")
    );
        
    } catch (error) {
        throw new ApiError(500, `Something went wrong while updating the fields ${error} `)
    }
})


const deleteMovie = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);
        if(!movie){
            throw new ApiError(404, "Movie not found")
        }
    
        const thumbnailPublicId = movie.thumbnail?.public_id;
        const videoFilePublicId = movie.videoFile?.public_id;
    
        await deleteOnCloudinary(thumbnailPublicId);
        await deleteOnCloudinary(videoFilePublicId, "video");
    
        await Rating.deleteMany({movieId: id})
    
        await Movie.findByIdAndDelete(id)

        res.
        status(204)
        .json(
            new ApiResponse(200,{}
            , "Movie Deleted Successfully")
        )
    
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting the movie")
    }
})





export {topRatedMovies ,moviesList, movieById, addMovie, updateMovieDetails, deleteMovie};






// Get top 6 rated movies DONE
// changes in all movies that you get only required like - thumbnail, title, duration, year, language DONE
// movies/:id DONE
// -DELETE MOVIE DONE
// -UPDATE MOVIE Handle text data, thumbnail change, videoFile change DONE
// improve addMovie controller DONE
// how to handle owner - get owner id from req.user because we will check jwt right DONE

// how to handle genre -  make an api call to get all genre on add movie page and send selected genre and accept in adding movies controller
// how to handle ratings - handle in rating update controller and later on deploy kafka

// add redis for caching
// search using mongoDB atlas search later