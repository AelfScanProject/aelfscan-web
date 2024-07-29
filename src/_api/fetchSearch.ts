import request from '@_api';
import { ISearchResponse, TSearchValidator } from '@_components/Search/type';
import { IPageAdsDetail, ISearchParams } from './type';
import { getOrCreateUserId } from '@_utils/formatter';

export async function fetchSearchFilters(): Promise<{
  filterTypes: TSearchValidator;
}> {
  const result = await request.common.getSearchFilter();
  const data = result?.data || [];
  return data;
}
export async function fetchSearchData(params: ISearchParams): Promise<ISearchResponse> {
  const result = await request.block.query({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchAdsDetail(params: { label: string }): Promise<IPageAdsDetail> {
  const uid = getOrCreateUserId();
  const result = await request.common.getAdsDetail({
    params: params,
    headers: {
      SearchKey: uid,
    },
  });
  const data = result?.data;
  return data;
}
