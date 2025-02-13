const express = require("express");
const {
  createRating,
  getRatings,
  getRatingById,
  updateRating,
  deleteRating,
} = require("../controller/Ratting");

const router = express.Router();

router
  .post("/", createRating)
  .get("/", getRatings)
  .get("/:id", getRatingById)
  .patch("/:id", updateRating)
  .delete("/:id", deleteRating);

exports.router = router;
