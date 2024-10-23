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
  hero: {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    padding: '40px',
    textAlign: 'center',
    marginBottom: '30px',
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '20px',
  },
  heroInput: {
    width: '80%',
    padding: '15px',
    fontSize: '18px',
    marginBottom: '20px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#333',
    color: '#fff',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '18px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  redButton: {
    backgroundColor: '#e63946',
    '&:hover': {
      backgroundColor: '#b6323b',
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#333',
    color: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    padding: '15px',
    textAlign: 'center',
    width: '250px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    },
  },
  selectedCard: {
    border: '2px solid #e63946',
  },
  tokenInfoImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginBottom: '5px',
  },
  description: {
    fontSize: '12px',
    marginTop: '10px',
    textAlign: 'left',
    maxHeight: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  readMore: {
    cursor: 'pointer',
    color: '#3490dc',
    fontSize: '12px',
  },
  combinedBox: {
    backgroundColor: '#444',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  combinedImages: {
    display: 'flex',
    gap: '10px',
  },
  combinedImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  },
};

export default function TokenInfo() {
  const [mintAddress, setMintAddress] = useState("");
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<TokenInfo[]>([]);

  const fetchTokenInfo = async (address: string) => {
    setLoading(true);
    setError(null);
    setMintAddress(""); // Clear input after fetching

    try {
      const response = await fetch(`http://localhost:3000/api/token-info/${address}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch token information");
      }
      const data = await response.json();
      const tokenData: TokenInfo = {
        mintAddress: data.mintAddress || address,
        holderCount: data.holderCount || "Unknown",
        metadata: {
          name: data.metadata.name || "Unknown",
          symbol: data.metadata.symbol || "Unknown",
          description: data.metadata.description || "No Description",
          image: data.metadata.image || "",
        },
      };
      setTokens((prevTokens) => [...prevTokens, tokenData]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFetchToken = () => {
    fetchTokenInfo(mintAddress);
  };

  const handleTokenSelect = (info: TokenInfo) => {
    if (selectedTokens.includes(info)) {
      // Deselect token
      setSelectedTokens((prevSelected) => prevSelected.filter((t) => t !== info));
    } else if (selectedTokens.length < 2) {
      // Select token if less than 2 are selected
      setSelectedTokens((prevSelected) => [...prevSelected, info]);
    }
  };

  const renderTokenInfo = (info: TokenInfo) => {
    const isSelected = selectedTokens.includes(info);

    return (
      <div
        style={{ ...styles.card, ...(isSelected ? styles.selectedCard : {}) }}
        key={info.mintAddress}
        onClick={() => handleTokenSelect(info)}
      >
        {info.metadata.image && (
          <img
            src={info.metadata.image}
            alt={info.metadata.name}
            style={styles.tokenInfoImage}
          />
        )}
        <p><strong>${info.metadata.symbol}</strong></p>
        <p>{info.metadata.name}</p>
        <p>Holders: {info.holderCount}</p>
      </div>
    );
  };

  const renderCombinedInfo = () => {
    if (selectedTokens.length === 1) {
      return (
        <div style={styles.combinedBox}>
          <p>Select another token to see total holders.</p>
        </div>
      );
    }

    if (selectedTokens.length === 2) {
      const [token1, token2] = selectedTokens;
      const combinedHolders = token1.holderCount + token2.holderCount;

      return (
        <div style={styles.combinedBox}>
          <div style={styles.combinedImages}>
            <img src={token1.metadata.image} alt={token1.metadata.name} style={styles.combinedImage} />
            <img src={token2.metadata.image} alt={token2.metadata.name} style={styles.combinedImage} />
          </div>
          <p>
            <strong>{token1.metadata.symbol}</strong> + <strong>{token2.metadata.symbol}</strong> together have{" "}
            <strong>{combinedHolders}</strong> holders.
          </p>
        </div>
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Token Information</h1>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="Enter mint address (32-44 characters)"
          style={styles.heroInput}
        />
        <div style={styles.buttonContainer}>
          <button
            onClick={handleFetchToken}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.disabledButton : styles.redButton),
            }}
          >
            {loading ? "Loading..." : "Fetch Token"}
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            <strong>Error: </strong>
            <span>{error}</span>
          </div>
        )}
      </div>

      {renderCombinedInfo()}

      <div style={styles.grid}>
        {tokens.map(renderTokenInfo)}
      </div>
    </div>
  );
}
