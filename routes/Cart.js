const express = require("express");
const {
  fetchCartByUser,
  addToCart,
  updateCart,
  deleteFromCart,
} = require("../controller/Cart");

const router = express.Router();
// brands is already added in base path
router
  .post("/", addToCart)
  .get("/", fetchCartByUser)
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);

exports.router = router;
