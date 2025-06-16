const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // adjust if your frontend runs elsewhere
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});
