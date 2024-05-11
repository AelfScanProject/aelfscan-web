/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:42:09
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 15:05:11
 * @Description: Contracts
 */
import { fetchServerContractList } from '@_api/fetchContact';
import ContractsList from './contractsList';
export default async function BlocksPage({ params }) {
  const data = await fetchServerContractList({
    chainId: params.chain || 'AELF',
    maxResultCount: 25,
    skipCount: 0,
    cache: 'no-store',
  });
  return <ContractsList SSRData={data} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
