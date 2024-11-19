import request from '@_api';
export async function fetchCMS() {
  const result = await request.cms.getGlobalConfig({ params: { cache: 'no-store' } });
  const { data } = result;
  return data;
}

export async function fetchLatestTwitter() {
  const result = await request.common.getLatestTwitter({ params: { cache: 'no-store', maxResultCount: 5 } });
  const { data } = result;
  return data;
}

export async function fetchAdsDetailList() {
  const result = await request.common.getAdsDetailList({ params: { cache: 'no-store', size: 5 } });
  const { data } = result;
  return data;
}
