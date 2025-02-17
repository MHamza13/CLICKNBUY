const express = require("express");
require("dotenv").config();
require("./db/DbConnection");
const server = express();
const productRouter = require("./routes/Products");
const ratingRoutes = require("./routes/Ratting");
const brandsRouter = require("./routes/Brand");
const categoriesRouter = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const contactRouter = require("./routes/contact");
const subCategoriesRouter = require("./routes/SubCategory");
const attributeRouter = require("./routes/Attribute");
const wishlistRouter = require("./routes/WishList");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { User } = require("./modle/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const { isAuth, sanitizaUser, cookieExtractor } = require("./server/Common");
const JwtStrategy = require("passport-jwt").Strategy;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");
const FacebookStrategy = require("passport-facebook").Strategy;
const sendEmail = require("./server/Common");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Stripe setup
const stripe = require("stripe")(process.env.STRIPE_SERVER_KRY);

// Middleware configurations
server.use(express.json({ limit: "10mb" }));
server.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
server.use(cookieParser());
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Session setup
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport initialization
server.use(passport.initialize());
server.use(passport.session());

// Static file serving for frontend
server.use(express.static(path.resolve(__dirname, "dist")));

// API routes
server.use("/products", productRouter.router);
server.use("/ratings", ratingRoutes.router);
server.use("/categories", categoriesRouter.router);
server.use("/sub-categories", subCategoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/attributes", attributeRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/carts", isAuth(), cartRouter.router);
server.use("/wishlist", isAuth(), wishlistRouter.router);
server.use("/orders", isAuth(), ordersRouter.router);
server.use("/contact", isAuth(), contactRouter.router);

// Payment routes
server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // Decimal compensation
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});

// Webhook route for Strip

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];
    const endpointSecret = process.env.ENDPOINT_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log({ paymentIntentSucceeded });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
  }
);

// Passport local and JWT strategies
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
          return done(null, false, { message: "invalid credentials" });
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async (err, hashedPassword) => {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            }
            const token = jwt.sign(
              sanitizaUser(user),
              process.env.JWT_SECRET_KEY
            );
            done(null, { id: user.id, role: user.role, token });
          }
        );
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, sanitizaUser(user));
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Passport Google strategies

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECERET,
      callbackURL:
        process.env.GOOGLE_REDIRECT_URI ||
        "http://localhost:8080/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImage: profile.photos[0].value,
            emailVerified: true,
            provider: "google",
          });
        }

        const jwtSecret = process.env.JWT_SECRET_KEY || "default_secret_key";
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          jwtSecret,
          {
            expiresIn: process.env.JWT_TIMEOUT || "1h",
          }
        );

        return done(null, { user, token });
      } catch (error) {
        console.error("Error during Google OAuth:", error);
        return done(error, null);
      }
    }
  )
);

// Passport FaceBook strategies

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL:
        "https://my-store-orpin-chi.vercel.app/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
      scope: ["public_profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email = profile.emails?.[0]?.value || null;

        console.log("Facebook Profile:", profile);

        let user = await User.findOne({
          accountId: profile.id,
          provider: "facebook",
        });

        if (!user) {
          console.log("Adding new Facebook user to DB...");

          user = new User({
            accountId: profile.id,
            name: profile.displayName,
            email,
            provider: profile.provider,
          });

          await user.save();
          console.log("New user added:", user);
        } else {
          console.log("Facebook User already exists in DB:", user);

          if (!user.email && email) {
            user.email = email;
            await user.save();
            console.log("User email updated:", user.email);
          }
        }

        if (email) {
          const emailSubject = "Welcome to My Store!";
          const emailText = `Dear ${user.name}, welcome to My Store! You have successfully logged in to your account using Facebook. Start exploring our exciting products and enjoy a seamless shopping experience!`;
          const emailHTML = `...`;

          try {
            await sendEmail(email, emailSubject, emailText, emailHTML);
            console.log(`Login success email sent to ${email}`);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
        } else {
          console.log("No email available to send the login success email.");
        }

        return cb(null, user);
      } catch (error) {
        console.error("Error in FacebookStrategy:", error);
        return cb(error, null);
      }
    }
  )
);

// Session serialization and deserialization
passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, { id: user.id, role: user.role }));
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, sanitizaUser(user)));
});

// Catch-all route for serving the frontend (this must be the last route)
server.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));

// Start the server
server.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
