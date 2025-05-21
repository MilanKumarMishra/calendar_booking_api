const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create booking
router.post("/", bookingController.createBooking);

// Get all bookings
router.get("/", bookingController.getBookings);

// Update a booking
router.put("/:id", bookingController.updateBooking);

// Delete a booking
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
