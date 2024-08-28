import request from '@_api';
import { ITransactionsResponse, TTransactionsListRequestParams } from './type';

export async function fetchTransactionList(params: TTransactionsListRequestParams): Promise<ITransactionsResponse> {
  const result = await request.tx.getTransactionList({
    params: params,
  });
  const data = result?.data;
  return data;
}
