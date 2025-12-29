import { Movie } from "../models/movie.model.js";
import { Rating } from "../models/rating.model.js";
import { User } from "../models/user.model.js";
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
      { $limit: 3 },
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
        const movies = await Movie.find().select("-owner -videoFile -description -genreId  ");
       return res.status(200).json(
        new ApiResponse(200, {
            moviesList : movies
        })
    )
  } catch (error) {
    throw new ApiError(500,`Something went wrong while retrieving all the movies ${error}`)
  }
});




const movieById = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id).populate("genres", "name -_id").select("-owner")
        const userid = req.user._id;
        const user = await User.findById(userid);
        if(!user){
            throw new ApiError(404, "User not found")
        }
        if (!user.recentlyWatched.some(m => m.toString() === id)) {
            user.recentlyWatched.unshift(id);
            if (user.recentlyWatched.length > 3) user.recentlyWatched.pop();
            await user.save();
        }
        
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

const searchMovies = asyncHandler(async (req, res) => {
  const { query, genreId, language, year } = req.query;

  const pipeline = [];

  // 🔍 Search (title + description)
  if (query) {
    pipeline.push({
      $search: {
        index: "moviesearchindex",
        compound: {
          should: [
            {
              autocomplete: {
                query,
                path: "title",
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 5 } }
              }
            },
            {
              text: {
                query,
                path: "description",
                score: { boost: { value: 1 } }
              }
            }
          ]
        }
      }
    });
  }

  // 🎛 Filters (handled AFTER search)
  const matchStage = {};

  if (genreId) {
    matchStage.genres = new mongoose.Types.ObjectId(genreId);
  }

  if (language) {
    matchStage.languages = language;
  }

  if (year) {
    matchStage.year = Number(year);
  }

  if (Object.keys(matchStage).length) {
    pipeline.push({ $match: matchStage });
  }

  

  // 🎬 Final response
  pipeline.push({
    $project: {
      title: 1,
      thumbnail: 1,
      duration: 1,
      year: 1,
      languages: 1,
      score: query ? { $meta: "searchScore" } : 0
    }
  });

  const movies = await Movie.aggregate(pipeline);


  res.status(200).json(
    new ApiResponse(200, movies, "Movies fetched successfully")
  );
});


const autocompleteMovies = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 2) {
    return res.status(200).json(
      new ApiResponse(200, [], "Type more characters")
    );
  }

  const suggestions = await Movie.aggregate([
    {
      $search: {
        index: "moviesearchindex",
        autocomplete: {
          query,
          path: "title",
          fuzzy: { maxEdits: 1 }
        }
      }
    },
    { $limit: 8 },
    {
      $project: {
        title: 1,
        thumbnail: 1,
        score: { $meta: "searchScore" }
      }
    }
  ]);

  res.status(200).json(
    new ApiResponse(200, suggestions, "Autocomplete results")
  );
});

// We are doing full text search on descrition, genre, year and doing autocomplete on title, but since description will have title as well, full text search will work on title as well.  



export {topRatedMovies ,moviesList, movieById, addMovie, updateMovieDetails, deleteMovie, searchMovies, autocompleteMovies};






// Get top 6 rated movies DONE
// changes in all movies that you get only required like - thumbnail, title, duration, year, language DONE
// movies/:id DONE
// -DELETE MOVIE DONE
// -UPDATE MOVIE Handle text data, thumbnail change, videoFile change DONE
// improve addMovie controller DONE
// how to handle owner - get owner id from req.user because we will check jwt right DONE

// how to handle genre -  make an api call to get all genre on add movie page and send selected genre and accept in adding movies controller

// watchlist feature
// add redis for caching - recently watch, top rated 
// search and filter using mongoDB atlas search later DONE