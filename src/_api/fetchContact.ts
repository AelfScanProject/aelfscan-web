import request from '@_api';
import { IAccountResponseData, IContractRequestParams, IContractResponseData } from './type';
const defaultListData = {
  total: 0,
  list: [],
};
export async function fetchContactList(params: IContractRequestParams): Promise<IContractResponseData> {
  const result = await request.address.getContractList({
    params: params,
  });
  const data = result?.data || defaultListData;
  return data;
}

export async function fetchServerContractList(params: IContractRequestParams): Promise<IContractResponseData> {
  const result = await request.address.getServerContractList({
    params: params,
  });
  const data = result?.data || defaultListData;
  return data;
}

export async function fetchTopAccounts(params: IContractRequestParams): Promise<IAccountResponseData> {
  const result = await request.address.getTopAccounts({
    params: params,
  });
  const data = result?.data || defaultListData;
  return data;
}

export async function fetchServerTopAccounts(params: IContractRequestParams): Promise<IAccountResponseData> {
  const result = await request.address.getServerTopAccounts({
    params: params,
  });
  const data = result?.data || defaultListData;
  return data;
}
