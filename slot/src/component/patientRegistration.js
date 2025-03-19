import React, { useState } from "react";
import axios from "axios";

const PatientRegistrationForm = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(""); // State to store the generated token
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const [errorMessage, setErrorMessage] = useState(""); // For error message (e.g., slot full)

  const doctors = [
    { name: "Dr. John Smith", specialty: "Cardiologist" },
    { name: "Dr. Sarah Johnson", specialty: "Dermatologist" },
    { name: "Dr. Mike Brown", specialty: "Neurologist" },
  ];

  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/patient/register", {
        name,
        email,
        phone,
        selectedDoctor,
        selectedTimeSlot,
      });

      // Show success message with the token
      setSuccessMessage(`Successfully registered! Your token: ${response.data.token}`);
      setToken(response.data.token); // Update token state
      setErrorMessage(""); // Reset error message if registration is successful
    } catch (err) {
      // Handle error messages from the backend
      setSuccessMessage(""); // Reset success message on error
      setErrorMessage(err.response.data.message); // Set the error message (slot full or any other message)
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
        <div className="mb-3">
          <label htmlFor="timeSlot" className="form-label">Select Time Slot</label>
          <select
            id="timeSlot"
            className="form-select"
            onChange={handleTimeSlotChange}
            value={selectedTimeSlot}
          >
            <option value="">Select time slot</option>
            <option value="9am-1pm">9 AM - 1 PM</option>
            <option value="3pm-7pm">3 PM - 7 PM</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="doctorSelect" className="form-label">Select Doctor</label>
          <select
            id="doctorSelect"
            className="form-select"
            onChange={handleDoctorChange}
            value={selectedDoctor}
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor.name}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
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
