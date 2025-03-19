// DoctorLoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/doctor/login", {
        email,
        password,
      });

      // Save the token in localStorage or cookies
      localStorage.setItem("doctor_token", response.data.token);

      // Redirect after successful login
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Doctor Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="doctorEmail" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="doctorEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="doctorPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="doctorPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default DoctorLoginForm;
