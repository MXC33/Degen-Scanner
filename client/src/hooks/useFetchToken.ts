// client/src/hooks/useFetchToken.ts

import { useState } from "react";

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

interface FetchResult {
  tokens: TokenInfo[];
  loading: boolean;
  error: string | null;
  fetchTokenInfo: (address: string) => Promise<void>;
  selectedTokens: TokenInfo[];
  selectToken: (info: TokenInfo) => void;
  removeToken: (info: TokenInfo) => void;
  commonHoldersCount: number | null;
  loadingComparison: boolean;
}

const useFetchToken = (apiBaseUrl: string): FetchResult => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<TokenInfo[]>([]);
  const [commonHoldersCount, setCommonHoldersCount] = useState<number | null>(
    null
  );
  const [loadingComparison, setLoadingComparison] = useState(false);

  const fetchTokenInfo = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/token-info/${address}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch token information");
      }
      const data = await response.json();
      const tokenData: TokenInfo = {
        mintAddress: data.mintAddress || address,
        holderCount: data.holderCount || 0,
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

  const selectToken = async (info: TokenInfo) => {
    if (selectedTokens.includes(info)) {
      // Deselect token
      setSelectedTokens((prevSelected) =>
        prevSelected.filter((t) => t !== info)
      );
      setCommonHoldersCount(null);
    } else if (selectedTokens.length < 2) {
      // Select token if less than 2 are selected
      const newSelectedTokens = [...selectedTokens, info];
      setSelectedTokens(newSelectedTokens);

      if (newSelectedTokens.length === 2) {
        // Fetch common holders count
        setLoadingComparison(true);
        try {
          const data = await fetchTokenComparison(
            newSelectedTokens[0].mintAddress,
            newSelectedTokens[1].mintAddress
          );
          setCommonHoldersCount(data.commonHoldersCount);
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setLoadingComparison(false);
        }
      }
    }
  };

  const removeToken = (info: TokenInfo) => {
    // Remove the token from the tokens list
    setTokens((prevTokens) => prevTokens.filter((token) => token !== info));
    // Deselect the token if it's selected
    if (selectedTokens.includes(info)) {
      setSelectedTokens((prevSelected) =>
        prevSelected.filter((t) => t !== info)
      );
      setCommonHoldersCount(null);
    }
  };

  const fetchTokenComparison = async (address1: string, address2: string) => {
    const response = await fetch(
      `${apiBaseUrl}/api/token-compare/${address1}/${address2}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch token comparison information"
      );
    }
    const data = await response.json();
    return data;
  };

  return {
    tokens,
    loading,
    error,
    fetchTokenInfo,
    selectedTokens,
    selectToken,
    removeToken,
    commonHoldersCount,
    loadingComparison,
  };
};

export default useFetchToken;
