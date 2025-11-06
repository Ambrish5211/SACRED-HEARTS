import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      
      
      const accessToken = user.generateAccessToken()
      
      const refreshToken = user.generateRefreshToken()
      

      user.refreshToken = refreshToken
    
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}


const registerUser = asyncHandler(async (req, res) => {
  // get user details from body
  // validation
  // check if user already exist: username, email
  // check for avatar and images
   
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { email, password } = req.body;


  if (
    [ email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email  already exists");
  }

 

  
  const user = await User.create({ 
    email,
    password,
    })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully ")
  )

});






const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  

  if (
    [email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist, please register");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  
  if(!isPasswordValid)
  {
    throw new ApiError(401, "Invalid User Credentials")
  }


  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true, // means it is only accessible at server, cannot be modified at client level
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )



})

const logoutUser = asyncHandler(async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,  // this access of user was done by middleware (jwtVerification)
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
 const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken;

 if(!incomingRefreshToken) {
  throw new ApiError(401, "Unauthorized request");
 }

try {
  const decodedToken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
  const user  = await User.findById(decodedToken?._id);
  if(!user){
    throw new ApiError(401, "Invalid refresh token");
  }
    if(incomingRefreshToken != user?.refreshToken){
      throw new ApiError(401, "Refresh token is invalid or expired")
    }
  
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {accessToken, refreshToken}, "AccessToken Updated")
    )
} catch (error) {
  throw new ApiError(401, error?.message || "Invalid refresh token")
}
  

})

const getUser = asyncHandler((req, res) => {
  return res
  .status(200)
  .json( new ApiResponse(200, {user: req.user}, "User fecthed successfully"));
})

const getRecentlyWatched = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  if(!userid){
    throw new ApiError(400, "User id is required")
  }
  const user  = await User.findById(userid).populate("recentlyWatched", "thumbnail title duration year languages").select("recentlyWatched")
  if(!user){
    throw new ApiError(404, "User not found")
  }

  res
  .status(200)
  .json(
    new ApiResponse(200, { user}, "Fetched recently watch successfully")
  )
})



export { registerUser, loginUser , logoutUser, refreshAccessToken, getUser, getRecentlyWatched};