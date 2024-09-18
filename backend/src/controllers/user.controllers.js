import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiRessponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from body
  // validation
  //check if user already exist: username, email
  // check for avatar and images
   
  // remove password and refrest token field from response
  // check for user creation
  // return res
console.log(req.body)
  const { email, username, password } = req.body;
  console.log(email);

  if (
    [ email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email },],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email  already exists");
  }

 

  
  const user = await User.create({ 
    email,
    password,
    username,
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(200).json(
    new ApiResponse(200, createdUser, "User registered successfully ")
  )

});

const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  console.log(email)

  if (
    [email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (!existedUser) {
    throw new ApiError(409, "User does not exist, please register");
  }

})

export { registerUser, loginUser };