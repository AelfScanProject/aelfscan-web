import { IFromInfo, ISortInfo, TChainID, TransactionStatus } from '@_api/type';

export interface TTransactionsListRequestParams extends RequestInit {
  chainId: TChainID;
  skipCount?: number;
  maxResultCount: number;
  address?: string;
  orderInfos?: ISortInfo[];
  searchAfter?: any[];
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
