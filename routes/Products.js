// backend/routes/Products.js

const express = require("express");
const {
  createProduct,
  fetchAllProduct,
  fetchProductById,
  updateProduct,
} = require("../controller/Product");

const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProduct)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);

module.exports = { router };
