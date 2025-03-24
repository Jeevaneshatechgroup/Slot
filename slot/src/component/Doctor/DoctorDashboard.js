import React, { useState } from "react";
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState("");

  // PINs from environment variables (use process.env in production for security)
  const PINs = {
    Cardiology: "1234",
    Dermatology: "5678",
    Neurology: "9101",
  };

  const handlePinSubmit = () => {
    if (pin === PINs[specialty]) {
      // On successful pin entry, navigate to the respective page
      navigate(`/${specialty}`);
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Doctor Dashboard</h2>
      <Row className="justify-content-center">
        <Col md={4} className="mb-3">
          <Button
            variant="primary"
            size="lg"
            block
            onClick={() => setSpecialty("Cardiology")}
          >
            Dr. John Smith - Cardiology
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            variant="success"
            size="lg"
            block
            onClick={() => setSpecialty("Dermatology")}
          >
            Dr. Sarah Johnson - Dermatology
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            variant="warning"
            size="lg"
            block
            onClick={() => setSpecialty("Neurology")}
          >
            Dr. Mike Brown - Neurology
          </Button>
        </Col>
      </Row>

      {/* PIN entry section */}
      {specialty && (
        <Row className="justify-content-center mt-4">
          <Col md={4}>
            <h4 className="text-center mb-3">Enter the PIN for {specialty}</h4>

            {/* Input Form */}
            <Form>
              <Form.Group controlId="pinInput">
                <Form.Control
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="mb-3"
                  style={{ padding: "10px", fontSize: "16px" }}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handlePinSubmit}
                block
                style={{ padding: "10px", fontSize: "16px" }}
              >
                Submit
              </Button>
            </Form>

            {/* Error message if PIN is wrong */}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default DoctorDashboard;
