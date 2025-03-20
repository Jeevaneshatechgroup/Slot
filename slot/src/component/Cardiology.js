import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, ListGroup, Alert, Button, Spinner, Modal } from "react-bootstrap";

const CardiologyPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    const fetchCardiologyPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/Dr. John Smith`);
        setPatients(response.data);
      } catch (err) {
        setError("Error fetching Cardiology patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchCardiologyPatients();
  }, []);

  // Function to handle the deletion of a patient
  const deletePatient = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/patients/${selectedPatientId}`);
      
      // Update state to remove the patient from the list
      setPatients(patients.filter((patient) => patient._id !== selectedPatientId));
      
      // Set success message
      setSuccessMessage(response.data.message);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Close the modal
      setDeleteModalVisible(false);
    } catch (err) {
      setError("Error deleting patient.");
    }
  };

  const handleDeleteClick = (patientId) => {
    setSelectedPatientId(patientId);
    setDeleteModalVisible(true);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Dr. John Smith - Cardiology Patients</h2>

      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
          <p className="ml-2">Loading patients...</p>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Display the success message if it's set */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Display the "No patients" message if no patients are available */}
      {patients.length === 0 && !loading && !error ? (
        <Alert variant="info">No patients available for Cardiology.</Alert>
      ) : (
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
                  <Button
                    variant="success"
                    onClick={() => handleDeleteClick(patient._id)}
                  >
                      Patient Cleared
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}

      {/* Modal for patient deletion confirmation */}
      <Modal show={deleteModalVisible} onHide={() => setDeleteModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Attended Patient?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you have attended this patient?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={deletePatient}>
            clear
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CardiologyPage;
