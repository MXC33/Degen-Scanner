require("dotenv").config();
const express = require("express");
const { getTokenHolders, getTokenMetadata } = require("./tokenHolders");

const app = express();
const port = process.env.PORT || 3000;

app.get("/token-info/:mintAddress", async (req, res) => {
  try {
    const { mintAddress } = req.params;
    console.log(`Fetching info for address: ${mintAddress}`);

    const [holderCount, metadata] = await Promise.all([
      getTokenHolders(process.env.HELIUS_API_KEY, mintAddress),
      getTokenMetadata(process.env.HELIUS_API_KEY, mintAddress),
    ]);

    console.log("Fetched metadata:", JSON.stringify(metadata, null, 2));
    console.log("Holder count:", holderCount);

    res.json({
      mintAddress,
      holderCount,
      metadata,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching token information",
        details: error.message,
      });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
