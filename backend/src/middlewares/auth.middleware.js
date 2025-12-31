import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(403, "Unauthorized request");
    }

    try {
      // =========================
      // 1️⃣ VERIFY ACCESS TOKEN
      // =========================
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken._id)
        .select("-password -refreshToken");

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.user = user;
      return next();

    } catch (error) {
      // =========================
      // 2️⃣ ACCESS TOKEN EXPIRED → TRY REFRESH
      // =========================
      if (error.name !== "TokenExpiredError") {
        throw error;
      }

      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new ApiError(401, "Session expired, please login again");
      }

      // verify refresh token
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedRefresh._id);
      if (!user) {
        throw new ApiError(401, "Session expired, please login again");
      }

      // 🔐 match DB stored refresh token
      if (refreshToken !== user.refreshToken) {
        throw new ApiError(401, "Session expired, please login again");
      }

      // =========================
      // 3️⃣ ISSUE NEW ACCESS TOKEN
      // =========================
      const newAccessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
      });

      req.user = user;
      next();
    }
  } catch (err) {
    throw new ApiError(401, "Please login again");
  }
});
