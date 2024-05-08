import request from '@_api';
import {
  ICollectionDetailRequestParams,
  ICollectionItemHoldersRequestParams,
  ICollectionTransfersRequestParams,
  ITokenDetailRequestParams,
  TTokenListRequestParams,
} from './type';
import { INFTsTableData } from '@app/[chain]/nfts/type';
import {
  CollectionDetailData,
  CollectionHoldersData,
  CollectionInventoryData,
  CollectionTransfersData,
} from '@app/[chain]/nft/[collectionSymbol]/_Detail/type';
import { ItemSymbolDetailOverview } from '@app/[chain]/nft/[collectionSymbol]/[itemSymbol]/type';

const defaultTokenListData = {
  total: 0,
  list: [],
};
export async function fetchNFTSList(params: TTokenListRequestParams): Promise<INFTsTableData> {
  const result = await request.nfts.getNFTSList({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}

export async function fetchServerNFTSList(params: TTokenListRequestParams): Promise<INFTsTableData> {
  const result = await request.nfts.getServerNFTSList({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}
export async function fetchServerCollectionDetail(
  params: ICollectionDetailRequestParams,
): Promise<CollectionDetailData> {
  const result = await request.nfts.getServerCollectionDetail({
    params: params,
  });
  const data = result?.data || {};
  return data;
}

export async function fetchServerCollectionItemDetail(
  params: ITokenDetailRequestParams,
): Promise<ItemSymbolDetailOverview> {
  const result = await request.nfts.getServerCollectionItemDetail({
    params: params,
  });
  const data = result?.data || {};
  return data;
}

export async function fetchNFTTransfers(params: ICollectionTransfersRequestParams): Promise<CollectionTransfersData> {
  const result = await request.nfts.getNFTTransfers({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}

export async function fetchNFTHolders(params: ICollectionTransfersRequestParams): Promise<CollectionHoldersData> {
  const result = await request.nfts.getNFTHolders({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}
export async function fetchNFTItemHolders(params: ICollectionItemHoldersRequestParams): Promise<CollectionHoldersData> {
  const result = await request.nfts.getNFTItemHolders({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}

export async function fetchNFTInventory(params: ICollectionTransfersRequestParams): Promise<CollectionInventoryData> {
  const result = await request.nfts.getNFTInventory({
    params: params,
  });
  const data = result?.data || defaultTokenListData;
  return data;
}
