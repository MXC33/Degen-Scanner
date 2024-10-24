// tokenHolders.js

const fetch = require("node-fetch");

// Solana's Token Program ID (SPL Token Program)
const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

async function getTokenHolders(apiKey, mintAddress) {
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
            {
              dataSize: 165, // Size of SPL Token Account
            },
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message}`);
    }

    const accounts = data.result;

    // Extract owners from the accounts
    const holders = accounts
      .filter((account) => {
        const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
        return amount > 0;
      })
      .map((account) => account.account.data.parsed.info.owner);

    // Remove duplicates
    const uniqueHolders = [...new Set(holders)];

    return {
      holderCount: uniqueHolders.length,
      holders: uniqueHolders,
    };
  } catch (error) {
    console.error("Error fetching token holders:", error);
    throw error;
  }
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

    if (data && data.length > 0) {
      const metadata = data[0];

      let image = metadata.offChainMetadata?.metadata?.image || "No Image";

      // Fetch image from IPFS if necessary
      if (image && image.startsWith("ipfs://")) {
        image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      return {
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
