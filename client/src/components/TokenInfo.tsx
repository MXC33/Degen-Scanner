// client/src/components/TokenInfo.tsx

import React, { useState } from "react";
import TokenCard from "./TokenCard";
import CombinedInfo from "./CombinedInfo";
import TokenAccounts from "./TokenAccounts";
import TrendingTokens from "./TrendingTokens";
import useFetchToken from "../hooks/useFetchToken";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

interface TokenInfo {
  mintAddress: string;
  holderCount: number;
  metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string;
  };
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  hero: {
    backgroundColor: "#1e1e1e",
    borderRadius: "8px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    padding: "40px",
    textAlign: "center" as React.CSSProperties["textAlign"],
    marginBottom: "30px",
  },
  heroTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "20px",
  },
  heroInput: {
    width: "80%",
    padding: "15px",
    fontSize: "18px",
    marginBottom: "20px",
    border: "2px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#333",
    color: "#fff",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    flex: 1,
    padding: "12px 20px",
    fontSize: "18px",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  redButton: {
    backgroundColor: "#e63946",
  },
  disabledButton: {
    backgroundColor: "#b6323b",
    cursor: "not-allowed",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  error: {
    backgroundColor: "#fed7d7",
    borderColor: "#f56565",
    color: "#c53030",
    padding: "12px",
    borderRadius: "4px",
    marginTop: "20px",
  },
};

export default function TokenInfo() {
  const {
    tokens,
    loading,
    error,
    fetchTokenInfo,
    selectedTokens,
    selectToken,
    removeToken,
    commonHoldersCount,
    loadingComparison,
  } = useFetchToken(API_BASE_URL);

  const [mintAddress, setMintAddress] = useState("");
  const [showTokenAccounts, setShowTokenAccounts] = useState<{
    [key: string]: boolean;
  }>({}); // Track which tokens have their accounts shown

  const handleFetchToken = () => {
    if (mintAddress.trim() !== "") {
      fetchTokenInfo(mintAddress.trim());
      setMintAddress(""); // Clear input after fetching
    }
  };

  const toggleTokenAccounts = (address: string) => {
    setShowTokenAccounts((prevState) => ({
      ...prevState,
      [address]: !prevState[address],
    }));
  };

  return (
  <div style={{ paddingTop: "60px" }}>
    <TrendingTokens />
  
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Token Information</h1>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="Enter mint address (32-44 characters)"
          style={styles.heroInput}
        />
        <div style={styles.buttonContainer}>
          <button
            onClick={handleFetchToken}
            disabled={loading || mintAddress.trim() === ""}
            style={{
              ...styles.button,
              ...(loading || mintAddress.trim() === ""
                ? styles.disabledButton
                : styles.redButton),
            }}
          >
            {loading ? "Loading..." : "Fetch Token"}
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            <strong>Error: </strong>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>

      <CombinedInfo
        selectedTokens={selectedTokens}
        commonHoldersCount={commonHoldersCount}
        loading={loadingComparison}
      />

      <div style={styles.grid}>
        {tokens.map((token) => (
          <div key={token.mintAddress}>
            <TokenCard
              info={token}
              isSelected={selectedTokens.includes(token)}
              onSelect={selectToken}
              onRemove={removeToken}
            />
            <button
              onClick={() => toggleTokenAccounts(token.mintAddress)}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#3490dc",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {showTokenAccounts[token.mintAddress]
                ? "Hide Owners"
                : "Show Owners"}
            </button>
            {showTokenAccounts[token.mintAddress] && (
              <TokenAccounts mintAddress={token.mintAddress} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
