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

    const existingRating = await Rating.findOne({userId, movieId})
    if(existingRating) {
       throw new ApiError(400, "User rated this movie already")
    }

    const createdRating  = await Rating.create({
        rating,
        movieId,
        userId
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,createdRating,"Rating added successfully")
    )
    
})

export {addRating}