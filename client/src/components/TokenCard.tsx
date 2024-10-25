// client/src/components/TokenCard.tsx

import React from "react";
import { CSSProperties } from "react";

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

const styles: { [key: string]: CSSProperties } = {
  card: {
    backgroundColor: "#333",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    padding: "15px",
    textAlign: "center" as CSSProperties["textAlign"],
    width: "250px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative" as CSSProperties["position"],
  },
  selectedCard: {
    border: "2px solid #e63946",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "flex-end",
  },
  removeButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    padding: "0",
    margin: "0",
    lineHeight: "1",
  },
  tokenInfoImage: {
    width: "100%",
    height: "auto",
    borderRadius: "4px",
    marginBottom: "5px",
  },
};

const TokenCard: React.FC<TokenCardProps> = ({
  info,
  isSelected,
  onSelect,
  onRemove,
}) => {
  return (
    <div
      style={{
        ...styles.card,
        ...(isSelected ? styles.selectedCard : {}),
      }}
      onClick={() => onSelect(info)}
    >
      <div style={styles.cardHeader}>
        <button
          style={styles.removeButton}
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
          style={styles.tokenInfoImage}
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
