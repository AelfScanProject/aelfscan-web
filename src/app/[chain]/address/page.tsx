import AccountsList from './list';
import { fetchServerTopAccounts } from '@_api/fetchContact';

export default async function AccountsPage({ params }) {
  const data = await fetchServerTopAccounts({
    chainId: params.chain || 'AELF',
    maxResultCount: 25,
    skipCount: 0,
    cache: 'no-store',
  });
  return <AccountsList SSRData={data} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
