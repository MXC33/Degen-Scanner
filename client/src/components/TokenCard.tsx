// client/src/components/TokenCard.tsx

import React from "react";
import "./styles/TokenCard.css";

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
    </div>
  );
};

export default TokenCard;
