import React, { useState } from 'react'
import "../../styles/auth-page.css"
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const FoodPartnerLogin = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const onSubmit = async (e) => {

    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      await axios.post(
        "https://food-reels-app.onrender.com/api/auth/food-partner/login",
        {
          email: email,
          password: password
        },
        { withCredentials: true }
      );

      setError(""); // clear error
      navigate("/Createfood");

    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Partner login</h2>
        <p>Access your partner dashboard.</p>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" name='email' placeholder="contact@business.com" />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="actions">
            <button type="submit" className="btn">Login</button>
            <div className="link-muted">Don't have an account? <Link to="/food-partner/register">Register</Link></div>
          </div>

          <div className="link-muted" style={{ marginTop: 10 }}>
            Or login as a normal user? <Link to="/user/login">User login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FoodPartnerLogin
