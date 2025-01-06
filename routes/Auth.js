const express = require("express");
const {
  createUser,
  loginUser,
  checkAuth,
  getAllUsers,
  resetPasswordRequest,
  resetPassword,
  logout,
  verifyEmail,
  googleAuth,
  facebookCallback,
  facebookAuth,
} = require("../controller/Auth");
const passport = require("passport");

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/google", passport.authenticate("jwt"), googleAuth)
  .get("/facebook", facebookAuth)
  .get("/facebook/callback", facebookCallback)
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .post("/logout", logout)
  .get("/users", getAllUsers)
  .post("/reset-password-request", resetPasswordRequest)
  .post("/reset-password", resetPassword)
  .get("/verify-email/:token", verifyEmail);

exports.router = router;
