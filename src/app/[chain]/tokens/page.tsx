import TokensList from './tokensList';
import { fetchServerTokenList } from '@_api/fetchTokens';
import { TChainID } from '@_api/type';
import { SortEnum, TablePageSize } from '@_types/common';
import { getPageNumber } from '@_utils/formatter';

export default async function TokensPage({ params, searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.small;
  const data = await fetchServerTokenList({
    skipCount: getPageNumber(Number(p), ps),
    maxResultCount: ps,
    chainId: params.chain as TChainID,
    orderBy: 'HolderCount',
    sort: SortEnum.desc,
    cache: 'no-store',
  });
  return <TokensList SSRData={data} defaultPage={p} defaultPageSize={ps} />;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
