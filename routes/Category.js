const express = require("express");
const {
  fetchCategories,
  createCategory,
  fetchCategoriesByID,
  updateCategory,
  deleteCategory,
} = require("../controller/Category");

const router = express.Router();
router
  .get("/", fetchCategories)
  .post("/", createCategory)
  .get("/:id", fetchCategoriesByID)
  .patch("/:id", updateCategory)
  .delete("/:id", deleteCategory);

exports.router = router;
