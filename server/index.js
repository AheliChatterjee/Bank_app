// index.js
require("dotenv").config(); // Load .env first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes (all with require)
const authRoutes = require("./routes/auth");
const bankRoutes = require("./routes/bank");
const fundRoutes = require("./routes/fundRoutes");   // remove .js if using require


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bank", bankRoutes); 
app.use("/api/fund", fundRoutes);


// Test route
app.get("/", (req, res) => res.send("API is running"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
