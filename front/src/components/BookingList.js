// BookingList.js
import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const BookingList = ({ customerId }) => {
  const [bookings, setBookings] = useState({ pastBookings: [], upcomingBookings: [] });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiService.getBookingsForCustomer(customerId);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error.response.data.error);
        // Add logic for error notification
      }
    };

    fetchBookings();
  }, [customerId]);

  return (
    <div>
      <h2>Past Bookings</h2>
      <ul>
        {bookings.pastBookings.map((booking) => (
          <li key={booking._id}>
            {booking.fieldName} - {booking.date} - {booking.slotsBooked} slots
          </li>
        ))}
      </ul>

      <h2>Upcoming Bookings</h2>
      <ul>
        {bookings.upcomingBookings.map((booking) => (
          <li key={booking._id}>
            {booking.fieldName} - {booking.date} - {booking.slotsBooked} slots
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
