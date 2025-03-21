import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, ListGroup, Alert, Button, Modal } from "react-bootstrap";

const NeurologyPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State for modal visibility
  const [patientToDelete, setPatientToDelete] = useState(null); // State to hold patient id for deletion

  useEffect(() => {
    const fetchNeurologyPatients = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/patients/Dr. Mike Brown");
        setPatients(response.data);
      } catch (err) {
        setError("Error fetching Neurology patients.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch patients directly when the component mounts
    fetchNeurologyPatients();
  }, []); // Empty dependency array, runs only once on mount

  const deletePatient = async () => {
    if (!patientToDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/patients/${patientToDelete}`);
      setPatients(patients.filter((patient) => patient._id !== patientToDelete));
      setSuccessMessage(response.data.message);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setDeleteModalVisible(false); // Hide the modal after deletion
      setPatientToDelete(null); // Reset the patient ID
    } catch (err) {
      setError("Error deleting patient.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Dr. Mike Brown - Neurology Patients</h2>

      {/* Loading or error message */}
      {loading && <p>Loading patients...</p>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Display the success message if it's set */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Fallback message if no patients are available */}
      {patients.length === 0 && !loading && !error && (
        <Alert variant="info">No patients available for Neurologist.</Alert>
      )}

      {/* Patient list */}
      {patients.length > 0 && (
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
                    onClick={() => {
                      setPatientToDelete(patient._id);
                      setDeleteModalVisible(true);
                    }}
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

export default NeurologyPage;
