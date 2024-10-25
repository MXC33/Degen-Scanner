// client/src/components/TokenAccounts.tsx

import React, { useState } from "react";
import { CSSProperties } from "react";

interface TokenAccountsProps {
  mintAddress: string;
}

interface TokenAccountsData {
  mintAddress: string;
  owners: string[];
  totalOwners: number;
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
  },
  list: {
    listStyleType: "none",
    maxHeight: "300px",
    overflowY: "scroll" as CSSProperties["overflowY"],
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "10px",
    backgroundColor: "#fff",
  },
  listItem: {
    padding: "5px 0",
    borderBottom: "1px solid #eee",
    wordBreak: "break-all" as CSSProperties["wordBreak"],
  },
  loading: {
    color: "#666",
  },
  error: {
    color: "#e63946",
    marginTop: "10px",
  },
};

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
    <div style={styles.container}>
      <h2 style={styles.title}>All Owners for Token: {mintAddress}</h2>
      <button
        onClick={fetchTokenAccounts}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#e63946",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {loading ? "Fetching..." : "Fetch All Owners"}
      </button>
      {error && <div style={styles.error}>Error: {error}</div>}
      {data && (
        <div>
          <p>Total Owners: {data.totalOwners}</p>
          <ul style={styles.list}>
            {data.owners.map((owner, index) => (
              <li key={index} style={styles.listItem}>
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
