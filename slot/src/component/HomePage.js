// HomePage.js
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Slot Booking</h1>
      <Link to="/doctor-login" className="btn btn-primary m-3">Doctor Login</Link>
      <Link to="/patient-register" className="btn btn-secondary m-3">Patient Registration</Link>
    </div>
  );
};

export default HomePage;
