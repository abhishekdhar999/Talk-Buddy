const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const JWT_SECRET = "talkbuddy@jwtsecret"
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
     req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
console.log("authmiddleware token",token)
      //decodes token id
      const decoded = jwt.verify(token,JWT_SECRET );
console.log("decoded",decoded)
console.log("decoded.id",decoded.user.id)
      req.user = await User.findById(decoded.user.id).select("-password");
console.log("req.user = ",req.user)
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };