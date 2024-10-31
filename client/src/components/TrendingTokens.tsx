// client/src/components/TrendingTokens.tsx

import React, { useEffect, useState } from "react";
import "./styles/TrendingTokens.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

interface TokenInfo {
  mintAddress: string;
  holderCount: number;
  metadata: {
    name: string;
    symbol: string;
    image: string;
  };
  change: number;
}

const TrendingTokens: React.FC = () => {

  const [trendingTokens, setTrendingTokens] = useState<TokenInfo[]>([]);
  const contractAddresses = [
    "6Pz3LdoipwFor2w9tGKfnLZZkJvucwbEef8yV9kvtE2M",
    "9TVjnzpF3X8DHsfVqYWoCGphJxtGYh1PDCFN5QmsHW5t",
    "HXkbUADfocGyz2WrzJpjEfry8qyNDm5Kwiiq3Mz3tTi1",
    "GdHhyqHEJrPzpbfzURrJi8v1uJQRpthfzURqHJtHXyPC",
  ];

  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        const fetchedTokens = await Promise.all(
          contractAddresses.map(async (address) => {
            const response = await fetch(
              `${API_BASE_URL}/api/token-info/${address}`
            );
            if (!response.ok) throw new Error("Failed to fetch token data");

            const data = await response.json();
            return {
              mintAddress: data.mintAddress,
              holderCount: data.holderCount,
              metadata: {
                name: data.metadata.name,
                symbol: data.metadata.symbol,
                image: data.metadata.image,
              },
              change: (Math.random() - 0.5) * 10,
            };
          })
        );
        setTrendingTokens(fetchedTokens);
      } catch (error) {
        console.error("Error fetching trending tokens:", error);
      }
    };

    fetchTrendingTokens();
  }, []);

  return (
    <div className="banner-container">
      <div className="banner-content">
        {trendingTokens.map((token) => (
          <div className="banner-item" key={token.mintAddress}>
            <img
              src={token.metadata.image}
              alt={token.metadata.symbol}
              className="banner-image"
            />
            <div>
              <strong>{token.metadata.symbol}</strong> | Holders:{" "}
              {token.holderCount} |{" "}
              <span
                className={
                  token.change >= 0 ? "positive-change" : "negative-change"
                }
              >
                {token.change.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTokens;
