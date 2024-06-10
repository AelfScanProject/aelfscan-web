/*
 * @author: Peterbjx
 * @Date: 2023-08-15 15:58:11
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 16:36:16
 * @Description: transactions
 */

import { fetchServerTransactionList } from '@_api/fetchTransactions';
import TransactionsList from './list';
import { getPageNumber } from '@_utils/formatter';
import { TablePageSize } from '@_types/common';
export default async function BlocksPage({ params, searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.mini;
  const { chain } = params;
  const data = await fetchServerTransactionList({
    chainId: chain,
    skipCount: getPageNumber(Number(p), ps),
    maxResultCount: ps,
    cache: 'no-store',
  });
  return <TransactionsList SSRData={data} defaultPage={p} defaultPageSize={ps} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
