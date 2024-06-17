import request from '@_api';
export async function fetchCMS() {
  const result = await request.cms.getGlobalConfig({ params: { cache: 'no-store' } });
  const { data } = result;
  return data;
}
