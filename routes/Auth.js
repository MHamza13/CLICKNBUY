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
  .get("/google", googleAuth)
  .get("/facebook", facebookAuth)
  .get("/facebook/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Missing authorization code.");
    }

    try {
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v12.0/oauth/access_token?` +
          querystring.stringify({
            client_id: "1126230255556278",
            redirect_uri:
              "https://my-store-kappa-nine.vercel.app/auth/facebook/callback",
            client_secret: "27f95b19aa0d22b8029ea94d97b18d57",
            code,
          })
      );

      if (!tokenResponse.ok) {
        throw new Error(
          "Failed to exchange authorization code for access token"
        );
      }

      const tokenData = await tokenResponse.json();
      const { access_token } = tokenData;

      const userResponse = await fetch(
        `https://graph.facebook.com/me?` +
          querystring.stringify({
            access_token,
            fields: "id,name,email",
          })
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info");
      }

      const user = await userResponse.json();

      res.status(200).send(`Welcome, ${user.name}!`);
    } catch (error) {
      console.error("Error during Facebook login:", error.message);
      res.status(500).send("An error occurred during authentication.");
    }
  })
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .post("/logout", logout)
  .get("/users", getAllUsers)
  .post("/reset-password-request", resetPasswordRequest)
  .post("/reset-password", resetPassword)
  .get("/verify-email/:token", verifyEmail);

exports.router = router;
