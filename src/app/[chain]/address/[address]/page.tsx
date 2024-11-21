import Detail from '@_components/AddressDetail';
import { HashParams } from 'global';
import { fetchServerAccountDetail } from '@_api/fetchContact';
import { getAddress } from '@_utils/formatter';
export default async function AddressDetails({ params }: { params: HashParams }) {
  const { address } = params;
  const data = await fetchServerAccountDetail({
    chainId: '',
    address: getAddress(address),
    cache: 'no-store',
  });
  return <Detail SSRData={data} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
