const express = require("express");
const router = express.Router();
const forexController = require("../controllers/forexController");

router.post("/", forexController.sendForexDetails);

module.exports = router;
