const express = require("express");
const cors = require("cors");
const path = require("path");
const { getTokenHolders, getTokenMetadata } = require("./tokenHolders");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3001", // Allow requests from your React app
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);

const port = process.env.PORT || 5000;

app.get("/api/token-info/:mintAddress", async (req, res) => {
  try {
    const { mintAddress } = req.params;
    console.log(`Fetching info for address: ${mintAddress}`);

    const [holderCount, metadata] = await Promise.all([
      getTokenHolders(process.env.HELIUS_API_KEY, mintAddress),
      getTokenMetadata(process.env.HELIUS_API_KEY, mintAddress),
    ]);

    res.json({
      mintAddress,
      holderCount,
      metadata,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "An error occurred while fetching token information",
      details: error.message,
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
