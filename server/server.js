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

// Doctor Schema (assuming you want to store doctor info in DB, can be updated as needed)
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
});

const Patient = mongoose.model("Patient", patientSchema);

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
app.post("/api/patient/register", async (req, res) => {
  const { name, email, phone, selectedDoctor, selectedTimeSlot } = req.body;

  try {
    const newPatient = new Patient({
      name,
      email,
      phone,
      selectedDoctor,
      selectedTimeSlot,
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: "Error registering patient" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
