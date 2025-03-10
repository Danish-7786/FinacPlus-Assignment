import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

import { User } from "../models/user.models.js";

export const verifyJWT = () => {
  return asyncHandler(async (req, _, next) => {
    try {
      let user;
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      user = await User.findById(decodedToken?._id).select("-password");

      if (!user) {
        throw new ApiError(401, "Invalid AccessToken ");
      }
      req.user = user;
      next();
    } 
    catch (error) {
      throw new ApiError(401, error?.message || "Invalid AccessToken");
    }
  });
};
