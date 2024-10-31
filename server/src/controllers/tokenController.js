// server/src/controllers/tokenController.js

const { getTokenInfo } = require("../services/tokenHolders");
const logger = require("../services/logger");

// Controller to fetch token information
const fetchTokenInfo = async (req, res) => {
  try {
    const { mintAddress } = req.params;
    logger.info(`Fetching info for address: ${mintAddress}`);

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
    logger.error(`Error fetching token info: ${error.message}`);
    res.status(500).json({
      error: "An error occurred while fetching token information",
      details: error.message,
    });
  }
};

// Controller to compare two tokens
const compareTokens = async (req, res) => {
  try {
    const { mintAddress1, mintAddress2 } = req.params;
    logger.info(`Comparing tokens: ${mintAddress1} and ${mintAddress2}`);

    const [tokenInfo1, tokenInfo2] = await Promise.all([
      getTokenInfo(process.env.HELIUS_API_KEY, mintAddress1),
      getTokenInfo(process.env.HELIUS_API_KEY, mintAddress2),
    ]);

    if (!tokenInfo1.holders || !tokenInfo2.holders) {
      throw new Error("Failed to fetch holders for one or both tokens.");
    }

    // Convert one holder list to Set for O(1) lookups
    const holdersSet2 = new Set(tokenInfo2.holders);
    const commonHoldersCount = tokenInfo1.holders.reduce((count, holder) => {
      return holdersSet2.has(holder) ? count + 1 : count;
    }, 0);

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
      commonHoldersCount,
    });
  } catch (error) {
    logger.error(`Error comparing tokens: ${error.message}`);
    res.status(500).json({
      error: "An error occurred while comparing tokens",
      details: error.message,
    });
  }
};


module.exports = {
  fetchTokenInfo,
  compareTokens,

};
