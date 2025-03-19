import React from 'react'

const DoctorLoginForm = () => {
    return (
      <div className="container">
        <h2 className="mt-4">Doctor Login</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="doctorEmail" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="doctorEmail"
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

export default DoctorLoginForm
