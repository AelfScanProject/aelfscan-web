import { IFromInfo, TChainID, TransactionStatus } from '@_api/type';
import { IAddress, IToken } from '@_types/common';
import { ISearchProps } from 'aelf-design';

// Collection detail api return type

export interface CollectionDetailData {
  nftCollection: IToken;
  items: number;
  holders: number;
  transferCount: number;
  floorPriceOfUsd: number;
  mergeHolders: number;
  floorPrice: number;
  tokenContractAddress: string;
  contractAddress: IAddress;
  mainChainFloorPrice: number;
  sideChainFloorPrice: number;
  mainChainFloorPriceOfUsd: number;
  sideChainFloorPriceOfUsd: number;
  mainChainItems: number;
  mainChainHolders: number;
  mainChainTransferCount: number;
  sideChainItems: number;
  sideChainHolders: number;
  sideChainTransferCount: number;
  chainIds: TChainID[];
  mergeItems: string;
  mergeTransferCount: number;
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
  chainIds: TChainID[];
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
  chainIds: TChainID[];
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
  chainIds: TChainID[];
  lastTransactionId: string;
  lastSaleAmountSymbol: string;
  blockHeight: number;
  lastSalePrice: number;
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
