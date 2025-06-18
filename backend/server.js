const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000"], // adjust if your frontend runs elsewhere
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/posts", postRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});
