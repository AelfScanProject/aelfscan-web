// export interface IActivityTableData {
//   transactionHash: string;
//   status: string;
//   action: string;
//   timestamp: string;
//   price: string;
//   amount: string;
//   from: string;
//   to: string;

import { IToken } from '@_types/common';

// }
interface Collection {
  name: string;
  imageUrl: string;
  symbol: string;
}

interface MarketPlace {
  marketName: string;
  marketLogo: string;
  marketUrl: string;
}

export interface Address {
  name: string;
  address: string;
  addressType: number;
  isManager: boolean;
  isProducer: boolean;
}

export interface PropertyItem {
  title: string;
  value: string;
}

export interface IActivityTableData {
  transactionId: string;
  action: string;
  blockTime: number;
  price: number;
  priceOfUsd: number;
  priceSymbol: string;
  quantity: number;
  from: Address;
  to: Address;
  blockHeight: number;
}

export interface HolderItem {
  rank: number;
  address: Address;
  quantity: number;
  percentage: number;
}
export interface ItemSymbolDetailActivity {
  total: number;
  list: IActivityTableData[];
}
export interface ItemSymbolDetailHolders {
  total: number;
  list: HolderItem[];
}
export interface ItemSymbolDetailOverview {
  nftCollection: IToken;
  item: IToken;
  holders: number;
  owner: string[];
  issuer: string[];
  tokenSymbol: string;
  quantity: number;
  marketPlaces: MarketPlace;
  isSeed: boolean;
  symbolToCreate: string;
  expireTime: number;
  properties: PropertyItem[];
  description: string;
}
