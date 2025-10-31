import { Movie } from "../models/movie.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get top 6 rated movies DONE
// changes in all movies that you get only required like - thumbnail, title, duration, year, language DONE
// movies/:id DONE

// improve addMovie controller

// how to handle genre -  make an api call to get all genre on add movie page and send selected genre id and accept in adding movies controller
// how to handle owner - get owner id from req.user because we will check jwt right
// how to handle ratings - handle in rating update controller and later on deploy kafka

// add redis for caching
// search using mongoDB atlas search later
// -UPDATE MOVIE 
// -DELETE MOVIE 



const topRatedMovies = asyncHandler( async (req, res) => {
    try {
         const movies = await Movie.find()
          .select("title thumbnail duration year languages")
          .limit(6)
          .lean();
        return res
        .status(200)
        .json(
            new ApiResponse(200, {
                movies : movies
            })
        )
    } catch (error) {
        throw new Error(500, `Something went wrong while retrieving top rated movies ${error}`)
    }
})


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
        const movie = await Movie.findById(id).select("-owner -genreId -totalRatings")
        if(!movie){
            throw new ApiError(404, "Movie not found")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200, { movie }, "Movie fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching the movie ${error}`)
    }
})

const addMovie = asyncHandler(async (req, res) => {
    try {
        const {  title, description, genre } = req.body;
        if (
            [ title, description, genre].some((field) => field?.trim() === "")
          ) {
            throw new ApiError(400, "All fields are required");
          }

        // remember that this req.files is updated in req by multer, so this is what multer does it accepts media files frontend, upload on the server itself..then we take those files path(it will be in public/temp) here and upload those files on cloudinary and then gets deleted in cloudinary code

        const thumbnailServerPath = req.files?.thumbnail[0]?.path;
        console.log(thumbnailPath)
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


        const durationInMinutes = (movieUpload.duration) / 60;
      

        const movie = await Movie.create({
            title,
            thumbnail: thumbnail.url,
            videoFile: movieUpload.url ,
            description, 
            genre,
            duration: durationInMinutes,
            
        })

        return res.status(200).json(
            new ApiResponse(200, {
                movie: movie,

            },
        "Movie added successfully")
        )

        
    } catch (error) {
        throw new ApiError(500, `Something went wrong while adding the movie ${error}`)
    }
})





export {topRatedMovies ,moviesList, movieById, addMovie};