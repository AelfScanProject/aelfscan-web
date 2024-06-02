import { getPageNumber } from '@_utils/formatter';
import AccountsList from './list';
import { fetchServerTopAccounts } from '@_api/fetchContact';
import { TablePageSize } from '@_types/common';

export default async function AccountsPage({ params, searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.mini;
  const data = await fetchServerTopAccounts({
    chainId: params.chain || 'AELF',
    maxResultCount: ps,
    skipCount: getPageNumber(Number(p), ps),
    cache: 'no-store',
  });
  return <AccountsList SSRData={data} defaultPage={p} defaultPageSize={ps} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
