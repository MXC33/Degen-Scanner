const fetch = require("node-fetch");
const { LRUCache } = require("lru-cache"); // Ensure lru-cache v11.x is installed
const logger = require("./logger");

// Initialize LRU Cache
const cache = new LRUCache({
  max: 500, // Maximum number of items in cache
  ttl: 1000 * 60 * 60, // Time to live in milliseconds (1 hour)
});

/**
 * Fetches all token accounts (owners) for a given mint address.
 * Utilizes caching to store and retrieve data.
 *
 * @param {string} apiKey - Helius API Key.
 * @param {string} mintAddress - The mint address of the token.
 * @param {number} retries - Number of retry attempts in case of rate limiting.
 * @returns {Promise<string[]>} - An array of unique owner addresses.
 */
async function getTokenAccounts(apiKey, mintAddress, retries = 3) {
  const cacheKey = `token_accounts_${mintAddress};`; // Unique cache key for token accounts

  // **Start of Caching Logic**
  if (cache.has(cacheKey)) {
    logger.info(`[Cache Hit] Token Accounts for ${mintAddress}`);
    return cache.get(cacheKey);
  } else {
    logger.info(`[Cache Miss] Token Accounts for ${mintAddress}`);
  }
  // **End of Caching Logic**

  const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

  const allOwners = new Set();
  let cursor;

  try {
    while (true) {
      let params = {
        limit: 1000,
        mint: mintAddress,
      };

      if (cursor !== undefined) {
        params.cursor = cursor;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "helius-fetch-token-accounts",
          method: "getTokenAccounts",
          params: params,
        }),
      });

      const data = await response.json();

      if (data.error) {
        if (data.error.message.includes("Rate limit exceeded") && retries > 0) {
          logger.warn(`
            Rate limit exceeded. Retrying after delay... (${retries} retries left)
          `);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
          return getTokenAccounts(apiKey, mintAddress, retries - 1);
        }
        throw new Error(`RPC Error: ${data.error.message}`);
      }

      if (!data.result || data.result.token_accounts.length === 0) {
        logger.info("No more results");
        break;
      }

      data.result.token_accounts.forEach((account) => {
        allOwners.add(account.owner);
      });

      cursor = data.result.cursor;
    }

    const ownersArray = Array.from(allOwners);

    // **Start of Caching Logic**
    cache.set(cacheKey, ownersArray); // Set data in cache
    logger.info(`[Cache Set] Token Accounts for ${mintAddress}`);
    logger.info(`ownsers array, ${ownersArray}`);
    // **End of Caching Logic**

    return ownersArray;
  } catch (error) {
    logger.error(`Error fetching token accounts: ${error.message}`);
    throw error;
  }
}

module.exports = { getTokenAccounts };
