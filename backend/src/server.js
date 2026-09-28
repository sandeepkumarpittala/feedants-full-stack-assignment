const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const competitionRoutes = require("./routes/competitionRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Feedants Backend API is running",
  });
});
app.use("/api/competitions", competitionRoutes);
app.use("/api/registrations", registrationRoutes);
app.use(
  "/api/submissions",
  submissionRoutes
);
// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});