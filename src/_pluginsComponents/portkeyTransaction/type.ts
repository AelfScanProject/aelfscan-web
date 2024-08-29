import { IFromInfo, TChainID, TransactionStatus } from '@_api/type';

export interface TTransactionsListRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount: number;
  maxResultCount: number;
  caAddress: string[];
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
