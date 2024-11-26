import { fetchServerBlocks } from '@_api/fetchBlocks';
import BlockList from './blockList';
import { getPageNumber } from '@_utils/formatter';
import { TablePageSize } from '@_types/common';
import { MULTI_CHAIN } from '@_utils/contant';

export default async function BlocksPage({ searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.mini;
  const defaultChain = searchParams['chain'] || MULTI_CHAIN;
  const data = await fetchServerBlocks({
    chainId: '',
    maxResultCount: ps,
    skipCount: getPageNumber(Number(p), ps),
    cache: 'no-store',
  });
  return <BlockList SSRData={data} defaultPage={Number(p)} defaultPageSize={Number(ps)} defaultChain={defaultChain} />;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
