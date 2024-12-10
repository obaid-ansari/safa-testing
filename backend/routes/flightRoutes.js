const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flightController");

// POST route for flight booking
router.post("/", flightController.handleBooking);

module.exports = router;
