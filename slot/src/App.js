// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./component/HomePage";
import DoctorLoginForm from "./component/doctorlogin";
import DoctorDashboard from "./component/DoctorDashboard"
import CardiologyPage from "./component/Cardiology"; // Add CardiologyPage import
import DermatologyPage from "./component/Dermotology"; // Add DermatologyPage import
import NeurologyPage from "./component/Neurology"; 
import PatientRegistrationForm from "./component/patientRegistration";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/cardiology" element={<CardiologyPage />} />
        <Route path="/dermatology" element={<DermatologyPage />} />
        <Route path="/neurology" element={<NeurologyPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor-login" element={<DoctorLoginForm />} />
        <Route path="/patient-register" element={<PatientRegistrationForm />} />
      </Routes>
    </Router>
  );
};

export default App;
