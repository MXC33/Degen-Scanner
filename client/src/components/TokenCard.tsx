// client/src/components/TokenCard.tsx

import React, { useState } from "react";
import TopHolders from "./TopHolders"; // Import the new component
import "./styles/TokenCard.css";
import { TokenInfo } from "../types/types"; // Import shared types

interface TokenCardProps {
  info: TokenInfo;
  isSelected: boolean;
  onSelect: (info: TokenInfo) => void;
  onRemove: (info: TokenInfo) => void;
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
    </div>
  );
};

export default TokenCard;
