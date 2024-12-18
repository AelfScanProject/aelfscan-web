import { IFromInfo, TChainID } from '@_api/type';
import { IAddress, IToken } from '@_types/common';

export interface ITransferItem {
  transactionId: string;
  status: string;
  method: string;
  blockHeight: string;
  blockTime: string;
  from: IFromInfo;
  chainIds: TChainID[];
  to: IFromInfo;
  quantity: number;
}

export interface ITransferTableData {
  isAddress: boolean;
  balance: number;
  value: number;
  total: number;
  list: ITransferItem[];
}

export interface IHolderItem {
  address: IFromInfo;
  quantity: string;
  chainIds: TChainID[];
  percentage: string;
  value: string;
}

export interface IHolderTableData {
  total: number;
  list: IHolderItem[];
}

export interface ITokenSearchProps {
  searchType: SearchType;
  onSearchInputChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  search?: string;
  searchText?: string;
  token?: IToken;
}
export type TTransferSearchData = Pick<ITransferTableData, 'balance' | 'value'>;
export interface ITokenDetail {
  token: IToken;
  totalSupply: string;
  circulatingSupply: string;
  mergeCirculatingSupply: number;
  mergeTransferCount: number;
  holders: number;
  price: number;
  chainIds: TChainID[];
  holderPercentChange24h: number;
  transferCount: number;
  pricePercentChange24h: number;
  tokenContractAddress: string;
  contractAddress: IAddress;
  decimals: number;
  // multi
  mainChainCirculatingSupply: number;
  sideChainCirculatingSupply: number;
  mainChainHolders: number;
  sideChainHolders: number;
  mergeHolders: number;
  mainChainTransferCount: number;
  sideChainTransferCount: number;
}

export enum TokenTypeEnum {
  token,
  nft,
}

export interface ITokenListItem {
  holders: number;
  beforeCount: number;
  totalSupply: number;
  circulatingSupply: number;
  holderPercentChange24H: number;
  token: IToken;
  chainIds: TChainID[];
  type: TokenTypeEnum;
}

export interface ITokenList {
  total: number;
  list: ITokenListItem[];
}

export enum SearchType {
  txHash = 'txHash',
  address = 'address',
  other = 'other',
}
