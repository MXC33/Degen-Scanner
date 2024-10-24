// tokenHolders.js

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
    if (!cursor) {
      break;
    }
  }

  return {
    holderCount: allOwners.size,
    holders: Array.from(allOwners),
  };
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

      let image = metadata.offChainMetadata?.metadata?.image || "No Image";
      const ipfsUri =
        metadata.onChainMetadata?.metadata?.data?.uri ||
        metadata.offChainMetadata?.uri;

      // If the IPFS link exists and is JSON, fetch the content from that link
      if (ipfsUri && ipfsUri.includes("ipfs.io")) {
        try {
          const ipfsResponse = await fetch(ipfsUri);
          const ipfsData = await ipfsResponse.json();

          // Check if the IPFS JSON has an image field
          if (ipfsData.image) {
            image = ipfsData.image;
          }
        } catch (ipfsError) {
          console.error("Error fetching IPFS data:", ipfsError);
        }
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
  const [tokenHoldersResult, metadata] = await Promise.all([
    getTokenHolders(apiKey, mintAddress),
    getTokenMetadata(apiKey, mintAddress),
  ]);

  return {
    holders: tokenHoldersResult.holders,
    holderCount: tokenHoldersResult.holderCount,
    metadata: metadata,
  };
}

module.exports = { getTokenHolders, getTokenMetadata, getTokenInfo };
