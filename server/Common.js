const passport = require("passport");

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
    console.log("Extracted JWT Token:", token); // Debugging to see if the token is being extracted
  }
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWE3ZDkxNjIwZTM0MDM4MWNhMTYwZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI2NjQzODg0fQ.XUzhqgPmLkbuvTHXU4KX7aeZ9fIwn8eINMZvCQC_ZmM";
  return token;
};
