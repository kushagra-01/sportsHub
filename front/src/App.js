



// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import your CSS file
import CalendarComponent from './components/Calender';

function App() {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
  });
  const [availableSlots, setavailableSlots] = useState([])
  const [bookingDeatails, setbookingDeatails] = useState([])

  const [shortBookingData, setShortBookingData] = useState({
    customerId: '',
    fieldType: 'Badminton',
    date: '',
    slotsBooked: '',
    Starttiming: '',
  });

  const [longBookingData, setLongBookingData] = useState({
    customerId: '',
    fieldType: 'Badminton',
    longTermStartDate: '',
    longTermEndDate: '',
  });

  const handleCustomerSubmit = (e) => {
    e.preventDefault();

    axios.post('https://sports-a5na.onrender.com/customer', customerData)
      .then(({ data }) => {
        const customerId = data._id;

        setShortBookingData(prevData => ({ ...prevData, customerId }));
        setLongBookingData(prevData => ({ ...prevData, customerId }));

        console.log('Customer created/found with ID:', customerId);
        alert(`Customer created/found with ID: ${customerId}`);
      })
      .catch((err) => {
        console.log(err.message);
        // Handle error if customer creation fails
      });
  };

  const handleShortBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      if (shortBookingData.customerId == '') {
        alert('Login First');
        return
      }
      const response = await axios.post('https://sports-a5na.onrender.com/booking/short', shortBookingData);
      console.log('Short-term booking created:', response.data);
      alert('Short-term booking created')
    } catch (error) {
      console.error('Error creating short-term booking:', error.response.data.error);
      alert(error.response.data.error)
    }
  };

  const handleLongBookingSubmit = async (e) => {
    e.preventDefault();

    try {

      if (longBookingData.customerId == '') {
        alert('Login First');
        return
      }
      const response = await axios.post('https://sports-a5na.onrender.com/booking/long-term', longBookingData);
      console.log('Long-term booking created:', response.data);
      alert('Long-term booking created')
    } catch (error) {
      console.error('Error creating long-term booking:', error.response.data.error);
      alert(error.response.data.error)
    }
  };

  function formatSimpleDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  function getSuggestSlots() {
    if(!shortBookingData.fieldType || !shortBookingData.date){
      alert("login again")
      return
    }
    alert('slots available shown')
    axios.post('https://sports-a5na.onrender.com/getAvailableSlots', {
      "fieldType": shortBookingData.fieldType,
      "date": shortBookingData.date


    }).then(({ data }) => {
      console.log(data)
      setavailableSlots(data.availableSlots)
    }).catch((err) => {
      console.log(err.message);
      // Handle error if customer creation fails
    });
  }


  const handleGetDetails = async () => {
    try {
      if (shortBookingData.customerId === '') {
        alert('Login First');
        return;
      }

      const token = '';
      const response = await axios.get(`https://sports-a5na.onrender.com/customer/${shortBookingData.customerId}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setbookingDeatails(response.data)
      console.log('Past and Upcoming Bookings:', response.data);
      alert('Past and Upcoming Bookings fetched successfully');
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
      alert(error.message);
    }
  };

  function roundToNearestHalfHour(time) {
    const [hours, minutes] = time.split(':');
    const roundedMinutes = Math.round(minutes / 30) * 30;
    const roundedTime = `${hours}:${String(roundedMinutes).padStart(2, '0')}`;
    return roundedTime;
  }


  return (
    <div className="app-container">
      <h1>Sports Booking App</h1>

      <h2>Customer Information</h2>
      <button onClick={handleGetDetails} className="get-details-button">Get Details</button>
      <form onSubmit={handleCustomerSubmit}>
        <label>
          Name:
          <input type="text" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} />
        </label>
        <br />
        <label>
          Email:
          <input type="text" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} />
        </label>
        <br />
        <button type="submit">Submit Customer Information</button>
        <div>
        
     
        </div>
      </form>
      <button onClick={getSuggestSlots}>My Calendar</button>
      <select>
          {availableSlots.map((el)=>{
            return (<option>{el}</option>)
          })}
        </select>
      <div className="booking-section">
        <div className="booking-form">
          <h2 onClick={getSuggestSlots}>Short-term Booking</h2>
          <form onSubmit={handleShortBookingSubmit}>
            <label>
              Field Type:
              <select value={shortBookingData.fieldType} onChange={(e) => setShortBookingData({ ...shortBookingData, fieldType: e.target.value })}>
                <option value="Badminton">Badminton</option>
                <option value="Football 7v7">Football 7v7</option>
                <option value="Football 11v11 / Cricket (7v7)">Football 11v11 / Cricket (7v7)</option>
                <option value='Tennis (Hardcourt) '>Tennis (Hardcourt) </option>
                {/* Add other field types as needed */}
              </select>
            </label>
            <br />
            <label>
              Date:
              <input type="date" value={shortBookingData.date} onChange={(e) => setShortBookingData({ ...shortBookingData, date: e.target.value })} />
            </label>
            <br />
            <label>
              Slots Booked:
              <input type="number" value={shortBookingData.slotsBooked} onChange={(e) => setShortBookingData({ ...shortBookingData, slotsBooked: parseInt(e.target.value, 10) })} />
            </label>
            <br />
            <label>
              Starttiming:
              <input
                type="time"
                value={shortBookingData.Starttiming}
                onChange={(e) => {
                  const inputTime = e.target.value;
                  const roundedTime = roundToNearestHalfHour(inputTime);
                  setShortBookingData({ ...shortBookingData, Starttiming: roundedTime });

                  // Display an alert message
                  alert(`Start timing set to: ${roundedTime}`);
                }}
              />
            </label>


            <br />

            <br />
            {/* Add as many fields as needed */}
            <button type="submit">Book Short-term</button>
          </form>
        </div>

        <div className="booking-form">
          <h2>Long-term Booking</h2>
          <form onSubmit={handleLongBookingSubmit}>
            <label>
              Field Type:
              <select value={longBookingData.fieldType} onChange={(e) => setLongBookingData({ ...longBookingData, fieldType: e.target.value })}>
                <option value="Badminton">Badminton</option>
                <option value="Football 7v7">Football 7v7</option>
                <option value="Football 11v11 / Cricket (7v7)">Football 11v11 / Cricket (7v7)</option>
                <option value='Tennis (Hardcourt) '>Tennis (Hardcourt) </option>
              </select>
            </label>
            <br />
            <label>
              Long Term Date Start:
              <input type="date" value={longBookingData.longTermStartDate} onChange={(e) => setLongBookingData({ ...longBookingData, longTermStartDate: e.target.value })} />
            </label>
            <br />
            <label>
              Long Term Date End:
              <input type="date" value={longBookingData.longTermEndDate} onChange={(e) => setLongBookingData({ ...longBookingData, longTermEndDate: e.target.value })} />
            </label>
            {/* Other long booking form fields */}
            <button type="submit">Book Long-term</button>
          </form>
        </div>
      </div>

      <div className="booking-details">

        <h2>Past Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Field Type</th>
              <th>Slots Booked</th>
              <th>Starttiming</th>
            </tr>
          </thead>
          <tbody>
            {bookingDeatails?.pastBookings?.map(booking => (
              <tr key={booking._id}>
                <td>{formatSimpleDate(booking.date)}</td>
                <td>{booking.fieldType}</td>
                <td>{booking.slotsBooked}</td>
                <td>{booking.Starttiming}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Upcoming Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Field Type</th>
              <th>Slots Booked</th>
              <th>Start timing</th>
              <th>End timing</th>
            </tr>
          </thead>
          <tbody>
            {bookingDeatails?.upcomingBookings?.length !== 0 && bookingDeatails?.upcomingBookings?.map(booking => (
              <tr key={booking._id}>
                <td>{formatSimpleDate(booking.date)}</td>
                <td>{booking.fieldType}</td>
                <td>{booking.slotsBooked}</td>
                <td>{booking.Starttiming}</td>
                <td>{booking.endTiming}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Long Booking</h2>
        <table>
          <thead>
            <tr>

              <th>Field Type</th>

              <th>Start timing</th>
              <th>End timing</th>
            </tr>
          </thead>
          <tbody>
            {bookingDeatails?.LongTermBooking?.length !== 0 && bookingDeatails?.LongTermBooking?.map(booking => (
              <tr key={booking._id}>

                <td>{booking.fieldType}</td>

                <td>{formatSimpleDate(booking.longTermStartDate)}</td>
                <td>{formatSimpleDate(booking.longTermEndDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default App;

