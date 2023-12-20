const express = require('express');
const router = express.Router();
const customerController = require('./controllers/customerController');
const bookingController = require('./controllers/bookingController');

router.post('/customer', customerController.createCustomer);
router.post('/getAvailableSlots', bookingController.getAvailableSlots);
router.get('/customer/:customerId/bookings', bookingController.getCustomerBookings);
router.post('/booking/short', bookingController.createShortTermBooking);
router.post('/booking/long-term', bookingController.createLongTermBooking);

module.exports = router;
