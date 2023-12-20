const Booking = require('../models/Booking');
const Customer = require('../models/Customer');

exports.getAvailableSlots = async (req, res) => {
    try {
        const { fieldType, date } = req.body;

        // Check if there are existing bookings for the given date and field type
        const existingBookings = await Booking.find({
            date,
            fieldType,
        });

        // Get all slots for the day
        const allSlots = Array.from({ length: 48 }, (_, i) => i); // Assuming each slot is 30 minutes

        // Filter out booked slots
        const bookedSlots = existingBookings.reduce((slots, booking) => {
            const bookingStart =
                parseInt(booking.Starttiming.split(':')[0]) * 2 +
                parseInt(booking.Starttiming.split(':')[1]) / 30;
            const bookingEnd =
                parseInt(booking.endTiming.split(':')[0]) * 2 +
                parseInt(booking.endTiming.split(':')[1]) / 30;
            return [...slots, ...Array.from({ length: bookingEnd - bookingStart }, (_, i) => bookingStart + i)];
        }, []);

        // Convert available slots to time format
        const availableSlots = allSlots
            .filter((slot) => !bookedSlots.includes(slot))
            .map((slot) => {
                const hours = Math.floor(slot / 2);
                const minutes = (slot % 2) * 30;
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            });

        res.status(200).json({
            availableSlots,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getCustomerBookings = async (req, res) => {
    try {
        const customerId = req.params.customerId;

        // Get the current date
        const currentDate = new Date();

        // Find both past and upcoming bookings for the customer
        const bookings = await Booking.find({ customerId });

        const pastBookings = bookings.filter((booking) => booking.date < currentDate);
        const upcomingBookings = bookings.filter((booking) => booking.date >= currentDate);

        const LongTermBooking = bookings.filter((booking) => booking.isLongTerm == true);

        res.status(200).json({ pastBookings, upcomingBookings, LongTermBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createShortTermBooking = async (req, res) => {
    try {
        const { customerId, fieldType, date, slotsBooked, Starttiming } = req.body;

        const [hours, minutes] = Starttiming.split(':').map(Number);
        const startTiming = new Date(2000, 0, 1, hours, minutes);
        const endTiming = new Date(startTiming.getTime() + slotsBooked * 30 * 60 * 1000);
        const formattedendTiming = `${endTiming.getHours()}:${endTiming.getMinutes().toString().padStart(2, '0')}`;

        // Validate customer
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Check daily booking limit
        const customerBookings = await Booking.find({ customerId, date });
        const totalSlotsBookedOnDate = customerBookings.reduce((total, booking) => total + booking.slotsBooked, 0);

        if (totalSlotsBookedOnDate + slotsBooked > 4) {
            return res.status(400).json({
                error: 'Customer cannot book more than 4 slots in a day',
            });
        }

        const existingBookings = await Booking.find({
            date,
            $or: [
                {
                    Starttiming: { $lt: endTiming },
                    endTiming: { $gt: Starttiming },
                },
            ],
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({
                error: 'Requested time slot is not available',
            });
        }

        const newBooking = new Booking({
            customerId,
            fieldType,
            date,
            slotsBooked,
            Starttiming,
            endTiming: formattedendTiming, // Add end timing to the booking
        });
        const savedBooking = await newBooking.save();

        res.status(201).json(savedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createLongTermBooking = async (req, res) => {
    try {
        const { customerId, fieldType, date, slotsBooked, Starttiming, longTermStartDate, longTermEndDate } = req.body;

        // Validate customer
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const startDate = new Date(longTermStartDate);
        const endDate = new Date(longTermEndDate);

        if (startDate > endDate || endDate - startDate < 7 * 24 * 60 * 60 * 1000 || endDate - startDate > 2 * 30 * 24 * 60 * 60 * 1000) {
            return res.status(400).json({
                error: 'Invalid long-term booking duration. Must be between 1 week and 2 months.',
            });
        }

        const newBooking = new Booking({
            customerId,
            fieldType,
            date,
            slotsBooked,
            Starttiming,
            isLongTerm: true,
            longTermStartDate,
            longTermEndDate,
        });

        const savedBooking = await newBooking.save();

        res.status(201).json(savedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
