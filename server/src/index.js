// server/src/index.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const tokenRoutes = require("./routes/tokenRoutes");
const logger = require("./services/logger");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust based on your client URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON bodies (if needed)
app.use(express.json());

// Use the token routes
app.use("/api", tokenRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
