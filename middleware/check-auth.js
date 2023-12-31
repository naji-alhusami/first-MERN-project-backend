const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") { // OPTIONS is came from browser when we send any req except GET
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId }; // reqData is object added from us, decodedToken came from token returned when we added token in jwt.sign
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 403);
    return next(error);
  }
};
