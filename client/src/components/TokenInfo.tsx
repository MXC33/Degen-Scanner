// client/src/components/TokenInfo.tsx

import React, { useState } from "react";
import TokenCard from "./TokenCard";
import CombinedInfo from "./CombinedInfo";
import TokenAccounts from "./TokenAccounts";
import TrendingTokens from "./TrendingTokens";
import useFetchToken from "../hooks/useFetchToken";
import "./styles/TokenInfo.css";
import WalletConnectButton from "./WalletConnectButton";

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
      <WalletConnectButton />

      <div className="token-info-container">
        <div className="token-info-hero">
          <h1 className="hero-title">Token Information</h1>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter mint address (32-44 characters)"
            className="hero-input"
          />
          <div className="button-container">
            <button
              onClick={handleFetchToken}
              disabled={loading || mintAddress.trim() === ""}
              className={`fetch-button ${
                loading || mintAddress.trim() === "" ? "disabled" : ""
              }`}
            >
              {loading ? "Loading..." : "Fetch Token"}
            </button>
          </div>

          {error && (
            <div className="token-info-error">
              <strong>Error: </strong>
              <span>{error}</span>
            </div>
          )}
        </div>

        <CombinedInfo
          selectedTokens={selectedTokens}
          commonHoldersCount={commonHoldersCount}
          loading={loadingComparison}
        />

        <div className="token-info-grid">
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
                className="show-owners-button"
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
    </div>
  );
}
