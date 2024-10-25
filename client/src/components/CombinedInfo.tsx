// client/src/components/CombinedInfo.tsx

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

interface CombinedInfoProps {
  selectedTokens: TokenInfo[];
  commonHoldersCount: number | null;
  loading: boolean;
}

const styles: { [key: string]: CSSProperties } = {
  combinedBox: {
    backgroundColor: "#444",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center" as CSSProperties["textAlign"],
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  combinedImages: {
    display: "flex",
    gap: "10px",
  },
  combinedImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
  },
};

const CombinedInfo: React.FC<CombinedInfoProps> = ({
  selectedTokens,
  commonHoldersCount,
  loading,
}) => {
  if (selectedTokens.length === 0) return null;

  if (selectedTokens.length === 1) {
    return (
      <div style={styles.combinedBox}>
        <p>Select another token to see common holders.</p>
      </div>
    );
  }

  if (selectedTokens.length === 2) {
    const [token1, token2] = selectedTokens;

    return (
      <div style={styles.combinedBox}>
        <div style={styles.combinedImages}>
          <img
            src={token1.metadata.image}
            alt={token1.metadata.name}
            style={styles.combinedImage}
          />
          <img
            src={token2.metadata.image}
            alt={token2.metadata.name}
            style={styles.combinedImage}
          />
        </div>
        {loading ? (
          <p>Loading common holders...</p>
        ) : (
          <p>
            <strong>{token1.metadata.symbol}</strong> and{" "}
            <strong>{token2.metadata.symbol}</strong> have{" "}
            <strong>{commonHoldersCount}</strong> common holders.
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default CombinedInfo;
