import request from '@_api';
import { ISearchResponse, TSearchValidator } from '@_components/Search/type';
import { IPageAdsDetail, IPageBannerAdsDetail, ISearchParams } from './type';
import { getOrCreateUserId } from '@_utils/formatter';
import { AdTracker } from '@_utils/ad';
import dayjs from 'dayjs';

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
  AdTracker.trackEvent('ads-exposure', {
    date: dayjs(new Date()).format('YYYY-MM-DD'),
    pageName: params.label,
    adsId: data?.adsId,
    adsName: data?.adsText,
  });
  return data;
}
export async function fetchBannerAdsDetail(params: { label: string }): Promise<IPageBannerAdsDetail> {
  const uid = getOrCreateUserId();
  const result = await request.common.getBannerAdsDetail({
    params: params,
    headers: {
      SearchKey: uid,
    },
  });
  const data = result?.data;
  AdTracker.trackEvent('ads-exposure', {
    date: dayjs(new Date()).format('YYYY-MM-DD'),
    pageName: params.label,
    adsId: data?.adsBannerId,
    adsName: data?.text,
  });
  return data;
}
