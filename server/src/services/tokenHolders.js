// server/src/services/tokenHolders.js
const fetch = require("node-fetch");
const { LRUCache } = require("lru-cache");

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 60,
});

const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

async function getTokenHolders(apiKey, mintAddress, retries = 3) {
  const cacheKey = `holders_${mintAddress}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

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
            filters: [{ dataSize: 165 }, { memcmp: { offset: 0, bytes: mintAddress } }],
          },
        ],
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(`RPC Error: ${data.error.message}`);

    const accounts = data.result || [];

    const holdersArray = accounts
      .filter((account) => account.account.data.parsed.info.tokenAmount.uiAmount > 0)
      .map((account) => ({
        owner: account.account.data.parsed.info.owner,
        amount: account.account.data.parsed.info.tokenAmount.uiAmount,
      }));

    const holderCount = holdersArray.length;
    const totalSupply = holdersArray.reduce((sum, holder) => sum + holder.amount, 0);

    const topHolders = holdersArray
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .map((holder, index) => ({
        rank: index + 1,
        owner: holder.owner,
        amount: holder.amount,
        percentage: ((holder.amount / totalSupply) * 100).toFixed(2),
      }));

    const result = {
      holderCount,
      holders: holdersArray.map((h) => h.owner),
      topHolders,
    };

    cache.set(cacheKey, result);
    console.log(`[Cache Set] Holders for ${mintAddress}`);
    return result;
  } catch (error) {
    console.error("Error fetching token holders:", error);
    throw error;
  }
}

async function getTokenMetadata(apiKey, mintAddress, retries = 3) {
  const cacheKey = `metadata_${mintAddress}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

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
    if (data.error) throw new Error(`Error fetching metadata: ${data.error.message}`);

    const metadata = data.result.content.metadata || {};
    const decimals = data.result.token_info?.decimals || 0;
    const rawSupply = data.result.token_info?.supply || 1;
    const supply = rawSupply / Math.pow(10, decimals);
    const pricePerToken = data.result.token_info?.price_info?.price_per_token || null;
    const currency = data.result.token_info?.price_info?.currency || "USD";

    const marketCap = pricePerToken ? pricePerToken * supply : null;
    const links = data.result.content.links || {};

    const result = {
      name: metadata.name || "Unknown",
      symbol: metadata.symbol || "Unknown",
      image: links.image || "No Image",
      description: metadata.description || "No Description",
      pricePerToken: pricePerToken ? `${pricePerToken} ${currency}` : "N/A",
      marketCap: marketCap || "N/A",
      supply: supply,
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
  try {
    const [holderInfo, metadata] = await Promise.all([
      getTokenHolders(apiKey, mintAddress),
      getTokenMetadata(apiKey, mintAddress),
    ]);

    return {
      holderCount: holderInfo.holderCount,
      holders: holderInfo.holders,
      topHolders: holderInfo.topHolders,
      metadata,
    };
  } catch (error) {
    console.error("Error fetching token info:", error);
    throw error;
  }
}

module.exports = { getTokenHolders, getTokenMetadata, getTokenInfo };
