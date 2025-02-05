const express = require("express");

const { isAuth } = require("../server/Common");
const { addSubCategory, getSubCategories, getSubCategoriesById, updateSubCategory, deleteSubCategory } = require("../controller/SubCategory");

const router = express.Router();
router
  .post("/", isAuth(), addSubCategory)
  .get("/", isAuth(), getSubCategories)
  .get("/:id", isAuth(), getSubCategoriesById)
  .patch("/:id", isAuth(), updateSubCategory)
  .delete("/:id", isAuth(), deleteSubCategory);

exports.router = router;
