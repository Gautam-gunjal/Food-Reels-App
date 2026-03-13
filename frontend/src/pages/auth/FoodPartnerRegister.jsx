import React, { useState } from 'react'
import '../../styles/auth-page.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const FoodPartnerRegister = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const onSubmit = async (e) => {

    e.preventDefault()
    const BusinessName = e.target.businessName.value
    const Contactperson = e.target.contactPerson.value
    const Address = e.target.address.value
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      await axios.post("https://food-reels-app.onrender.com/api/auth/food-partner/register",
        {
          Businessname: BusinessName,
          Contactperson: Contactperson,
          Address: Address,
          email: email,
          password: password
        }, { withCredentials: true }
      )
      navigate("/Createfood");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Partner registration</h2>
        <p>Register your restaurant or food business.</p>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Business name</label>
            <input type="text" name="businessName" placeholder="Business or restaurant name" />
          </div>

          <div className="field">
            <label>Contact person</label>
            <input type="text" name="contactPerson" placeholder="Your name" />
          </div>

          <div className="field">
            <label>Address</label>
            <input type="text" name="address" placeholder="Your Address" />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="contact@business.com" />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" />
          </div>

          {error && (<p className="error-message"> {error}</p>)}

          <div className="actions">
            <button type="submit" className="btn">Register partner</button>
            <div className="link-muted">Already partnered? <Link to="/food-partner/login">Login</Link></div>
          </div>

          <div className="link-muted" style={{ marginTop: 10 }}>
            Register as a normal user? <Link to="/user/register">Switch to user</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FoodPartnerRegister
