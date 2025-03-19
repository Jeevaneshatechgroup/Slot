import React from 'react'

 // Patient Registration Form
   // Patient Registration Form
   const PatientRegistrationForm = () => {
    return (
      <div className="container">
        <h2 className="mt-4">Patient Registration</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="patientName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="patientName"
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="patientEmail" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="patientEmail"
              placeholder="Enter your email"
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="patientPhone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="patientPhone"
              placeholder="Enter your phone number"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    );
  };
  export default PatientRegistrationForm
