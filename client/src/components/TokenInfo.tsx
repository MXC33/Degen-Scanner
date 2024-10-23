import React, { useState } from "react";

export default function TokenInfo() {
  const [mintAddress, setMintAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/token-info/${mintAddress}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch token information");
      }
      const data = await response.json();
      setTokenInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Token Information</h1>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="Enter mint address"
          className="flex-grow border rounded px-2 py-1"
        />
        <button
          onClick={fetchTokenInfo}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:bg-blue-300"
        >
          {loading ? "Loading..." : "Fetch Info"}
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {tokenInfo && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-semibold mb-2">
            {tokenInfo.metadata.name} ({tokenInfo.metadata.symbol})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Mint Address:</strong> {tokenInfo.mintAddress}
              </p>
              <p>
                <strong>Holder Count:</strong> {tokenInfo.holderCount}
              </p>
              <p>
                <strong>Description:</strong> {tokenInfo.metadata.description}
              </p>
            </div>
            <div>
              {tokenInfo.metadata.image && (
                <img
                  src={tokenInfo.metadata.image}
                  alt={tokenInfo.metadata.name}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
