// client/src/components/TrendingTokens.tsx
import React, { useEffect, useState } from "react";
import { CSSProperties } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"; // Ensure this line is present

interface TokenInfo {
  mintAddress: string;
  holderCount: number;
  metadata: {
    name: string;
    symbol: string;
    image: string;
  };
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    marginBottom: "20px",
    maxWidth: "300px",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 0",
    borderBottom: "1px solid #333",
  },
  image: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
};

const TrendingTokens: React.FC = () => {
  const [trendingTokens, setTrendingTokens] = useState<TokenInfo[]>([]);
  const contractAddresses = [
    "6Pz3LdoipwFor2w9tGKfnLZZkJvucwbEef8yV9kvtE2M",
    "9TVjnzpF3X8DHsfVqYWoCGphJxtGYh1PDCFN5QmsHW5t",

  ];

  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        const fetchedTokens = await Promise.all(
          contractAddresses.map(async (address) => {
            const response = await fetch(`${API_BASE_URL}/api/token-info/${address}`);
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
    <div style={styles.container}>
      <h3>Trending Tokens</h3>
      {trendingTokens.map((token) => (
        <div style={styles.listItem} key={token.mintAddress}>
          <img src={token.metadata.image} alt={token.metadata.symbol} style={styles.image} />
          <div>
            <p>
              <strong>{token.metadata.symbol}</strong>
            </p>
            <p>Holders: {token.holderCount}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingTokens;
