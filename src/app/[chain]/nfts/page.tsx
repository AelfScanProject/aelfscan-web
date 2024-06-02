/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:16:23
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:12:23
 * @Description: NFTs
 */

import { fetchServerNFTSList } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { SortEnum, TablePageSize } from '@_types/common';
import List from './list';
import { getPageNumber } from '@_utils/formatter';
export default async function Nfts({ params, searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.small;
  const data = await fetchServerNFTSList({
    skipCount: getPageNumber(Number(p), ps),
    maxResultCount: ps,
    chainId: params.chain as TChainID,
    orderBy: 'HolderCount',
    sort: SortEnum.desc,
    cache: 'no-store',
  });
  return <List SSRData={data} defaultPage={p} defaultPageSize={ps} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
