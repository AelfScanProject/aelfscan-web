import { extendRequest } from '@_api';
import { ITransactionsResponse, TTransactionsListRequestParams } from './type';

const APIS = {
  portkey: {
    getTransactionList: '/api/app/portkey/transactions',
  },
};

const request = extendRequest(APIS);
export async function fetchTransactionList(data: TTransactionsListRequestParams): Promise<ITransactionsResponse> {
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
