import { notFound } from 'next/navigation';
import Detail from './_components/detail';
import { fetchTransactionDetails } from '@_api/fetchTransactions';
import { HashParams, TSearchParamsForTransactionDetail } from 'global';

export default async function TransactionDetails({
  params,
  searchParams,
}: {
  params: HashParams;
  searchParams: TSearchParamsForTransactionDetail;
}) {
  console.log('params', params);
  console.log('searchParams', searchParams);

  if (!params.hash || !params.chain) {
    return notFound();
  }
  if (!searchParams.blockHeight) {
    return notFound();
  }

  const paramsForTransactionDetails = {
    chainId: params.chain,
    transactionId: params.hash,
    blockHeight: searchParams.blockHeight,
  };

  const transactionDetailDataList = await fetchTransactionDetails(paramsForTransactionDetails);
  const transactionDetailData = transactionDetailDataList?.list?.[0] || {};
  console.log(JSON.stringify(transactionDetailData));
  return <Detail SSRData={transactionDetailData} />;
}
