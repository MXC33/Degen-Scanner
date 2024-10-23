import React, { useState } from "react";

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

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  blueButton: {
    backgroundColor: '#3490dc',
  },
  greenButton: {
    backgroundColor: '#38a169',
  },
  disabledButton: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
  },
  error: {
    backgroundColor: '#fed7d7',
    borderColor: '#f56565',
    color: '#c53030',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  tokenInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
  tokenInfoImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default function TokenInfo() {
  const [mintAddress, setMintAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [secondTokenInfo, setSecondTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchTokenInfo = async (address: string, setInfo: React.Dispatch<React.SetStateAction<TokenInfo | null>>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/token-info/${address}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch token information");
      }
      const data = await response.json();
      console.log("API Response Data:", data);  // Log the data to check if fields are correctly returned
  
      const tokenData = {
        mintAddress: data.mintAddress || address,
        holderCount: data.holderCount || "Unknown", 
        metadata: {
          name: data.metadata.name || "Unknown",  
          symbol: data.metadata.symbol || "Unknown",  
          description: data.metadata.description || "No Description", 
          image: data.metadata.image || "",  // Image will now contain the correct link
        },
      };
      
      setInfo(tokenData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  
      
  
  

  const handleFetchFirstToken = () => fetchTokenInfo(mintAddress, setTokenInfo);
  const handleFetchSecondToken = () => {
    if (tokenInfo) {
      fetchTokenInfo(mintAddress, setSecondTokenInfo);
    }
  };

  const renderTokenInfo = (info: TokenInfo | null, title: string) => {
    if (!info) return null;
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.tokenInfoGrid}>
          <div>
            <p><strong>Name:</strong> {info.metadata.name}</p>
            <p><strong>Symbol:</strong> {info.metadata.symbol}</p>
            <p><strong>Mint Address:</strong> {info.mintAddress}</p>
            <p><strong>Holder Count:</strong> {info.holderCount}</p>
            <p><strong>Description:</strong> {info.metadata.description}</p>
          </div>
          <div>
            {info.metadata.image && (
              <img
                src={info.metadata.image}
                alt={info.metadata.name}
                style={styles.tokenInfoImage}
              />
            )}
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Token Information</h1>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="Enter mint address (32-44 characters)"
          style={styles.input}
        />
        <div style={styles.buttonContainer}>
          <button
            onClick={handleFetchFirstToken}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.disabledButton : styles.blueButton),
            }}
          >
            {loading ? "Loading..." : "Fetch First Token"}
          </button>
          <button
            onClick={handleFetchSecondToken}
            disabled={loading || !tokenInfo}
            style={{
              ...styles.button,
              ...(loading || !tokenInfo ? styles.disabledButton : styles.greenButton),
            }}
          >
            Fetch Second Token
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            <strong>Error: </strong>
            <span>{error}</span>
          </div>
        )}
      </div>

      {renderTokenInfo(tokenInfo, "First Token Information")}
      {renderTokenInfo(secondTokenInfo, "Second Token Information")}
    </div>
  );
}