// client/src/components/CombinedInfo.tsx

import React from "react";
import "./styles/CombinedInfo.css";

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

const CombinedInfo: React.FC<CombinedInfoProps> = ({
  selectedTokens,
  commonHoldersCount,
  loading,
}) => {
  if (selectedTokens.length === 0) return null;

  if (selectedTokens.length === 1) {
    return (
      <div className="combined-box">
        <p>Select another token to see common holders.</p>
      </div>
    );
  }

  if (selectedTokens.length === 2) {
    const [token1, token2] = selectedTokens;

    return (
      <div className="combined-box">
        <div className="combined-images">
          <img
            src={token1.metadata.image}
            alt={token1.metadata.name}
            className="combined-image"
          />
          <img
            src={token2.metadata.image}
            alt={token2.metadata.name}
            className="combined-image"
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
