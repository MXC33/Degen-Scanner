// client/src/types/TokenInfo.ts

export interface TopHolder {
  rank: number;
  owner: string;
  amount: number;
  percentage: string;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
}

export interface TokenInfo {
  mintAddress: string;
  holderCount: number;
  holders: string[];
  topHolders: TopHolder[];
  metadata: TokenMetadata;
}
