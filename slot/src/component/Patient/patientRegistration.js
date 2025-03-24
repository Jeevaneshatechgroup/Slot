import React, { useState } from "react";
import axios from "axios";

// Utility function to generate a unique 6-digit ID (alphanumeric)
const generateUniqueId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let uniqueId = "";
  for (let i = 0; i < 6; i++) {
    uniqueId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return uniqueId;
};

const PatientRegistrationForm = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !phone) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Generate a unique ID when submitting the form
    const generatedId = generateUniqueId();
    setUniqueId(generatedId); // Update the state with the generated ID

    setLoading(true); // Start loading indicator
    try {
      const response = await axios.post("http://localhost:5000/api/patient/register", {
        name,
        email,
        phone,
        uniqueId: generatedId, // Send the unique ID along with other details
      });

      if (response.status === 200) {
        setSuccessMessage(`Successfully registered! Your unique ID: ${generatedId}`);
        setErrorMessage(""); // Reset error message if registration is successful

        // Reset form after successful registration
        setName("");
        setEmail("");
        setPhone("");

        // Call the onRegister function passed from the parent component
        if (onRegister) {
          onRegister(generatedId); // Pass the unique ID to the parent component
        }
      }
    } catch (err) {
      setSuccessMessage(""); // Reset success message on error
      console.error("Error:", err.response || err); // Log the full error response

      if (err.response) {
        setErrorMessage(err.response.data.message || "Registration failed");
      } else {
        setErrorMessage("Registration failed due to an unexpected error");
      }
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="patientName" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="patientName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="patientEmail" className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            id="patientEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="patientPhone" className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="patientPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success mt-4" role="alert">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger mt-4" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default PatientRegistrationForm;
