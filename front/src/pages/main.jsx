import axios from "axios";
import { useEffect, useState } from "react";
import './main.css'
const Main = () => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [customerId, setCustomerId] = useState(localStorage.getItem('customerId'));

    const [shortBookingData, setShortBookingData] = useState({
        customerId,
        fieldType: 'Badminton',
        date: '',
        slotsBooked: '',
        Starttiming: '',
    });

    const [longBookingData, setLongBookingData] = useState({
        customerId,
        fieldType: 'Badminton',
        longTermStartDate: '',
        longTermEndDate: '',
    });

    useEffect(() => {
        handleGetDetails();
    }, [customerId]);

    const handleShortBookingSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!customerId) {
                alert('Login First');
                return;
            }

            const response = await axios.post('https://sports-a5na.onrender.com/api/booking/short', shortBookingData);
            console.log('Short-term booking created:', response.data);
            alert('Short-term booking created');
            getSuggestSlots()
            handleGetDetails()
        } catch (error) {
            console.error('Error creating short-term booking:', error.response.data.error);
            alert(error.response.data.error);
            getSuggestSlots()
        }
    };

    const handleLongBookingSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!customerId) {
                alert('Login First');
                return;
            }

            const response = await axios.post('https://sports-a5na.onrender.com/api/booking/long-term', longBookingData);
            console.log('Long-term booking created:', response.data);
            alert('Long-term booking created');
            handleGetDetails()
        } catch (error) {
            console.error('Error creating long-term booking:', error.response.data.error);
            alert(error.response.data.error);
        }
    };

    const formatSimpleDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const getSuggestSlots = async () => {
        if (!shortBookingData.fieldType || !shortBookingData.date) {
            alert("Login again");
            return;
        }

        try {
          
            const { data } = await axios.post('https://sports-a5na.onrender.com/api/getAvailableSlots', {
                fieldType: shortBookingData.fieldType,
                date: shortBookingData.date,
            });
            setAvailableSlots(data.availableSlots);
           
        } catch (error) {
            console.error('Error getting available slots:', error.message);
            alert('Error getting available slots');
        }
    };

    const handleGetDetails = async () => {
        try {
            if (!customerId) {
                alert('Login First');
                return;
            }

            const token = ''; // Replace with your actual token
            const response = await axios.get(`https://sports-a5na.onrender.com/api/customer/${customerId}/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookingDetails(response.data);
            console.log('Past and Upcoming Bookings:', response.data);
          
        } catch (error) {
            console.error('Error fetching bookings:', error.message);
            alert('Error fetching bookings');
        }
    };

    const roundToNearestHalfHour = (time) => {
        const [hours, minutes] = time.split(':');
        const roundedMinutes = Math.round(minutes / 30) * 30;
        const roundedTime = `${hours}:${String(roundedMinutes).padStart(2, '0')}`;
        return roundedTime;
    };

    return (
        <div style={{display:'flex',justifyContent:'space-between'}}>
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
                            <br /> </label>
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
                        <button type="submit">Book Short-term</button>
                        <label>Available slots</label>
                        <select>
                            {availableSlots.map((el) => {
                                return (<option>{el}</option>)
                            })}
                        </select>
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
                        {bookingDetails?.pastBookings?.map(booking => (
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
                        {bookingDetails?.upcomingBookings?.length !== 0 && bookingDetails?.upcomingBookings?.map(booking => (
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
                        {bookingDetails?.LongTermBooking?.length !== 0 && bookingDetails?.LongTermBooking?.map(booking => (
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
};

export default Main;
