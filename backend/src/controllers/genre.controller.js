
import { Genre } from "../models/genre.model.js";
import { Movie } from "../models/movie.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addGenre = asyncHandler(async (req, res) =>{
    try {
        const {name} = req.body;
    
        if (!name || name.trim() === "") {
      throw new ApiError(400, "Genre name is required");
    }
    
      const existedGenre = await Genre.findOne({name});
      if(existedGenre){
        throw new ApiError(409, "Genre already exists");
      }
    
       await Genre.create({name: name.trim()})
       const genre = await Genre.find({name});
    
       if(!genre){
        throw new ApiError(500, "Something went wwrong while creating the genre");
       }
    
       res
       .status(201)
       .json(
        new ApiResponse(201, genre,"Genre created successfully")
       )
    } catch (error) {
        throw new ApiError(500, `Something went wrongg while creating the genre ${error.message}`)
    }
})

const getGenreById = asyncHandler(async (req, res)=>{
    try {
        const {id} = req.params;
        if(!id){
            throw new ApiError(400, `Id is necessary`)
        }
        const genre  = await Genre.findById(id);
        if(!genre){
            throw new ApiError(404, `Could not find genre with id: ${id}`)
        }
        res
        .status(200)
        .json(
            new ApiResponse(200, genre, "Fetched genre successfully")
        )
    } catch (error) {
        new ApiError(500, `Something went wrong while fetching the genre ${error.message}`)
    }
})

const genreList = asyncHandler( async (req, res) => {
    try {
        const genres = await Genre.find()
        return res
        .status(200)
        .json(
            new ApiResponse(200, genres, "Fetched all genres successfully")
        )

    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching all the genres ${error.message}`)
    }
})

const updateGenre = asyncHandler( async (req, res) =>{
   try {
     const {genreId} = req.params;
     const {name} = req.body;
 
     if(!genreId) {
         throw new ApiError(400, "Genre id is required")
     }
     const genre = await Genre.findById(genreId)
     if(!genre) {
         throw new ApiError(404, "Genre not found")
     }
     if(name) genre.name = name.trim();
 
     await genre.save();

     res
     .status(200)
     .json(
         new ApiResponse(200, genre, "Genre updated successfully")
     )
   } catch (error) {
    throw new ApiError(500, `Something went wrong while updating the genre  msg:- ${error.message} `)
   }
})

const deleteGenre = asyncHandler(async (req, res) => {
   try {
    const {id} = req.params;
        if(!id){
            throw new ApiError(400, `Id is necessary`)
        }
        const genre  = await Genre.findById(id);
        if(!genre){
            throw new ApiError(404, `Could not find genre with id: ${id}`)
        }
        await Movie.updateMany(
            { genres: id },
            { $pull: { genres: id } }
        )
        await Genre.findByIdAndDelete(id);
        res.status(200)
        .json(
            new ApiResponse(200, {}, "Genre deleted successfully")
        )
   } catch (error) {
    throw new ApiError(`Something went wrong while deleting the genre ${error.message}`)
   }
})


export {addGenre,getGenreById, genreList, updateGenre, deleteGenre}