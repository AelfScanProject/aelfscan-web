import { ILogsProps } from '@_components/LogsContainer/type';
import { AddressType, SortEnum } from '@_types/common';

export type TChainID = 'AELF' | 'tDVV' | 'tDVW';

export interface IBurntFee {
  usdFee: number;
  elfFee: number;
}

export enum TransactionStatusText {
  Mined = 'Success',
  Conflict = 'Conflict',
  Failed = 'Failed',
}

export enum TransactionStatus {
  NotExisted,
  Pending,
  Failed,
  Mined,
  Conflict,
  PendingValidation,
  NodeValidationFailed,
}

export interface IProducer {
  address: string;
  name: string;
}

export interface IFromInfo {
  name: string;
  address: string;
  addressType: number;
  isManager: boolean;
  isProducer: boolean;
}

export interface ITransactionsRequestParams extends RequestInit {
  chainId: TChainID;
  transactionId: string;
  blockHeight: number;
  skipCount: number;
  maxResultCount: number;
}

export interface ITransactionsResponseItem {
  transactionId: string;
  status: TransactionStatus;
  method: string;
  blockHeight: number;
  timestamp: string;
  from: IFromInfo;
  to: IFromInfo;
  transactionValue: string;
  transactionFee: string;
}

export interface ITransactionsResponse {
  total: number;
  transactions: ITransactionsResponseItem[];
}

export interface ITransactionDetailRequestParams extends RequestInit {
  chainId: TChainID;
  transactionId: string;
  blockHeight: number;
}

export interface IBlocksRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount: number;
  maxResultCount: number;
  isLastPage?: boolean;
}

export interface IBlocksResponseItem {
  blockHeight: number;
  timestamp: string;
  transactionCount: number;
  timeSpan: string;
  reward: string;
  producerName: string;
  producerAddress: string;
  burntFees: string;
}

export interface IBlocksResponse {
  total: number;
  blocks: IBlocksResponseItem[];
}

export interface IBlocksDetailRequestParams extends RequestInit {
  chainId: TChainID;
  blockHeight: number;
}

export interface IBlocksDetailData {
  blockHeight: number;
  timestamp: string;
  blockHash: string;
  status: string;
  txns: number;
  chainId: TChainID;
  nextBlockHeight: number;
  preBlockHeight: number;
  // miner: string;
  reward: {
    usdPrice: number;
    elfPrice: number;
  };
  previousBlockHash: string;
  blockSize: string;
  merkleTreeRootOfTransactions: string;
  merkleTreeRootOfWorldState: string;
  merkleTreeRootOfTransactionState: string;
  extra: string;
  producer: IProducer;
  burntFee: IBurntFee;
  transactions: ITransactionsResponseItem[];
  total: number;
}

export interface IInlines {
  from: IFromInfo;
  to: IFromInfo;
  methodName: string;
  //Transferrd
  symbol: string;
  amount: string;
}

export interface ITokensTransferrdItem {
  from: IFromInfo;
  to: IFromInfo;
  name: string;
  symbol: string;
  amount: number;
  amountString: number;
  nowPrice: string;
  tradePrice: string;
  imageUrl: string;
}

export type TTokensTransferrd = ITokensTransferrdItem[];

export interface INftsTransferredItem extends ITokensTransferrdItem {
  imageBase64?: string;
  isCollection?: boolean;
}

export type TNftsTransferred = INftsTransferredItem[];

export interface ITransactionValues {
  symbol: string;
  amount: number;
  amountString: number;
  nowPrice: string;
  tradePrice: string;
}

export interface ITransactionDetailData {
  transactionId: string;
  status: TransactionStatus;
  confirmed: boolean;
  blockHeight: string;
  blockConfirmations: number;
  timestamp: number;
  method: string;
  from: IFromInfo;
  to: IFromInfo;
  tokenTransferreds: TTokensTransferrd;
  nftsTransferreds: TNftsTransferred;
  transactionValues: ITransactionValues[];
  transactionFees: ITransactionValues[];
  resourcesFee: string;
  burntFees: ITransactionValues[];
  transactionRefBlockNumber: string;
  transactionRefBlockPrefix: string;
  transactionParams: string;
  returnValue: string;
  transactionSignature: string;
  version: string;
  bloom: string;
  error: string;
  transactionSize: string;
  resourceFee: string;
  logEvents: ILogsProps[];
}

export interface ITransactionDetailDataList {
  list: ITransactionDetailData[];
}

export interface ISortInfo {
  orderBy: string;
  sort: string;
}

export interface ITokenHoldersRequestParams extends RequestInit {
  chainId: TChainID;
  symbol: string;
  skipCount?: number;
  maxResultCount: number;
  orderInfos: ISortInfo[];
  searchAfter: any[];
  // search: string;
}

export interface ITokenTransfersRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount?: number;
  maxResultCount: number;
  symbol: string;
  search: string;
  orderInfos: ISortInfo[];
  searchAfter: any[];
}

export interface ITokenDetailRequestParams extends RequestInit {
  chainId: TChainID;
  symbol: string;
}

export interface TTokenListRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount: number;
  maxResultCount: number;
  sort: SortEnum;
  orderBy: string;
}

export interface TTransactionsListRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount?: number;
  maxResultCount: number;
  address?: string;
}

// collection

export interface ICollectionDetailRequestParams extends RequestInit {
  chainId: TChainID;
  collectionSymbol: string;
}

export interface ICollectionTransfersRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount?: number;
  maxResultCount: number;
  collectionSymbol: string;
  search: string;
  orderBy?: string;
  sort?: string;
  orderInfos?: ISortInfo[];
  searchAfter?: any[];
}

export interface ICollectionItemHoldersRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount?: number;
  maxResultCount: number;
  symbol: string;
  orderBy?: string;
  sort?: string;
  orderInfos?: ISortInfo[];
  searchAfter?: any[];
}

// Contract
export interface IContractRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount: number;
  maxResultCount: number;
}
export interface IContractDataItem {
  address: string;
  contractName: string;
  type: string;
  contractVersion: string;
  version: string;
  balance: number;
  txns: number;
  lastUpdateTime: string;
}

export interface IContractResponseData {
  total: number;
  list: IContractDataItem[];
}

// top accounts
export interface IAccountsItem {
  balance: string;
  transactionCount: number;
  percentage: number;
  address: string;
  addressType: AddressType;
}

export interface IAccountResponseData {
  total: number;
  totalBalance: number;
  list: IAccountsItem[];
}

// account detail

export interface IAccountDetailRequestParams extends RequestInit {
  chainId: TChainID;
  address: string;
  maxResultCount?: number;
  addressType: AddressType;
}

export interface IAccountTokensRequestParams extends RequestInit {
  chainId: TChainID;
  address: string;
  skipCount?: number;
  maxResultCount: number;
  sort?: SortEnum;
  orderBy?: string;
  search?: string;
  orderInfos?: ISortInfo[];
  searchAfter?: any[];
}

export interface IContractHistoryRequestParams extends RequestInit {
  chainId: TChainID;
  address: string;
}

export interface IAccountTransfersRequestParams extends RequestInit {
  chainId: TChainID;
  address: string;
  tokenType: number;
  skipCount: number;
  maxResultCount: number;
}

export interface IBlockchainOverviewResponse {
  tokenPriceInUsd: number;
  tokenPriceRate24h: number;
  transactions: number;
  tps: number;
  tpsTime: string;
  reward: string;
  blockHeight: number;
  accounts: number;
  citizenWelfare: string;
}

export interface ISearchParams extends RequestInit {
  chainId: TChainID;
  filterType: number;
  keyword: string;
  searchType: number;
}

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

export interface IPageAdsDetail {
  adsId: string;
  head: string;
  logo: string;
  adsText: string;
  clickText: string;
  clickLink: string;
  label: string;
}
