import TokensList from './tokensList';
import { fetchServerTokenList } from '@_api/fetchTokens';
import { SortEnum, TablePageSize } from '@_types/common';
import { MULTI_CHAIN } from '@_utils/contant';
import { getChainId, getPageNumber } from '@_utils/formatter';

export default async function TokensPage({ searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.small;
  const defaultChain = searchParams['chain'] || MULTI_CHAIN;
  const data = await fetchServerTokenList({
    skipCount: getPageNumber(Number(p), ps),
    maxResultCount: ps,
    chainId: getChainId(defaultChain),
    orderBy: 'HolderCount',
    sort: SortEnum.desc,
    cache: 'no-store',
  });
  return <TokensList SSRData={data} defaultPage={p} defaultPageSize={ps} defaultChain={defaultChain} />;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
