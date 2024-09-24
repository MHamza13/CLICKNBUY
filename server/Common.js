const passport = require("passport");
const nodemailer = require("nodemailer");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizaUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
    console.log("Extracted JWT Token:", token);
  }

  // token =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWE3ZDkxNjIwZTM0MDM4MWNhMTYwZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNjg5Mjk4OX0.x4us9kKYvI3-af9NN8tnCPJNtVImGQCDeszciRQ13eQ";
  return token;
};

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "iamhamza013@gmail.com", // gmail
    pass: process.env.EMAIL_PASSWORD, // pass
  },
});

exports.sendMail = async function ({ to, subject, text, html }) {
  let info = await transporter.sendMail({
    from: '"E-commerce" <iamhamza013@gmail.com>', // sender address
    to,
    subject,
    text,
    html,
  });
  return info;
};
