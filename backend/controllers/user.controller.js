import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const options = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req,res)=> {

  const {name,age,dateOfBirth,password,gender,about} = req.body;
  

  if ([name, dateOfBirth, gender, about, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
   }
   if(name.length<2){
    throw new ApiError(400,"Name must be atleast 2 characters long");
   }
   if (age < 0 || age > 120 || !Number.isInteger(Number(age))) {
    throw new ApiError(400,'Age must be between 0 and 120');
  }
  const dobDate = new Date(dateOfBirth);
    if (isNaN(dobDate.getTime())) {
      throw new ApiError(400,'Invalid date of birth');
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/;
    if (!passwordRegex.test(password)) {
      throw new ApiError(400,'Password must be at least 10 characters long and contain both letters and numbers');
    }
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(gender)) {
      throw new ApiError(400,'Invalid gender selection');
    }

    // Validate about text
    if (about && about.length > 5000) {
      throw new ApiError(400,'About text cannot exceed 5000 characters');
    }

    const user = await User.create({
        name,
        age,
        dateOfBirth,
        password,
        gender,
        about
    })
    const createdUser = await User.findById(user._id).select(
        "-password"
      );
      const accessToken = user.generateAccessToken();
      return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user:createdUser,
            accessToken
          },
          "User Registered Successfully"
        )
      );
});

const loginUser = asyncHandler(async(req,res)=> {
  const {name,password} = req.body;
 
  if([name,password].some((field)=> field?.trim() ==="" )){
    throw new ApiError(400,"All the fields are required");
  }
  // Although we don't have any unique parameter to find user 
  //  but for let's assume 2 user can't have same name 
  const user = await User.findOne({
    name
  })
 
  if (!user) {
    throw new ApiError(404, "user with this email or username doesnt exist");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "please enter a valid password");
  }
  const accessToken = user.generateAccessToken();

  await user.save({ validateBeforeSave: false });
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken
        },
        "User Logged In Successfully"
      )
    );
});

const updateUser = asyncHandler(async(req,res)=> {
  console.log("user",req.user);
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { name, age, dateOfBirth, gender, about } = req.body;

  if ([name, dateOfBirth, gender, about].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (name.length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters long");
  }

  if (age < 0 || age > 120 || !Number.isInteger(Number(age))) {
    throw new ApiError(400, "Age must be between 0 and 120");
  }

  const dobDate = new Date(dateOfBirth);
  if (isNaN(dobDate.getTime())) {
    throw new ApiError(400, "Invalid date of birth");
  }

  const validGenders = ["Male", "Female", "Other"];
  if (!validGenders.includes(gender)) {
    throw new ApiError(400, "Invalid gender selection");
  }

  if (about && about.length > 5000) {
    throw new ApiError(400, "About text cannot exceed 5000 characters");
  }

  

  user.name = name;
  user.age = age;
  user.dateOfBirth = dateOfBirth;
  user.gender = gender;
  user.about = about;

  await user.save();

  const updatedUser = await User.findById(userId).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));


});


const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched successfully"));
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User profile deleted successfully"));
});

export {registerUser,loginUser,updateUser,getUserProfile,deleteUserProfile};