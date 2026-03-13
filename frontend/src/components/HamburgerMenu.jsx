import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/HamburgerMenu.css";
import axios from "axios";
import { useEffect } from "react";

const HamburgerMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(null)


  useEffect(() => {
    const getRole = async () => {
      const role = await axios.get('https://food-reels-app.onrender.com/api/auth/role', { withCredentials: true })
      setRole(role.data.role)
    }
    getRole()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://food-reels-app.onrender.com/api/auth/user/logout",
        {},
        { withCredentials: true }
      );

      navigate("/user/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="hm-wrapper">
      {/* Hamburger Button */}
      <button
        className={`hm-button ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu */}
      {open && (
        <div className="hm-menu">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          {role === "foodPartner" ? (
            <Link to="/Createfood" onClick={() => setOpen(false)}>
              Create Food
            </Link>
          ) : (
            <Link to="/saved" onClick={() => setOpen(false)}>
              Saved
            </Link>
          )}
          <button className="hm-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;