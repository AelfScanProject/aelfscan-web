import { getPageNumber, getSort } from '@_utils/formatter';
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
  const data = await fetchServerTopAccounts({
    chainId: params.chain || 'AELF',
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
    />
  );
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
