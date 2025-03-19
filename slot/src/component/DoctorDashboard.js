// DoctorDashboard.js
import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const handleSpecialtyClick = (specialty) => {
    if (specialty === "Cardiologist") {
      navigate("/cardiology");
    } else if (specialty === "Dermatologist") {
      navigate("/dermatology");
    } else if (specialty === "Neurologist") {
      navigate("/neurology");
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
            onClick={() => handleSpecialtyClick("Cardiologist")}
          >
            Cardiologist
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            variant="success"
            size="lg"
            block
            onClick={() => handleSpecialtyClick("Dermatologist")}
          >
            Dermatologist
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            variant="warning"
            size="lg"
            block
            onClick={() => handleSpecialtyClick("Neurologist")}
          >
            Neurologist
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
