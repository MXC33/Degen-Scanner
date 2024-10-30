// client/src/components/TokenAccounts.tsx

import React, { useState } from "react";
import "./styles/TokenAccounts.css";

interface TokenAccountsProps {
  mintAddress: string;
}

interface TokenAccountsData {
  mintAddress: string;
  owners: string[];
  totalOwners: number;
}

const TokenAccounts: React.FC<TokenAccountsProps> = ({ mintAddress }) => {
  const [data, setData] = useState<TokenAccountsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenAccounts = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/token-accounts/${mintAddress}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch token accounts");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-accounts-container">
      <h2 className="token-accounts-title">
        All Owners for Token: {mintAddress}
      </h2>
      <button
        onClick={fetchTokenAccounts}
        disabled={loading}
        className="fetch-button"
      >
        {loading ? "Fetching..." : "Fetch All Owners"}
      </button>
      {error && <div className="token-accounts-error">Error: {error}</div>}
      {data && (
        <div>
          <p>Total Owners: {data.totalOwners}</p>
          <ul className="token-accounts-list">
            {data.owners.map((owner, index) => (
              <li key={index} className="token-accounts-list-item">
                {owner}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TokenAccounts;
