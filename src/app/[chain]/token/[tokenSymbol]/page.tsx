/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:13:52
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:13:09
 * @Description: TokenSysbol
 */
import { ChainId } from 'global';
import Detail from './detail';
import { fetchTokenDetail } from '@_api/fetchTokens';
import { getChainId } from '@_utils/formatter';

export default async function TokenSymbol({
  params: { tokenSymbol },
}: {
  params: ChainId & {
    tokenSymbol: string;
  };
}) {
  const tokenDetail = await fetchTokenDetail({ chainId: getChainId(''), symbol: tokenSymbol, cache: 'no-store' });
  return (
    <div>
      <Detail tokenDetail={tokenDetail} />
    </div>
  );
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
