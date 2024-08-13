const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController'); // Adjust path as needed

router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getBookings);
router.get('/bookings/new', bookingController.getNewBookings);
router.post('/bookings/:id/approve', bookingController.approveBooking);
router.post('/bookings/:id/reject', bookingController.rejectBooking);

module.exports = router;
