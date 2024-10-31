// server/src/services/tokenHolders.js

const fetch = require("node-fetch");
const { LRUCache } = require("lru-cache");

const cache = new LRUCache({
  max: 500, 
  ttl: 1000 * 60 * 60, 
});

const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

<<<<<<< Updated upstream
async function getTokenHolders(apiKey, mintAddress, retries = 3) {
  const cacheKey = `holders_${mintAddress}`; // Unique cache key for holders

  // **Start of Caching Logic**
=======
async function getTokenHolders(apiKey, mintAddress, retries = 3, delayMs = 1000) {
  const cacheKey = `holders_${mintAddress}`;
>>>>>>> Stashed changes
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "fetchHolders",
        method: "getProgramAccounts",
        params: [
          TOKEN_PROGRAM_ID,
          {
            encoding: "jsonParsed",
            filters: [
              { dataSize: 165 },
              { memcmp: { offset: 0, bytes: mintAddress } },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      if (data.error.message.includes("Rate limit exceeded") && retries > 0) {
        console.warn("Rate limit exceeded. Retrying...");
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return getTokenHolders(apiKey, mintAddress, retries - 1, delayMs * 2);
      }
      throw new Error(`RPC Error: ${data.error.message}`);
    }

<<<<<<< Updated upstream
    const accounts = data.result;

    // Extract owner and amount
    const holderAmounts = accounts
      .filter((account) => {
        const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
        return amount > 0;
      })
      .map((account) => ({
        owner: account.account.data.parsed.info.owner,
        amount: account.account.data.parsed.info.tokenAmount.uiAmount,
      }));

    // Aggregate by owner
    const holderMap = new Map();

    holderAmounts.forEach(({ owner, amount }) => {
      if (holderMap.has(owner)) {
        holderMap.set(owner, holderMap.get(owner) + amount);
      } else {
        holderMap.set(owner, amount);
      }
    });

    // Convert to array
    const holdersArray = Array.from(holderMap, ([owner, amount]) => ({
      owner,
      amount,
    }));

    const holderCount = holdersArray.length;

    // Compute total supply
    const totalSupply = holdersArray.reduce(
      (sum, holder) => sum + holder.amount,
      0
    );

    // Sort descending by amount
    holdersArray.sort((a, b) => b.amount - a.amount);

    // Take top 10
    const topHolders = holdersArray.slice(0, 10).map((holder, index) => ({
      rank: index + 1,
      owner: holder.owner,
      amount: holder.amount,
      percentage: ((holder.amount / totalSupply) * 100).toFixed(2),
    }));

    const uniqueHolders = holdersArray.map((h) => h.owner);

    const result = {
      holderCount,
      holders: uniqueHolders,
      topHolders,
    };

    // **Start of Caching Logic**
    cache.set(cacheKey, result); // Set data in cache
    console.log(`[Cache Set] Holders for ${mintAddress}`);
    // **End of Caching Logic**

    return result;
=======
    const holders = data.result
      .filter(account => account.account.data.parsed.info.tokenAmount.uiAmount > 0)
      .map(account => account.account.data.parsed.info.owner);
    const uniqueHolders = [...new Set(holders)];
    cache.set(cacheKey, uniqueHolders);
    return uniqueHolders;
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Error fetching token holders:", error);
    throw error;
  }
}

async function getTokenMetadata(apiKey, mintAddress, retries = 3) {
  const cacheKey = `metadata_${mintAddress}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "getAsset",
        method: "getAsset",
        params: { id: mintAddress },
      }),
    });

    const data = await response.json();
    console.log("API response data:", data);
    if (data.error) {
      throw new Error(`Error fetching metadata: ${data.error.message}`);
    }

    // Extract metadata and other data
    const metadata = data.result.content.metadata;
    const decimals = data.result.token_info.decimals || 0;
    const rawSupply = data.result.token_info.supply || 1;
    const supply = rawSupply / Math.pow(10, decimals); // Adjust supply based on decimals
    const pricePerToken = data.result.token_info.price_info?.price_per_token || null;
    const currency = data.result.token_info.price_info?.currency || "USD";

    // Calculate market cap if pricePerToken is available
    const marketCap = pricePerToken ? pricePerToken * supply : null;

    // Extract links if available
    const links = data.result.content.links || {}; // Safely handle links

    // Final structured metadata
    const result = {
      name: metadata.name || "Unknown",
      symbol: metadata.symbol || "Unknown",
      image: links.image || "No Image",
      description: metadata.description || "No Description",
      pricePerToken: pricePerToken ? `${pricePerToken} ${currency}` : "N/A",
      marketCap: marketCap || "N/A",
      supply: supply, // Adjusted supply
      links: links,
    };

    console.log("Adjusted supply:", supply);
    console.log("Price per token:", pricePerToken);

    console.log("Market Cap:", marketCap);

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
}

async function getTokenInfo(apiKey, mintAddress) {
  const [holderInfo, metadata] = await Promise.all([
    getTokenHolders(apiKey, mintAddress),
    getTokenMetadata(apiKey, mintAddress),
  ]);

  return {
<<<<<<< Updated upstream
    holderCount: holderInfo.holderCount,
    holders: holderInfo.holders,
    topHolders: holderInfo.topHolders, // Include topHolders
=======
    holderCount: holderInfo.length,
    holders: holderInfo,
>>>>>>> Stashed changes
    metadata,
  };
}

module.exports = { getTokenHolders, getTokenMetadata, getTokenInfo };
