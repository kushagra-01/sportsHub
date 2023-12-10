// BookingForm.js
import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const BookingForm = () => {
  const [bookingData, setBookingData] = useState({
    customerName: '',
    email: '',
    fieldId: '',
    date: '',
    slotsBooked: 1,
  });

  
  const [error, setError] = useState('');

 const availableFields = []

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createBooking(bookingData);
      console.log('Booking created:', response.data);
      // Add logic for success notification or redirect
    } catch (error) {
      setError(error.response.data.error);
      // Add logic for error notification
    }
  };

  return (
    <div>
      <h2>Book a Field</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={bookingData.customerName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={bookingData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="fieldId">Select Field:</label>
          <select
            id="fieldId"
            name="fieldId"
            value={bookingData.fieldId}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select Field --</option>
            {availableFields.map((field) => (
              <option key={field._id} value={field._id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={bookingData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="slotsBooked">Number of Slots:</label>
          <input
            type="number"
            id="slotsBooked"
            name="slotsBooked"
            value={bookingData.slotsBooked}
            onChange={handleInputChange}
            min="1"
            max="4"
            required
          />
        </div>
        <button type="submit">Book Now</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default BookingForm;
