import { notFound } from 'next/navigation';
import Detail from './_components/detail';
import { fetchTransactionDetails } from '@_api/fetchTransactions';
import { HashParams, TSearchParamsForTransactionDetail } from 'global';

export default async function TransactionDetails({
  params,
}: {
  params: HashParams;
  searchParams: TSearchParamsForTransactionDetail;
}) {
  if (!params.hash || !params.chain) {
    return notFound();
  }

  const transactionDetailDataList = await fetchTransactionDetails({
    chainId: params.chain,
    transactionId: params.hash,
    // blockHeight: searchParams.blockHeight,
    cache: 'no-store',
  });

  const transactionDetailData = transactionDetailDataList?.list?.[0] || {};
  return <Detail SSRData={transactionDetailData} />;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
