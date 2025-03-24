import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, ListGroup, Alert, Button, Modal, Spinner } from "react-bootstrap";

const NeurologyPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State for modal visibility
  const [selectedPatientId, setSelectedPatientId] = useState(null); // State to hold patient id for deletion

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

  const handleDeleteClick = (uniqueId) => {
    setSelectedPatientId(uniqueId);
    setDeleteModalVisible(true);
  };

  const deletePatient = async () => {
    try {
      console.log("Clearing fields for patient with uniqueId:", selectedPatientId);
      const response = await axios.delete(`http://localhost:5000/api/patients/${selectedPatientId}`);
  
      // Update the patient state to reflect the cleared fields
      setPatients(patients.map((patient) =>
        patient.uniqueId === selectedPatientId ? { 
          ...patient, 
          token: null, 
          selectedDoctor: null, 
          selectedTimeSlot: null 
        } : patient
      ));
  
      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(""), 3000);
      setDeleteModalVisible(false);
    } catch (err) {
      console.error("Error clearing patient's fields:", err);
      setError("Error clearing patient's fields.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Dr. Mike Brown - Neurology Patients</h2>

      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
          <p className="ml-2">Loading patients...</p>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {patients.length === 0 && !loading && !error ? (
        <Alert variant="info">No patients available for Neurology.</Alert>
      ) : (
        <Row>
          <Col>
            <ListGroup>
              {patients.map((patient) => (
                <ListGroup.Item key={patient.uniqueId}>
                  <h5>{patient.name}</h5>
                  <p>Email: {patient.email}</p>
                  <p>Phone: {patient.phone}</p>
                  <p>Time Slot: {patient.selectedTimeSlot}</p>
                  <p>Token: {patient.token}</p>
                  <Button
                    variant="success"
                    onClick={() => handleDeleteClick(patient.uniqueId)} // Show modal when the delete button is clicked
                  >
                    Clear Token & Fields
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}

      {/* Confirmation Modal */}
      <Modal show={deleteModalVisible} onHide={() => setDeleteModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Clear Patient's Token and Fields</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to clear this patient's token, doctor, and time slot?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={deletePatient}>
            Clear Fields
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};



export default NeurologyPage;
