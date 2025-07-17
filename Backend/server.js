const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load .env
dotenv.config();

// Connect DB
connectDB();

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("🏡 HOMIE API is running...");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/dashboard", require("./routes/userDashboardRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Error & 404
app.use((req, res) => res.status(404).json({ msg: "Route not found" }));
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
