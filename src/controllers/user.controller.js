import { asyncHandler } from "../utils/asynchandler.js";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { generateApiResponse } from "../utils/apirespnose.js";
import fetch from "node-fetch";
import fs from "fs";

export const userController = {

  // REGISTER
  register: asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return generateApiResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "All fields are required!"
      );
    }

    const isExisting = await User.findOne({ email });
    if (isExisting) {
      return generateApiResponse(
        res,
        StatusCodes.CONFLICT,
        false,
        "Email already exists!"
      );
    }

    const user = await User.create({ fullName, email, password });
    const token = user.generateJWT();

    return generateApiResponse(
      res,
      StatusCodes.CREATED,
      true,
      "User created successfully!",
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
        token,
      }
    );
  }),

  // LOGIN
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return generateApiResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Email & password are required!"
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return generateApiResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "User not found!"
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return generateApiResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Invalid login credentials!"
      );
    }

    const token = user.generateJWT();

    return generateApiResponse(
      res,
      StatusCodes.OK,
      true,
      "Login successful!",
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
        token,
      }
    );
  }),

  // PROFILE
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return generateApiResponse(
        res,
        StatusCodes.NOT_FOUND,
        false,
        "User not found!"
      );
    }

    return generateApiResponse(
      res,
      StatusCodes.OK,
      true,
      "Profile fetched!",
      user
    );
  }),

};
