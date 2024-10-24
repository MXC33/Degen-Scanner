// server.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const {
  getTokenHolders,
  getTokenMetadata,
  getTokenInfo,
} = require("./tokenHolders");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3001", // Adjust if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = process.env.PORT || 3001;

app.get("/api/token-info/:mintAddress", async (req, res) => {
  try {
    const { mintAddress } = req.params;
    console.log(`Fetching info for address: ${mintAddress}`);

    const tokenInfo = await getTokenInfo(
      process.env.HELIUS_API_KEY,
      mintAddress
    );

    res.json({
      mintAddress,
      holderCount: tokenInfo.holderCount,
      metadata: tokenInfo.metadata,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "An error occurred while fetching token information",
      details: error.message,
    });
  }
});

app.get("/api/token-compare/:mintAddress1/:mintAddress2", async (req, res) => {
  try {
    const { mintAddress1, mintAddress2 } = req.params;
    console.log(`Comparing tokens: ${mintAddress1} and ${mintAddress2}`);

    const [tokenInfo1, tokenInfo2] = await Promise.all([
      getTokenInfo(process.env.HELIUS_API_KEY, mintAddress1),
      getTokenInfo(process.env.HELIUS_API_KEY, mintAddress2),
    ]);

    const holders1 = new Set(tokenInfo1.holders);
    const holders2 = new Set(tokenInfo2.holders);

    const commonHolders = [...holders1].filter((holder) =>
      holders2.has(holder)
    );

    res.json({
      token1: {
        mintAddress: mintAddress1,
        holderCount: tokenInfo1.holderCount,
        metadata: tokenInfo1.metadata,
      },
      token2: {
        mintAddress: mintAddress2,
        holderCount: tokenInfo2.holderCount,
        metadata: tokenInfo2.metadata,
      },
      commonHoldersCount: commonHolders.length,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "An error occurred while comparing tokens",
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
