const express = require("express");
const { createContact, getContacts } = require("../controller/contact");

const router = express.Router();

router.post("/", createContact).get("/", getContacts);

exports.router = router;
