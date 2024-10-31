<<<<<<< Updated upstream
// client/src/components/TokenCard.tsx

import React, { useState } from "react";
import TopHolders from "./TopHolders"; // Import the new component
import "./styles/TokenCard.css";
import { TokenInfo } from "../types/types"; // Import shared types
=======
import React from "react";
import "./styles/TokenCard.css";
import { TokenInfoType } from "../types/types";
import { formatSmallNumber, formatLargeNumber } from "../utilities/formatNumber"; // Import utilities


>>>>>>> Stashed changes

interface TokenCardProps {
  info: TokenInfoType;
  isSelected: boolean;
  onSelect: (info: TokenInfoType) => void;
  onRemove: (info: TokenInfoType) => void;
}

const TokenCard: React.FC<TokenCardProps> = ({
  info,
  isSelected,
  onSelect,
  onRemove,
}) => {
  const [showTopHolders, setShowTopHolders] = useState(false); // New state

  const toggleTopHolders = () => {
    setShowTopHolders((prev) => !prev);
  };

  return (
    <div
      className={`token-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(info)}
    >
      <div className="card-header">
        <button
          className="remove-button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(info);
          }}
        >
          &times;
        </button>
      </div>
      {info.metadata.image && (
        <img
          src={info.metadata.image}
          alt={info.metadata.name}
          className="token-info-image"
        />
      )}
<<<<<<< Updated upstream
      <p>
        <strong>{info.metadata.symbol}</strong>
      </p>
      <p>{info.metadata.name}</p>
      <p>Holders: {info.holderCount}</p>

      {/* New Button to Toggle Top Holders */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleTopHolders();
        }}
        className="show-top-holders-button"
      >
        {showTopHolders ? "Hide Top Holders" : "Show Top Holders"}
      </button>

      {/* Conditionally Render TopHolders */}
      {showTopHolders && <TopHolders topHolders={info.topHolders} />}
=======
      <p className="token-symbol">{info.metadata.symbol}</p>
      <div className="token-details">
        <p>{info.metadata.name}</p>
        <p>Holders: {info.holderCount}</p>
        {info.marketCap && <p>Market Cap: ${formatLargeNumber(info.marketCap)}</p>} 
        {info.pricePerToken && <p>Price per Token: {formatSmallNumber(parseFloat(info.pricePerToken))} USDC</p>}
      </div>
      <div className="social-links">
        {info.links?.discord && (
          <a href={info.links.discord} target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        )}
        {info.links?.twitter && (
          <a href={info.links.twitter} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        )}
        {info.links?.website && (
          <a href={info.links.website} target="_blank" rel="noopener noreferrer">
            Website
          </a>
        )}
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default TokenCard;
