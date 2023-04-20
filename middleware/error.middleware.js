import ResponseError from "../utils/responseError.js";
import * as statusCode from "../constants/status.constants.js";
import ip from "../utils/ip.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  error.message = err.message;
  // Log to console for dev
  errorLogger(err, req);

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ResponseError(message, statusCode.NOT_FOUND);
  }

  if (err.code === 11000) {
    let message;
    switch (Object.keys(err.keyPattern)[0]) {
      case "email":
        message = "Email is already registered";
        break;
      case "username":
        message = "Username is already taken";
        break;
      default:
        message = `${capitalizeFirstLetter(
          Object.keys(err.keyPattern)[0]
        )} already exists`;
        break;
    }
    error = new ResponseError(message, statusCode.CONFLICT);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ResponseError(message, statusCode.BAD_REQUEST);
  }

  return res.status(error.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

export default errorHandler;

function capitalizeFirstLetter(string) {
  string.charAt(0).toUpperCase() + string.slice(1);
}

const errorLogger = (err, req) => {
  console.log(`⚠️  Error Occurred`);
  // [IP] METHOD URL
  console.log(`📌  [${ip(req)}] ${req.method} ${req.originalUrl}`);
  // body
  console.log(`📌  Body: \n${JSON.stringify(req.body)}`);
  // error
  console.log(`---~~~--- Start of Error ---~~~---`);
  console.log(err);
  console.log(`---~~~--- End of Error ---~~~---`);
  return;
};
