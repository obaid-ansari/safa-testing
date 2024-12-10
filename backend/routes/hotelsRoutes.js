const express = require("express");
const router = express.Router();
const hotelsController = require("../controllers/hotelsController");

// Define the route for hotel booking
router.post("/", hotelsController.bookHotel);

module.exports = router;
