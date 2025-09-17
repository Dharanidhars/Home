const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  "https://homieproject.netlify.app/", // change to your real Netlify URL
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/", (_req, res) => res.send("🏡 HOMIE API is running..."));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));      // <- IMPORTANT
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/dashboard", require("./routes/userDashboardRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// 404
app.use((req, res) => res.status(404).json({ msg: "Route not found" }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
