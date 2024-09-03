import request from '@_api';
import {
  ITransactionDetailRequestParams,
  ITransactionDetailDataList,
  TTransactionsListRequestParams,
  ITransactionsResponse,
} from './type';

const defaultTransactionList = {
  total: 0,
  transactions: [],
};

export async function fetchTransactionDetails(
  params: ITransactionDetailRequestParams,
): Promise<ITransactionDetailDataList> {
  const result = await request.tx.getTransactionDetail({
    params: params,
  });
  const data = result?.data || {};
  return data;
}

export async function fetchTransactionList(params: TTransactionsListRequestParams): Promise<ITransactionsResponse> {
  const result = await request.tx.getTransactionList({
    params: params,
  });
  const data = result?.data || defaultTransactionList;
  return data;
}

export async function fetchLatestTransactionList(
  params: TTransactionsListRequestParams,
): Promise<ITransactionsResponse> {
  const result = await request.tx.getLatestTransactionList({
    params: params,
  });
  const data = result?.data || defaultTransactionList;
  return data;
}

export async function fetchServerTransactionList(
  params: TTransactionsListRequestParams,
): Promise<ITransactionsResponse> {
  const result = await request.tx.getServerTransactionList({
    params: params,
  });
  const data = result?.data || defaultTransactionList;
  return data;
}

export async function fetchAATransactionList(data: TTransactionsListRequestParams): Promise<ITransactionsResponse> {
  const res = await request.portkey.getTransactionList({
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = res?.data;
  return result;
}
