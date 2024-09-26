import { getChainId, getSort } from '@_utils/formatter';
import AccountsList from './list';
import { fetchServerTopAccounts } from '@_api/fetchContact';
import { TablePageSize } from '@_types/common';
import { PageTypeEnum } from '@_types';

export default async function AccountsPage({ params, searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.mini;
  const defaultPageType = Number(searchParams['pageType'] || PageTypeEnum.NEXT) as unknown as PageTypeEnum;
  const defaultSearchAfter = searchParams['searchAfter'];
  const sort = getSort(defaultPageType, p);
  const defaultChain = searchParams['chain'] || params.chain;
  const data = await fetchServerTopAccounts({
    chainId: getChainId(defaultChain),
    maxResultCount: ps,
    searchAfter: defaultSearchAfter && JSON.parse(defaultSearchAfter),
    orderInfos: [
      { orderBy: 'FormatAmount', sort },
      { orderBy: 'Address', sort },
    ],
    cache: 'no-store',
  });
  return (
    <AccountsList
      SSRData={data}
      defaultPage={Number(p)}
      defaultPageSize={Number(ps)}
      defaultPageType={defaultPageType}
      defaultChain={defaultChain}
    />
  );
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
