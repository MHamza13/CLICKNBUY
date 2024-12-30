const express = require("express");
const {
  fetchBrands,
  createBrand,
  fetchBrandsUserId,
  fetchBrandsByID,
  updateBrands,
  deletebrands,
} = require("../controller/Brand");

const router = express.Router();
router
  .get("/", fetchBrands)
  .post("/", createBrand)
  .get("/user/:id", fetchBrandsUserId)
  .get("/:id", fetchBrandsByID)
  .patch("/:id", updateBrands)
  .delete("/:id", deletebrands);

exports.router = router;
