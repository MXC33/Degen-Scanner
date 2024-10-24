const express = require("express");
const cors = require("cors");
const path = require("path");
const { getTokenInfo } = require("./tokenHolders");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("HELIUS_API_KEY:", process.env.HELIUS_API_KEY);
console.log("Current working directory:", process.cwd());

const apiKey = process.env.HELIUS_API_KEY;

if (!apiKey) {
  console.error("HELIUS_API_KEY is not defined in the .env file.");
  process.exit(1);
}

console.log("HELIUS_API_KEY loaded successfully.");

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = process.env.PORT || 5000;

app.get("/api/token-info/:mintAddress", async (req, res) => {
  try {
    const { mintAddress } = req.params;
    console.log(`Fetching info for address: ${mintAddress}`);

    const tokenInfo = await getTokenInfo(apiKey, mintAddress);

    res.json({
      mintAddress,
      holderCount: tokenInfo.holderCount,
      metadata: tokenInfo.metadata,
    });
  } catch (error) {
    console.error("Error fetching token info:", error);
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
      getTokenInfo(apiKey, mintAddress1),
      getTokenInfo(apiKey, mintAddress2),
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
    console.error("Error comparing tokens:", error);
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
