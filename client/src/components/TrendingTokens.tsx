/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

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

// Define the keyframes separately
const scrollAnimation = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// Use Emotion's `css` to apply keyframes animation
const bannerContentStyle = css`
  display: inline-flex;
  align-items: center;
  animation: ${scrollAnimation} 15s linear infinite;
`;

const styles: { [key: string]: React.CSSProperties } = {
  bannerContainer: {
    backgroundColor: "#222",
    color: "white",
    padding: "10px 0",
    overflow: "hidden",
    whiteSpace: "nowrap",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
  },
  bannerItem: {
    display: "flex",
    alignItems: "center",
    margin: "0 30px",
    gap: "10px",
  },
  image: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
  },
  positiveChange: {
    color: "green",
  },
  negativeChange: {
    color: "red",
  },
};

const TrendingTokens: React.FC = () => {
  const [trendingTokens, setTrendingTokens] = useState<TokenInfo[]>([]);
  const contractAddresses = [
    "6Pz3LdoipwFor2w9tGKfnLZZkJvucwbEef8yV9kvtE2M",
    "9TVjnzpF3X8DHsfVqYWoCGphJxtGYh1PDCFN5QmsHW5t",
    "HXkbUADfocGyz2WrzJpjEfry8qyNDm5Kwiiq3Mz3tTi1",
    "GdHhyqHEJrPzpbfzURrJi8v1uJQRpthfzURqHJtHXyPC"

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
    <div style={styles.bannerContainer}>
      <div css={bannerContentStyle}>
        {trendingTokens.map((token) => (
          <div style={styles.bannerItem} key={token.mintAddress}>
            <img src={token.metadata.image} alt={token.metadata.symbol} style={styles.image} />
            <div>
              <strong>{token.metadata.symbol}</strong> | Holders: {token.holderCount} |{" "}
              <span style={token.change >= 0 ? styles.positiveChange : styles.negativeChange}>
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
