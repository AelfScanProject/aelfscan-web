import request from '@_api';
import { ISearchResponse, TSearchValidator } from '@_components/Search/type';
import { ISearchParams } from './type';

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
