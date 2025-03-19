// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./component/HomePage";
import DoctorLoginForm from "./component/doctorlogin";
import PatientRegistrationForm from "./component/patientRegistration";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctor-login" element={<DoctorLoginForm />} />
        <Route path="/patient-register" element={<PatientRegistrationForm />} />
      </Routes>
    </Router>
  );
};

export default App;
