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


export interface TokenInfoType {
    mintAddress: string;
    holderCount: number;
    holders: string[];
    topHolders: TopHolder[];
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
  
