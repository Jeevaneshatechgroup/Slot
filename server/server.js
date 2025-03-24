const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Doctor Schema
const doctorSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// Patient Schema
// Patient Schema (without selectedDoctor and selectedTimeSlot)
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  uniqueId: { type: String, required: true },
  token: { type: String, required: true },
  selectedDoctor: { type: String, required: false }, // Store selected doctor
  selectedTimeSlot: { type: String, required: false },
});

const Patient = mongoose.model("Patient", patientSchema);




// Token Count Schema (for managing token numbers for each doctor and time slot)
const tokenCountSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  timeSlot: { type: String, required: true },
  tokenCount: { type: Number, default: 0 },  // Initialize count at 0
});

const TokenCount = mongoose.model("TokenCount", tokenCountSchema);

const tokenSchemaa = new mongoose.Schema({
  doctorName: { type: String, required: true },
  timeSlot: { type: String, required: true },
  lastToken: { type: Number, default: 0 }, // Track the last token generated for this slot and doctor
});

const Token = mongoose.model("Token", tokenSchemaa);

// Doctor Login Route (authentication using .env credentials)
app.post("/api/doctor/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the provided email and password match the ones stored in .env
    if (email === process.env.DOCTOR_EMAIL && password === process.env.DOCTOR_PASSWORD) {
      // Generate JWT token using secret from .env
      const token = jwt.sign({ doctorId: "predefinedDoctorId" }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Send the token as a response
      res.json({ token });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// API to fetch patients based on selected doctor
app.get("/api/patients/:specialty", async (req, res) => {
  const { specialty } = req.params;

  try {
    // Fetch patients based on the selected doctor (specialty)
    const patients = await Patient.find({ selectedDoctor: specialty });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching patients." });
  }
});

// API to fetch available time slots for a doctor (using TokenCount)
app.get("/api/timeSlots/:doctorName", async (req, res) => {
  const { doctorName } = req.params;

  try {
    // Fetch available time slots for the doctor
    const timeSlots = await TokenCount.find({ doctorName: doctorName });
    res.json(timeSlots);
  } catch (err) {
    res.status(500).json({ message: "Error fetching time slots." });
  }
});


// Token Generation Route (for managing token numbers for doctor slots)
app.post('/api/patient/register', async (req, res) => {
  const { name, email, phone, uniqueId } = req.body;

  console.log("Registration request body:", req.body);

  // Validate input fields
  if (!name || !email || !phone || !uniqueId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the unique ID already exists in the database
    const existingPatient = await Patient.findOne({ uniqueId });
    if (existingPatient) {
      return res.status(400).json({ message: "This unique ID already exists" });
    }

    // Create a new patient object
    const newPatient = new Patient({
      name,
      email,
      phone,
      uniqueId,
      token: `TOKEN-${uniqueId}-${Date.now()}`,
    });

    // Save the patient to the database
    await newPatient.save();

    // Send a success response
    return res.status(200).json({
      message: "Patient registered successfully",
      token: newPatient.token, // Return the generated token
    });
  } catch (err) {
    console.error("Error registering patient:", err); // Log the error
    return res.status(500).json({ message: "Error registering patient" });
  }
});


// Fetch patient by uniqueId
app.get('/api/patient/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;

  try {
    const patient = await Patient.findOne({ uniqueId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found with the provided Medical ID" });
    }

    // If the patient is found, return the patient data (excluding sensitive info if necessary)
    return res.status(200).json({ name: patient.name, uniqueId: patient.uniqueId });

  } catch (err) {
    console.error("Error fetching patient:", err);
    return res.status(500).json({ message: "Error fetching patient" });
  }
});
app.post('/api/token/generate', async (req, res) => {
  const { uniqueId, selectedDoctor, selectedTimeSlot } = req.body;

  try {
    // Check if the patient exists
    const patient = await Patient.findOne({ uniqueId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found with the provided Medical ID" });
    }

    // Get or create a record for this doctor and time slot combination
    let tokenRecord = await Token.findOne({ doctorName: selectedDoctor, timeSlot: selectedTimeSlot });

    if (!tokenRecord) {
      // If no token record exists for this doctor and time slot, create a new one and start from 1
      tokenRecord = new Token({
        doctorName: selectedDoctor,
        timeSlot: selectedTimeSlot,
        lastToken: 1, // Starting token is 1
      });
      await tokenRecord.save();
    } else {
      // If tokenRecord exists, check if the last token is greater than or equal to 25
      if (tokenRecord.lastToken >= 25) {
        return res.status(400).json({ message: "Sorry, all slots are full for this time slot and doctor." });
      }
    }

    // Generate a new token
    const newToken = tokenRecord.lastToken;

    // Increment the last token for the next patient
    tokenRecord.lastToken = newToken + 1;
    await tokenRecord.save();

    // Store the generated token, selected doctor, and selected time slot in the patient's record
    patient.token = newToken.toString();
    patient.selectedDoctor = selectedDoctor;
    patient.selectedTimeSlot = selectedTimeSlot;
    await patient.save();

    // Send the generated token as the response
    return res.status(200).json({ token: newToken.toString() });

  } catch (err) {
    console.error("Error generating token:", err);
    return res.status(500).json({ message: "Error generating token" });
  }
});




app.delete("/api/patients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findOneAndUpdate(
      { uniqueId: id },
      { 
        $set: { 
          token: null,
          selectedDoctor: null, // Clear selectedDoctor
          selectedTimeSlot: null // Clear selectedTimeSlot
        }
      },
      { new: true }  // Return the updated patient object
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient's token and other fields cleared successfully", patient });
  } catch (err) {
    console.error("Error clearing patient's fields:", err);
    res.status(500).json({ message: "Error clearing patient's fields", error: err.message });
  }
});







// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
