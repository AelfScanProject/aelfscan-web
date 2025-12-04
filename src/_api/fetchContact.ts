import request from '@_api';
import {
  IAccountDetailRequestParams,
  IAccountResponseData,
  IAccountTokensRequestParams,
  IContractHistoryRequestParams,
  IContractRequestParams,
  IContractResponseData,
  IUploadContractCode,
} from './type';
import { IAddressResponse, INfts, ITokenTransfers, ITokens } from '@_types/commonDetail';
import { IHistory } from '@_components/AddressDetail/components/History/type';
import { IContractSourceCode } from '@_components/AddressDetail/components/Contract/sourceCode';
import { IEvents } from '@_components/AddressDetail/components/Events/type';
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

export async function fetchAccountsDetailTokens(params: IAccountTokensRequestParams): Promise<ITokens> {
  const result = await request.address.getAccountsDetailTokens({
    params: params,
  });
  const data = result?.data || defaultListData;
  return data;
}

export async function fetchAccountsDetailNFTAssets(params: IAccountTokensRequestParams): Promise<INfts> {
  const result = await request.address.getAccountsDetailNFTAssets({
    params: params,
  });
  const data = result?.data || defaultListData;
  return data;
}
export async function fetchAccountTransfers(params: IAccountTokensRequestParams): Promise<ITokenTransfers> {
  const result = await request.address.getAccountTransfers({
    params: params,
  });
  const data = result?.data || defaultListData;
  return data;
}

export async function fetchServerAccountDetail(params: IAccountDetailRequestParams): Promise<IAddressResponse> {
  const result = await request.address.getServerAccountDetail({
    params: params,
  });
  const data = result?.data || {};
  return data;
}

export async function fetchAccountDetail(params: IAccountDetailRequestParams): Promise<IAddressResponse> {
  const result = await request.address.getAccountDetail({
    params: params,
  });
  const data = result?.data || {};
  return data;
}

export async function fetchContractHistory(params: IContractHistoryRequestParams): Promise<{ record: IHistory[] }> {
  const result = await request.address.getContractHistory({
    params: params,
  });
  const data = result?.data || {};
  return data;
}
export async function fetchContractCode(params: IContractHistoryRequestParams): Promise<IContractSourceCode> {
  const result = await request.address.getContractCode({
    params: params,
  });
  const data = result?.data || {};
  return data;
}

export async function uploadContractCode(
  params: IUploadContractCode,
  body,
): Promise<{
  fileKey: string;
  message: string;
  result: number;
  errCode: number;
}> {
  const result = await request.address.uploadContractCode({
    params: params,
    body,
    method: 'POST',
  });
  const data = result?.data || {};
  return data;
}

export async function fetchContractEvents(params: IAccountTokensRequestParams): Promise<{
  total: number;
  list: IEvents[];
}> {
  const result = await request.address.getContractEvents({
    params: params,
  });
  const data = result?.data;
  return data;
}
