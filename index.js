const express = require("express");
require("dotenv").config();
require("./db/DbConnection"); // Ensure your database connection is established correctly
const server = express();
const productRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brand");
const categoriesRouter = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { User } = require("./modle/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const { isAuth, sanitizaUser, cookieExtractor } = require("./server/Common");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");

server.use(express.json({ limit: "10mb" }));
server.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
// Web Hook

const endpointSecret = process.env.ENDPOINT_SECRET;

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

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
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// JWT Opptions

var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; // TODO should  not be code

// Middleware

server.use(express.static(path.resolve(__dirname, "dist")));
server.use(cookieParser());

server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

// Initialize Passport
server.use(passport.initialize());
server.use(passport.session());

// Use CORS
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

// Middleware to parse JSON and URL-encoded form data
server.use(express.json());
server.use(express.urlencoded({ extended: true })); // Add this to parse form data if login is using form submission

// Route handlers
server.use("/products", isAuth(), productRouter.router); // we can also use JWT token for client-only auth
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), ordersRouter.router);
server.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.htnl")));

// Passport local strategy
passport.use(
  "local",

  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
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
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(
            sanitizaUser(user),
            process.env.JWT_SECRET_KEY
          );
          done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
        }
      );
    } catch (err) {
      return done(err);
    }
  })
);

//  Jwt strategy

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log(jwt_payload);
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizaUser(user)); // this is calls serializer
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Session serialization
passport.serializeUser(function (user, cb) {
  console.log("serializeUser", user);
  process.nextTick(function () {
    cb(null, { id: user.id, role: user.role });
  });
});

// Session deserialization
passport.deserializeUser(function (user, cb) {
  console.log("de-serializeUser", user);
  process.nextTick(function () {
    cb(null, sanitizaUser(user));
  });
});

// Paynment

const stripe = require("stripe")(process.env.STRIPE_SERVER_KRY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, //for decimal compensation
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Start server
server.listen(process.env.PORT, () => {
  console.log("server started");
});
