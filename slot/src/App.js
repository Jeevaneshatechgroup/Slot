import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./component/HomePage/HomePage";
import DoctorLoginForm from "./component/Doctor/doctorlogin";
import DoctorDashboard from "./component/Doctor/DoctorDashboard";
import CardiologyPage from "./component/Doctor/Cardiology/Cardiology"; 
import DermatologyPage from "./component/Doctor/Dermatology/Dermatology";
import NeurologyPage from "./component/Doctor/Neurology/Neurology"; 
import PatientRegistrationForm from "./component/Patient/patientRegistration";
import TokenGeneratorForm from './component/Patient/TokenGenerator';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/Cardiology" element={<CardiologyPage />} />
        <Route path="/Dermatology" element={<DermatologyPage />} />
        <Route path="/Neurology" element={<NeurologyPage />} />
        <Route path="/doctor-login" element={<DoctorLoginForm />} />
        <Route path="/patient-register" element={<PatientRegistrationForm />} />
        <Route path="/get-token" element={<TokenGeneratorForm/>}/>
      </Routes>
    </Router>
  );
};

export default App;
