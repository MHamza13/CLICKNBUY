const express = require("express");
const {
  fetchWishlistByUser,
  addToWishlist,
  deleteFromWishlist,
} = require("../controller/WishList");

const router = express.Router();

router
  .get("/", fetchWishlistByUser)
  .post("/", addToWishlist)
  .delete("/:id", deleteFromWishlist);

exports.router = router;
