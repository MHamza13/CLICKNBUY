const { User } = require("../modle/User");
const crypto = require("crypto");
const { sanitizaUser, sendMail } = require("../server/Common");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../server/Common");
const passport = require("passport");

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          return res.status(500).json({ message: "Error hashing password" });
        }

        const verificationToken = crypto.randomBytes(48).toString("hex");
        const verificationTokenExpires = Date.now() + 3600000;

        const user = new User({
          ...req.body,
          password: hashedPassword,
          salt,
          emailVerified: false,
          verificationToken,
          verificationTokenExpires,
        });

        const doc = await user.save();

        const verificationLink = `https://my-store-orpin-chi.vercel.app/verify-email/${verificationToken}`;

        const subject = "Verify Your Email for E-commerce";
        const html = `
        <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationLink}">Verify Email</a></p>
      `;

        try {
          await sendMail({ to: req.body.email, subject, html });
          res.status(201).json({
            message: "User created. Verification email sent.",
            id: user.id,
          });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          res.status(500).json({ message: "Error sending verification email" });
        }
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    if (!token) {
      return res.status(400).json({ message: "Missing verification token." });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
    }

    if (user.verificationTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Verification token has expired." });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.googleAuth = async (req, res) => {
  const code = req.query.code;

  try {
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required." });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    if (!userRes.ok) {
      const error = await userRes.json();
      throw new Error(`Google API error: ${error.error.message}`);
    }

    const { email, name, picture } = await userRes.json();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        profileImage: picture,
        emailVerified: true,
        provider: "google",
      });
    }

    const jwtSecret = process.env.JWT_SECRET_KEY || "default_secret_key";
    const token = jwt.sign({ _id: user._id, email }, jwtSecret, {
      expiresIn: process.env.JWT_TIMEOUT || "1h",
    });

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3600000), 
      httpOnly: true,
      sameSite: "lax", 
    });

    return res.status(200).json({
      message: "success",
      token,
      user,
    });
  } catch (err) {
    console.error("Error during Google Authentication:", err.message);

    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


exports.facebookAuth = passport.authenticate("facebook", {
  scope: ["public_profile", "email"],
});

exports.facebookCallback = passport.authenticate("facebook", {
  failureRedirect: "https://my-store-orpin-chi.vercel.app/login",
  successRedirect: "https://my-store-orpin-chi.vercel.app",
});

exports.loginUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.token) {
      return res
        .status(400)
        .json({ message: "User not authenticated or token missing" });
    }

    res.cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      id: user.id,
      role: user.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: false,
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ message: "Logged out successfully, cookie cleared." });
    console.log("JWT cookie cleared");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error during logout" });
  }
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

exports.getAllUsers = async (req, res) => {
  let query = User.find({});
  let totalUsersQuery = User.find({});

  const totalDocs = await totalUsersQuery.countDocuments().exec();

  try {
    const users = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: "Error fetching users", error: err });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();

    const resetPage = `https://e-commerence-store-lemon.vercel.app/reset-password?token=${token}&email=${email}`;
    const subject = "Reset Password for E-commerce";
    const html = `<p>Click <a href="${resetPage}">here</a> to reset password</p>`;

    if (req.body.email) {
      try {
        const response = await sendMail({ to: req.body.email, subject, html });
        res.json(response);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  const user = await User.findOne({ email: email, resetPasswordToken: token });

  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          return res.status(500).json({ message: "Error hashing password" });
        }

        user.password = hashedPassword;
        user.salt = salt;
        user.resetPasswordToken = undefined;

        await user.save();

        const subject = "Password successfully reset for E-commerce";
        const html = `<p>Successfully reset your password.</p>`;

        try {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        } catch (error) {
          res.status(500).json({ error: "Failed to send confirmation email" });
        }
      }
    );
  } else {
    res.status(400).json({ message: "Invalid email or token" });
  }
};
