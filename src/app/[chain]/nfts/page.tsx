/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:16:23
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:12:23
 * @Description: NFTs
 */

import { fetchServerNFTSList } from '@_api/fetchNFTS';
import { SortEnum, TablePageSize } from '@_types/common';
import List from './list';
import { getChainId, getPageNumber } from '@_utils/formatter';
import { MULTI_CHAIN } from '@_utils/contant';
export default async function Nfts({ searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.small;
  const defaultChain = searchParams['chain'] || MULTI_CHAIN;
  const data = await fetchServerNFTSList({
    skipCount: getPageNumber(Number(p), ps),
    maxResultCount: ps,
    chainId: getChainId(defaultChain),
    orderBy: 'HolderCount',
    sort: SortEnum.desc,
    cache: 'no-store',
  });
  return <List SSRData={data} defaultPage={Number(p)} defaultPageSize={Number(ps)} defaultChain={defaultChain} />;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
