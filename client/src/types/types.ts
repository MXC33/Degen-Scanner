<<<<<<< Updated upstream
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
=======
// client/src/types/types.ts

export interface TokenInfoType {
    mintAddress: string;
    holderCount: number;
    supply: number;
    marketCap?: number;
    pricePerToken?: string;
    metadata: {
      name: string;
      symbol: string;
      description: string;
      image: string;
    };
    links?: {
      discord?: string;
      twitter?: string;
      website?: string;
    };
  }
  
>>>>>>> Stashed changes
