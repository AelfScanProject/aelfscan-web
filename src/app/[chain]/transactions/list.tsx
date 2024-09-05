'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { pageSizeOption } from '@_utils/contant';
import { ITransactionsResponseItem, TChainID } from '@_api/type';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchTransactionList } from '@_api/fetchTransactions';
import { getAddress, getAddressSearchAfter, getSort } from '@_utils/formatter';
import { useEffectOnce } from 'react-use';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { PageTypeEnum } from '@_types';
const TAB_NAME = 'transactions';
export default function List({ SSRData, showHeader = true, defaultPage, defaultPageSize, defaultPageType }) {
  const isMobile = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(Number(defaultPage));
  const [pageSize, setPageSize] = useState<number>(Number(defaultPageSize));
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<ITransactionsResponseItem[]>(SSRData.transactions);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);
  const { chain, address } = useParams();
  const mountRef = useRef(false);
  const searchParams = useSearchParams();
  const defaultSearchAfter = searchParams.get('searchAfter');
  const activeTab = (searchParams.get('tab') as string) === TAB_NAME;
  const updateQueryParams = useUpdateQueryParams();
  const fetchData = useCallback(
    async (page, pageSize, data, pageType) => {
      const sort = getSort(pageType, page);
      const searchAfter = getAddressSearchAfter(page, data, pageType);
      setLoading(true);
      const params = {
        chainId: chain as TChainID,
        maxResultCount: pageSize,
        orderInfos: [
          { orderBy: 'BlockHeight', sort },
          { orderBy: 'TransactionId', sort },
        ],
        address: address && getAddress(address as string),
        searchAfter:
          !mountRef.current && defaultSearchAfter && activeTab ? JSON.parse(defaultSearchAfter) : searchAfter,
      };
      try {
        if (mountRef.current) {
          if (showHeader) {
            updateQueryParams({
              p: page,
              ps: pageSize,
              pageType,
              searchAfter: JSON.stringify(searchAfter),
            });
          } else {
            updateQueryParams({
              p: page,
              ps: pageSize,
              tab: TAB_NAME,
              pageType,
              searchAfter: JSON.stringify(searchAfter),
            });
          }
        }
      } catch (error) {
        console.log(error, 'error.rr');
      }
      try {
        const res = await fetchTransactionList(params);
        setTotal(res.total);
        setData(res.transactions);
      } finally {
        setLoading(false);
        mountRef.current = true;
      }
    },
    [activeTab, address, chain, defaultSearchAfter, showHeader, updateQueryParams],
  );

  useEffectOnce(() => {
    if (showHeader) return;
    fetchData(currentPage, pageSize, data, pageType);
  });
  const columns = useMemo<ColumnsType<ITransactionsResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      type: 'tx',
      chainId: chain as string,
    });
  }, [chain, timeFormat]);

  const multiTitle = useMemo(() => {
    return `More than > ${total} transactions found`;
  }, [total]);

  const multiTitleDesc = useMemo(() => {
    return `Showing the last 500k records`;
  }, []);

  const pageChange = (page: number) => {
    let pageType;
    if (page > currentPage) {
      pageType = PageTypeEnum.NEXT;
      setPageType(PageTypeEnum.NEXT);
    } else {
      pageType = PageTypeEnum.PREV;
      setPageType(PageTypeEnum.PREV);
    }
    setCurrentPage(page);
    fetchData(page, pageSize, data, pageType);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
    setPageType(PageTypeEnum.NEXT);
    fetchData(page, size, data, PageTypeEnum.NEXT);
  };

  return (
    <div>
      {showHeader && <HeadTitle content="Transactions" adPage="transactions"></HeadTitle>}
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: multiTitleDesc,
          },
        }}
        loading={loading}
        dataSource={data}
        showLast={false}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionId"
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
