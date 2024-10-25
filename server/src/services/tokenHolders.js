const fetch = require("node-fetch");
const { LRUCache } = require("lru-cache"); // Updated import for v11.x

// Initialize LRU Cache
const cache = new LRUCache({
  max: 500, // Maximum number of items in cache
  ttl: 1000 * 60 * 60, // Time to live in milliseconds (1 hour)
});

// Solana's Token Program ID (SPL Token Program)
const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

async function getTokenHolders(apiKey, mintAddress, retries = 3) {
  // Added 'retries' parameter
  const cacheKey = `holders_${mintAddress}`; // Unique cache key for holders

  // **Start of Caching Logic**
  if (cache.has(cacheKey)) {
    console.log(`[Cache Hit] Holders for ${mintAddress}`);
    return cache.get(cacheKey);
  } else {
    console.log(`[Cache Miss] Holders for ${mintAddress}`);
  }
  // **End of Caching Logic**

  const url = `https://rpc.helius.xyz/?api-key=${apiKey}`;

  try {
    const requestBody = {
      jsonrpc: "2.0",
      id: 1,
      method: "getProgramAccounts",
      params: [
        TOKEN_PROGRAM_ID,
        {
          encoding: "jsonParsed",
          filters: [
            { dataSize: 165 }, // Size of SPL Token Account
            {
              memcmp: {
                offset: 0, // Mint address starts at offset 0
                bytes: mintAddress,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      if (data.error.message.includes("Rate limit exceeded") && retries > 0) {
        console.warn("Rate limit exceeded. Retrying after delay...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
        return getTokenHolders(apiKey, mintAddress, retries - 1);
      }
      throw new Error(`RPC Error: ${data.error.message}`);
    }

    const accounts = data.result;

    const holders = accounts
      .filter((account) => {
        const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
        return amount > 0;
      })
      .map((account) => account.account.data.parsed.info.owner);

    const uniqueHolders = [...new Set(holders)];

    const result = {
      holderCount: uniqueHolders.length,
      holders: uniqueHolders,
    };

    // **Start of Caching Logic**
    cache.set(cacheKey, result); // Set data in cache
    console.log(`[Cache Set] Holders for ${mintAddress}`);
    // **End of Caching Logic**

    return result;
  } catch (error) {
    console.error("Error fetching token holders:", error);
    throw error;
  }
}

async function getTokenMetadata(apiKey, mintAddress, retries = 3) {
  // Added 'retries' parameter
  const cacheKey = `metadata_${mintAddress}`; // Unique cache key for metadata

  // **Start of Caching Logic**
  if (cache.has(cacheKey)) {
    console.log(`[Cache Hit] Metadata for ${mintAddress}`);
    return cache.get(cacheKey);
  } else {
    console.log(`[Cache Miss] Metadata for ${mintAddress}`);
  }
  // **End of Caching Logic**

  const url = `https://api.helius.xyz/v0/token-metadata?api-key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mintAccounts: [mintAddress],
        includeOffChain: true,
        disableCache: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`
        HTTP error! status: ${response.status}, message: ${errorText}
      `);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const metadata = data[0];

      let image = metadata.offChainMetadata?.metadata?.image || "No Image";

      // Fetch image from IPFS if necessary
      if (image && image.startsWith("ipfs://")) {
        image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      const result = {
        name:
          metadata.onChainMetadata?.metadata?.data?.name ||
          metadata.offChainMetadata?.metadata?.name ||
          "Unknown",
        symbol:
          metadata.onChainMetadata?.metadata?.data?.symbol ||
          metadata.offChainMetadata?.metadata?.symbol ||
          "Unknown",
        image: image,
        description:
          metadata.offChainMetadata?.metadata?.description || "No Description",
      };

      // **Start of Caching Logic**
      cache.set(cacheKey, result); // Set data in cache
      console.log(`[Cache Set] Metadata for ${mintAddress}`);

      // **End of Caching Logic**

      return result;
    }

    const fallback = {
      name: "Unknown",
      symbol: "Unknown",
      image: "No Image",
      description: "No Description",
    };

    // **Start of Caching Logic**
    cache.set(cacheKey, fallback); // Set fallback in cache
    console.log(`[Cache Set] Metadata fallback for ${mintAddress}`);
    // **End of Caching Logic**

    return fallback;
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
    holderCount: holderInfo.holderCount,
    holders: holderInfo.holders,
    metadata,
  };
}

module.exports = { getTokenHolders, getTokenMetadata, getTokenInfo };
