import request from '@_api';

export interface ICMSChartImageGroup {
  [chartKey: string]: string | undefined;
}

export interface ICMSChartImageConfig {
  [chainKey: string]: ICMSChartImageGroup | undefined;
  multi?: ICMSChartImageGroup;
  multiChain?: ICMSChartImageGroup;
}

export interface IFetchCMSResult {
  headerMenuList: any[];
  footerMenuList: any[];
  chainList: any[];
  networkList: any[];
  config: Record<string, any>;
  chartImg?: ICMSChartImageConfig;
}

export async function fetchCMS(): Promise<IFetchCMSResult> {
  const result = await request.cms.getGlobalConfig({ params: { cache: 'no-store' } });
  const { data } = result as { data: IFetchCMSResult };
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
