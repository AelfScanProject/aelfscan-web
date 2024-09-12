/*
 * @author: Peterbjx
 * @Date: 2023-08-15 15:58:11
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 16:36:16
 * @Description: transactions
 */

import { fetchServerTransactionList } from '@_api/fetchTransactions';
import TransactionsList from './list';
import { getChainId, getSort } from '@_utils/formatter';
import { TablePageSize } from '@_types/common';
import { PageTypeEnum } from '@_types';
export default async function BlocksPage({ params, searchParams }) {
  const p = searchParams['p'] || 1;
  const ps = searchParams['ps'] || TablePageSize.mini;
  const { chain } = params;
  const defaultChain = searchParams['chain'] || chain;
  const defaultPageType = Number(searchParams['pageType'] || PageTypeEnum.NEXT) as unknown as PageTypeEnum;
  const defaultSearchAfter = searchParams['searchAfter'];
  const sort = getSort(defaultPageType, p);
  const data = await fetchServerTransactionList({
    chainId: getChainId(defaultChain),
    searchAfter: defaultSearchAfter && JSON.parse(defaultSearchAfter),
    maxResultCount: ps,
    orderInfos: [
      { orderBy: 'BlockHeight', sort },
      { orderBy: 'TransactionId', sort },
    ],
    cache: 'no-store',
  });
  return (
    <TransactionsList
      SSRData={data}
      defaultPage={p}
      defaultPageSize={ps}
      defaultPageType={defaultPageType}
      defaultChain={defaultChain}
    />
  );
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
