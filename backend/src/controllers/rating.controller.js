import { Rating } from "../models/rating.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addRating = asyncHandler(async (req, res) =>{
    const {rating, movieId} = req.body;
    const userId = req.user._id;

    if(!rating || !movieId || !userId){
        throw new ApiError(400, "All fields are necessary")
    }

    const updatedRating = await Rating.findOneAndUpdate(
    { userId, movieId },           
    { rating },                   
    { new: true, upsert: true }   
  );

    return res
    .status(201)
    .json(
        new ApiResponse(201,updatedRating,"Rating added successfully")
    )
    
})

export {addRating}