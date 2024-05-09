import { IFromInfo, TransactionStatus } from '@_api/type';
import { IToken } from '@_types/common';
import { ISearchProps } from 'aelf-design';

// Collection detail api return type

export interface CollectionDetailData {
  nftCollection: IToken;
  items: number;
  holders: number;
  transferCount: number;
  floorPriceOfUsd: number;
  floorPrice: number;
  tokenContractAddress: string;
}

export interface CollectionDetailApiResponse {
  code: string;
  message: string;
  data: CollectionDetailData;
}
// Transfer
export interface CollectionTransferItemProperty {
  symbol: string;
  name: string;
  imageUrl: string;
}
export interface CollectionTransfer {
  transactionId: string;
  status: TransactionStatus;
  method: string;
  blockHeight: number;
  blockTime: string;
  from: IFromInfo;
  to: IFromInfo;
  value: number;
  item: CollectionTransferItemProperty;
}
export interface CollectionTransfersData {
  total: number;
  list: CollectionTransfer[];
}
export interface CollectionTransfersApiResponse {
  code: string;
  message: string;
  data: CollectionTransfersData;
}

// Holder
export interface Address {
  name: string;
  address: string;
  addressType: number;
  isManager: boolean;
  isProducer: boolean;
}

export interface HolderItem {
  address: Address;
  quantity: string;
  percentage: string;
  value: number;
}

export interface CollectionHoldersData {
  total: number;
  list: HolderItem[];
}

export interface CollectionHoldersApiResponse {
  code: string;
  message: string;
  data: CollectionHoldersData;
}

export interface InventoryItem {
  item: IToken;
  lastSalePriceInUsd: number;
  lastSaleAmount: number;
  lastTransactionId: string;
  lastSaleAmountSymbol: string;
  blockHeight: number;
}
export interface CollectionInventoryData {
  total: number;
  isAddress: boolean;
  list: InventoryItem[];
}

export interface CollectionInventoryApiResponse {
  code: string;
  message: string;
  data: CollectionInventoryData;
}

export const URL_QUERY_KEY = 'a';

export const PAGE_SIZE = 25;

export interface ITableSearch extends ISearchProps {
  value: string;
  onSearchChange: (value: string) => void;
  onClear?: () => void;
  // onPressEnter?: (value: string) => void;
}
