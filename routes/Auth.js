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
const querystring = require('querystring');

const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/google", googleAuth)
  .get("/facebook", facebookAuth)
  .get("/facebook/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Missing authorization code",
        message: "Facebook login authorization failed. Please try again.",
      });
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v12.0/oauth/access_token?` +
          querystring.stringify({
            client_id: "1126230255556278", // Facebook App ID
            redirect_uri:
              "https://my-store-kappa-nine.vercel.app/auth/facebook/callback", // Your redirect URI
            client_secret: "27f95b19aa0d22b8029ea94d97b18d57", // Your Facebook App Secret
            code,
          })
      );

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange authorization code for access token");
      }

      const tokenData = await tokenResponse.json();
      const { access_token } = tokenData;

      // Fetch user info using access token
      const userResponse = await fetch(
        `https://graph.facebook.com/me?` +
          querystring.stringify({
            access_token,
            fields: "id,name,email", // Fetching user's Facebook ID, name, and email
          })
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info from Facebook");
      }

      const user = await userResponse.json();

      // Handle login or account creation logic here
      // This is where you'd typically check if the user exists, or create a new user
      res.status(200).send(`Welcome, ${user.name}!`);

    } catch (error) {
      console.error("Error during Facebook login:", error.message);
      res.status(500).json({
        error: error.message,
        message: "An error occurred during Facebook authentication. Please try again later.",
      });
    }
  })
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .post("/logout", logout)
  .get("/users", getAllUsers)
  .post("/reset-password-request", resetPasswordRequest)
  .post("/reset-password", resetPassword)
  .get("/verify-email/:token", verifyEmail);

exports.router = router;
