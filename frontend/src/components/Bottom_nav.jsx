import React from "react";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <div className="reels-bottom-nav" role="navigation" aria-label="bottom navigation">
      <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} end>
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor"><path d="M226.67-186.67h140v-246.66h226.66v246.66h140v-380L480-756.67l-253.33 190v380ZM160-120v-480l320-240 320 240v480H526.67v-246.67h-93.34V-120H160Zm320-352Z"/></svg>
        <span>Home</span>
      </NavLink>
      <NavLink to="/saved" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor"><path d="M200-120v-656.67q0-27 19.83-46.83 19.84-19.83 46.84-19.83h426.66q27 0 46.84 19.83Q760-803.67 760-776.67V-120L480-240 200-120Zm66.67-101.33L480-312l213.33 90.67v-555.34H266.67v555.34Zm0-555.34h426.66-426.66Z"/></svg>

        <span>Saved</span>
      </NavLink>
    </div>
  );
};
export default BottomNav;
