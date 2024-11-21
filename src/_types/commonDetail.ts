import { IFromInfo, TChainID, TransactionStatus } from '@_api/type';
import { IToken } from './common';
import { TokenTypeEnum } from '@app/[chain]/token/[tokenSymbol]/type';

export interface ITransactionFeeItem {
  symbol: string;
  amount: number;
  amountOfUsd: number;
}

export type TokenTransfersItemType = {
  chainId: string;
  transactionId: string;
  method: string;
  blockHeight: number;
  blockTime: number;
  from: IFromInfo;
  to: IFromInfo;
  quantity: number;
  status: TransactionStatus;
  transactionFeeList: ITransactionFeeItem[];
  symbol: string;
  chainIds: TChainID[];
  symbolName: string;
  symbolImageUrl: string;
};

export interface ITokenTransfers {
  total: number;
  list: TokenTransfersItemType[];
}

export type TokensListItemType = {
  token: IToken;
  type: TokenTypeEnum;
  quantity: number;
  valueOfUsd: number;
  chainIds: TChainID[];
  priceOfUsd: number;
  priceOfUsdPercentChange24h: number;
  priceOfElf: number;
  valueOfElf: number;
};

export interface ITokens {
  assetInUsd: number;
  assetInElf: number;
  total: number;
  list: TokensListItemType[];
}

export type NftsItemType = {
  nftCollection: IToken;
  token: IToken;
  chainIds: TChainID[];
  transferCount: number;
  firstNftTime: string;
  quantity: number;
};

export interface INfts {
  total: number;
  list: NftsItemType[];
}

export type TransactionsItemType = {
  transactionHash: string;
  status: string;
  method: string;
  blockHeight: string;
  timestamp: string;
  from: string; //name+address
  to: string; //name+address
  txnValue: number;
  txnFee: number;
};

export interface ITransactions {
  total: number;
  list: TransactionsItemType[];
}

export type NftTransfersItemType = {
  transactionHash: string;
  status: string;
  method: string;
  timestamp: string;
  from: string; // name+address
  to: string; // name+address
  transferStatus: string; //in/out
  amount: string;
  item: string;
};

export interface INftTransfers {
  total: number;
  list: NftTransfersItemType[];
}

export interface IAddressTokensDetail {
  totalValueOfUsd: number;
  totalValueOfUsdChangeRate: number;
  totalValueOfElf: number;
}

interface IPortfolioItem {
  count: number;
  usdValue: number;
  usdValuePercentage: number;
}

export interface IPortfolio {
  mainNftCount: number;
  mainTokenCount: number;
  mainTokenValue: number;
  sideNftCount: number;
  sideTokenCount: number;
  sideTokenValue: number;
  totalNftCount: number;
  totalTokenCount: number;
  totalTokenValue: number;
  totalTokenValueOfElf: number;
}

export interface IAddressResponse extends IAddressTokensDetail {
  symbol: string;
  contractName: string; // contract address
  addressTypeList: ['PortKey'];
  author: string; // contract add
  tokenHoldings: number;
  addressType: number;
  chainIds: TChainID[];
  contractTransactionHash: string; // contract add
  lastTransactionSend: {
    transactionId: string;
    blockHeight: number;
    blockTime: string;
  }; //CA/EOA address add
  firstTransactionSend: {
    transactionId: string;
    blockHeight: number;
    blockTime: string;
  }; //CA/EOA address add
  elfBalanceOfUsd: number;
  elfBalance: number;
  elfPriceInUsd: number;
  portfolio: IPortfolio;
}

export enum TitleEnum {
  Address = 'Address',
  Contract = 'Contract',
}
