import React, { useState } from "react";
import axios from "axios";

const TokenGeneratorForm = ({ uniqueId }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [medicalId, setMedicalId] = useState(""); // State to store the medical ID
  const [patientName, setPatientName] = useState(""); // State to store fetched patient name
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

  const handleMedicalIdChange = async (e) => {
    const id = e.target.value;
    setMedicalId(id);

    if (id) {
      try {
        // Make API call to fetch patient data based on the entered medical ID
        const response = await axios.get(`http://localhost:5000/api/patient/${id}`);
        setPatientName(response.data.name); // Assuming the response contains the patient's name
        setErrorMessage(""); // Clear any previous error
      } catch (err) {
        setPatientName(""); // Clear patient name on error
        setErrorMessage("Invalid Medical ID. Please try again.");
      }
    } else {
      setPatientName(""); // Clear patient name if no medical ID is entered
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are selected and valid
    if (!medicalId || !selectedDoctor || !selectedTimeSlot) {
      setErrorMessage("Please select all fields and enter a valid medical ID.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/token/generate", {
        uniqueId: medicalId,  // Pass the entered medical ID here
        selectedDoctor,
        selectedTimeSlot,
      });

      setToken(response.data.token);
      setSuccessMessage(`Your token: ${response.data.token}`);
      setErrorMessage(""); // Reset error message
    } catch (err) {
      setSuccessMessage(""); // Reset success message on error
      setErrorMessage(err.response?.data?.message || "Failed to generate token");
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Token Generator</h2>
      <form onSubmit={handleSubmit}>
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
        {/* Medical ID Field */}
        <div className="mb-3">
          <label htmlFor="medicalId" className="form-label">Medical ID</label>
          <input
            type="text"
            className="form-control"
            id="medicalId"
            value={medicalId}
            onChange={handleMedicalIdChange}
            placeholder="Enter your Medical ID"
          />
        </div>
        
        {/* Display Patient Name if available */}
        {patientName && (
          <div className="mb-3">
            <label className="form-label">Patient Name</label>
            <input
              type="text"
              className="form-control"
              value={patientName}
              disabled
              readOnly
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">Generate Token</button>
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

export default TokenGeneratorForm;
