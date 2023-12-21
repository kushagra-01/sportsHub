import axios from "axios";
import { useState } from "react";
import './login.css'
import { useNavigate } from "react-router-dom";
const Login = () => {
const navigate = useNavigate()
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
  });



  const handleCustomerSubmit = (e) => {
    e.preventDefault();

    axios.post('https://sports-a5na.onrender.com/api/customer', customerData)
      .then(({ data }) => {
        const customerId = data._id;
        localStorage.setItem('customerId', customerId);

        console.log('Customer created/found with ID:', customerId);
        alert(`Customer created/found with ID: ${customerId}`);
        navigate('/main')
      })
      .catch((err) => {
        console.log(err.message);
        // Handle error if customer creation fails
      });
  };

  return (
    <>
      <h1>Sports Booking App</h1>

      <h2>Customer Information</h2>

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
    </>
  )
}

export default Login;
