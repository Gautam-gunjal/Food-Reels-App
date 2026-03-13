import React from 'react'
import '../../styles/auth-page.css'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const UserRegister = () => {
    const navigate = useNavigate()
    const onSubmit = async (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value

    try {
        await axios.post("http://localhost:3000/api/auth/user/register",
            {
                name: name,
                email: email,
                password: password

            }, { withCredentials: true }
        )
        navigate("/");
    } catch (err) {
        console.log(err)
    }
}
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create account</h2>
                <p>Serving flavors, not just reels.</p>

                <form onSubmit={onSubmit}>
                    <div className="field">
                        <label>Name</label>
                        <input type="text" placeholder="Your name" name="name" />
                    </div>

                    <div className="field">
                        <label>Email</label>
                        <input type="email" placeholder="you@example.com" name="email" />
                    </div>

                    <div className="field">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" name="password" />
                    </div>


                    <div className="actions">
                        <button type="submit" className="btn">Create account</button>
                        <div className="link-muted">Already have an account? <a href="/user/login">Login</a></div>
                    </div>

                    <div className="link-muted" style={{marginTop:10}}>
                        Register as Food Partner? <Link to="/food-partner/register">Switch to Partner</Link>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default UserRegister;
