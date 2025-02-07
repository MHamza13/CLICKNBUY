const express = require("express");
const router = express.Router();
const {
  createAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
} = require("../controller/Attribute");

router
  .post("/", createAttribute)
  .get("/", getAllAttributes)
  .get("/:id", getAttributeById)
  .patch("/:id", updateAttribute)
  .delete("/:id", deleteAttribute);

exports.router = router;
