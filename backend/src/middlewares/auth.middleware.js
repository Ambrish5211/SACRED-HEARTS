import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (accessToken) {
      try {
        const decodedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id).select(
          "-password -refreshToken"
        );

        if (user) {
          req.user = user;
          return next();
        }
      } catch (error) {
      }
    }

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefresh?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (refreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    let newAccessToken;
    if (typeof user.generateAccessToken === 'function') {
      newAccessToken = user.generateAccessToken();
    } else {
      newAccessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 15 * 60 * 1000 // 15 mins
    };

    res.cookie("accessToken", newAccessToken, options);

    req.user = user;
    next();

  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid authentication");
  }
});
