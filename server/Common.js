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
  }
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZGZkNGE1OWUyMzhkZTZkZWY0NzZkNyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI1OTQ0OTk3fQ.QJv8Lg8q8ESyE0sXiLObrPGkd-Ivezw7TiT1emlUoxU";
  return token;
};
