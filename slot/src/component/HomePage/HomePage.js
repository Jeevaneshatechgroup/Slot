import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Homepage.css'; // Import the CSS file for background and container styles

const HomePage = () => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // After 1 second, show the buttons
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 1000); // Change delay if needed
    return () => clearTimeout(timer); // Clean up on unmount
  }, []);

  return (
    <div className="homepage-container">
      {/* Black and White Semi-Transparent Container for content */}
      <div className="black-white-container">
        <h1 className="animate__animated animate__fadeIn" style={{ animationDuration: "1s" }}>
          Welcome to Hospital
        </h1>

        {/* Buttons will appear after the timeout with fade-in animation */}
        {showButtons && (
          <>
            <Link
              to="/doctor-login"
              className="btn btn-primary m-3 animate__animated animate__fadeIn"
              style={{ animationDuration: "1s" }}
            >
              Doctor Login
            </Link>
            <Link
              to="/patient-register"
              className="btn btn-secondary m-3 animate__animated animate__fadeIn"
              style={{ animationDuration: "1s", animationDelay: "1s" }}  // Slight delay for the second button
            >
              Patient Registration
            </Link>
            {/* Add Get Token Button */}
            <Link
              to="/get-token"
              className="btn btn-success m-3 animate__animated animate__fadeIn"
              style={{ animationDuration: "1s", animationDelay: "2s" }}  // Slight delay for the Get Token button
            >
              Get Token
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
