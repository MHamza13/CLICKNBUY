// backend/routes/Products.js

const express = require("express");
const {
  createProduct,
  fetchAllProduct,
  fetchProductById,
  updateProduct,
  Getproducts,
} = require("../controller/Product");

const router = express.Router();

router
  .get("/all", Getproducts)
  .post("/", createProduct)
  .get("/", fetchAllProduct)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);

module.exports = { router };
