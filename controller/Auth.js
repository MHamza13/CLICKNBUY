const { User } = require("../modle/User");
const crypto = require("crypto");
const { sanitizaUser, sendMail } = require("../server/Common");
const jwt = require("jsonwebtoken");

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
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizaUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(
              sanitizaUser(doc),
              process.env.JWT_SECRET_KEY
            );
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: user.id, role: user.role });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.token) {
      return res
        .status(400)
        .json({ message: "User not authenticated or token missing" });
    }

    console.log("Setting JWT Cookie for user:", user);

    res.cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
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
  res
    .cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ success: true, message: "Logout successful" });
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: "Error fetching users", error: err });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  console.log("Received:", user);

  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();

    const resetPage = `http://localhost:5173/reset-password?token=${token}&email=${email}`;
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
