// DermatologyPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, ListGroup, Alert } from "react-bootstrap";

const DermatologyPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDermatologyPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patients/Dr. Sarah Johnson");
        setPatients(response.data);
      } catch (err) {
        setError("Error fetching Dermatology patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchDermatologyPatients();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Dermatology Patients</h2>

      {loading && <p>Loading patients...</p>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col>
          <ListGroup>
            {patients.map((patient) => (
              <ListGroup.Item key={patient._id}>
                <h5>{patient.name}</h5>
                <p>Email: {patient.email}</p>
                <p>Phone: {patient.phone}</p>
                <p>Time Slot: {patient.selectedTimeSlot}</p>
                <p>Token: {patient.token}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default DermatologyPage;
