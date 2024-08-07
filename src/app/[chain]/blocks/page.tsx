import { fetchServerBlocks } from '@_api/fetchBlocks';
import BlockList from './blockList';
import { getPageNumber } from '@_utils/formatter';
import { TablePageSize } from '@_types/common';

export default async function BlocksPage({ params, searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.mini;
  const data = await fetchServerBlocks({
    chainId: params.chain,
    maxResultCount: ps,
    skipCount: getPageNumber(Number(p), ps),
    cache: 'no-store',
  });
  return <BlockList SSRData={data} defaultPage={Number(p)} defaultPageSize={Number(ps)} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
