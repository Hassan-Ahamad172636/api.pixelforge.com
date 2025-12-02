import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { generateApiResponse } from "../utils/apirespnose.js";

export const verifyJWT = (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return generateApiResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        false,
        "Unauthorized: Token missing"
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return generateApiResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      false,
      "Invalid or expired token"
    );
  }
};
