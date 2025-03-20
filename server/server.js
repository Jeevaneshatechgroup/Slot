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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Doctor Schema
const doctorSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  selectedDoctor: { type: String, required: true },
  selectedTimeSlot: { type: String, required: true },
  token: { type: String, required: true }, // Added token field
});

const Patient = mongoose.model("Patient", patientSchema);

// Token Count Schema (for managing token numbers for each doctor and time slot)
const tokenCountSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  timeSlot: { type: String, required: true },
  tokenCount: { type: Number, default: 0 },  // Initialize count at 0
});

const TokenCount = mongoose.model("TokenCount", tokenCountSchema);

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

// Patient Registration Route
app.post('/api/verify-pin/:specialty', (req, res) => {
  const { specialty } = req.params;
  const { pin } = req.body;

  let validPin = false;

  // Verify PIN based on specialty
  if (specialty === 'cardiologist' && pin === process.env.CARDIO_PIN) {
    validPin = true;
  } else if (specialty === 'dermatologist' && pin === process.env.DERMOTO_PIN) {
    validPin = true;
  } else if (specialty === 'neurologist' && pin === process.env.NEURO_PIN) {
    validPin = true;
  }

  if (validPin) {
    return res.status(200).json({ message: 'PIN verified successfully' });
  } else {
    return res.status(400).json({ message: 'Invalid PIN' });
  }
});
// API to fetch Cardiologist appointments and available time slots
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
app.delete("/api/patients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the patient by ID
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Send success message
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting patient" });
  }
});
app.post("/api/patient/register", async (req, res) => {
  const { name, email, phone, selectedDoctor, selectedTimeSlot } = req.body;

  try {
    // Find the current token count for the doctor and time slot
    let tokenEntry = await TokenCount.findOne({
      doctorName: selectedDoctor,
      timeSlot: selectedTimeSlot,
    });

    // If no token entry exists, initialize it with tokenCount as 1
    if (!tokenEntry) {
      tokenEntry = new TokenCount({
        doctorName: selectedDoctor,
        timeSlot: selectedTimeSlot,
        tokenCount: 1, // Start from token 1
      });

      await tokenEntry.save(); // Save the new token entry to the database
    } else {
      // If there are no patients registered for this doctor and time slot,
      // reset tokenCount to 1 if no patients exist.
      const patientCount = await Patient.countDocuments({
        selectedDoctor,
        selectedTimeSlot,
      });

      if (patientCount === 0) {
        tokenEntry.tokenCount = 1; // Reset to 1 if no patients exist
        await tokenEntry.save();  // Save the reset token count
      } else if (tokenEntry.tokenCount > 25) {
        // If all tokens have been used
        return res.status(400).json({ message: "All tokens for this time slot are used." });
      }
    }

    // Assign the current token to the patient
    const assignedToken = tokenEntry.tokenCount;

    // Update the token count for the next patient (increment by 1)
    tokenEntry.tokenCount += 1;
    await tokenEntry.save();

    // Create a new patient document with the assigned token
    const newPatient = new Patient({
      name,
      email,
      phone,
      selectedDoctor,
      selectedTimeSlot,
      token: assignedToken,
    });

    await newPatient.save();

    // Respond with success and the token
    res.status(201).json({ message: "Patient registered successfully", token: assignedToken });
  } catch (err) {
    console.error("Error registering patient:", err);
    res.status(500).json({ message: "Error registering patient" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
