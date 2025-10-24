import { Movie } from "../models/movie.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//TODO FOR LATER

// -UPDATE MOVIE 
// -DELETE MOVIE 


const moviesList = asyncHandler(async (req, res) => {
  try {
    const movies =  await Movie.find({});
    return res.status(200).json(
        new ApiResponse(200, {
            moviesList : movies
        })
    )
  } catch (error) {
    throw new ApiError(500,"Something went wrong while retrieving all the movies" )
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

        // remember that this req.files is updated in req by multer, so this is what multer does it accepts media files frontend, upload on the server itself..then we take those files path(it will be in public/temp) here and upload those files on cloudinary

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

const movieDescription = asyncHandler(async (req, res) => {
        try {
            const movieId = req.params.videoId;
    
            const movie  = await Movie.findById(movieId);
    
            if(!movie)
            {
                throw new ApiError(404, "Movie not found")
            }
    
            return res.status(200).json(
                new ApiResponse(200, {
                    movie: movie
                }, "Movie fetched Successfully")
            );
        } catch (error) {
            throw new ApiError(500, `Something went wrong while fetching the movie ${error}`);
        }
});



export {moviesList, addMovie, movieDescription};