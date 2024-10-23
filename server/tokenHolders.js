const fetch = require("node-fetch");

async function getTokenHolders(apiKey, mintAddress) {
  const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
  let allOwners = new Set();
  let cursor;

  while (true) {
    let params = {
      limit: 1000,
      mint: mintAddress,
    };

    if (cursor != undefined) {
      params.cursor = cursor;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "helius-test",
        method: "getTokenAccounts",
        params: params,
      }),
    });

    const data = await response.json();

    if (!data.result || data.result.token_accounts.length === 0) {
      console.log("No more results");
      break;
    }

    data.result.token_accounts.forEach((account) => {
      allOwners.add(account.owner);
    });

    cursor = data.result.cursor;
  }

  return allOwners.size;
}

async function getTokenMetadata(apiKey, mintAddress) {
  const url = `https://api.helius.xyz/v0/token-metadata?api-key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mintAccounts: [mintAddress],
        includeOffChain: true,
        disableCache: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Raw API response:", JSON.stringify(data, null, 2));

    if (data && data.length > 0) {
      const metadata = data[0];
      return {
        name:
          metadata.onChainMetadata?.metadata?.name ||
          metadata.offChainMetadata?.name ||
          "Unknown",
        symbol:
          metadata.onChainMetadata?.metadata?.symbol ||
          metadata.offChainMetadata?.symbol ||
          "Unknown",
        image: metadata.offChainMetadata?.image || "No Image",
        description: metadata.offChainMetadata?.description || "No Description",
      };
    }

    return {
      name: "Unknown",
      symbol: "Unknown",
      image: "No Image",
      description: "No Description",
    };
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
}

module.exports = { getTokenHolders, getTokenMetadata };
