// handle genre update gracefully and do updates in movies as well to handle data inconsistency

import { Genre } from "../models/genre.model.js";
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
     if(name) genre.name = name;
 
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


export {addGenre, genreList, updateGenre}