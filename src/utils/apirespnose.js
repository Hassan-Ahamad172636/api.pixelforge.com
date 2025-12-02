import { StatusCodes } from "http-status-codes";

export const generateApiResponse = (
  res,
  status = StatusCodes.OK,
  success = true,
  message = "",
  data = {}
) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};
