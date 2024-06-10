/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:42:09
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 15:05:11
 * @Description: Contracts
 */
import { fetchServerContractList } from '@_api/fetchContact';
import ContractsList from './contractsList';
import { getPageNumber } from '@_utils/formatter';
import { TablePageSize } from '@_types/common';
export default async function BlocksPage({ params, searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.mini;
  const data = await fetchServerContractList({
    chainId: params.chain || 'AELF',
    maxResultCount: ps,
    skipCount: getPageNumber(Number(p), ps),
    cache: 'no-store',
  });
  return <ContractsList SSRData={data} defaultPage={p} defaultPageSize={ps} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
