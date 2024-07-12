'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { pageSizeOption } from '@_utils/contant';
import { ITransactionsResponseItem, TChainID } from '@_api/type';
import { useParams } from 'next/navigation';
import { fetchTransactionList } from '@_api/fetchTransactions';
import { getAddress, getPageNumber } from '@_utils/formatter';
import { useEffectOnce } from 'react-use';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
const TAB_NAME = 'transactions';
export default function List({ SSRData, showHeader = true, defaultPage, defaultPageSize }) {
  console.log(SSRData, 'transactionSSRData');
  const isMobile = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<ITransactionsResponseItem[]>(SSRData.transactions);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const { chain, address } = useParams();
  const mountRef = useRef(false);
  const updateQueryParams = useUpdateQueryParams();
  const fetchData = useCallback(
    async (page, pageSize) => {
      setLoading(true);
      const params = {
        chainId: chain as TChainID,
        skipCount: getPageNumber(page, pageSize),
        maxResultCount: pageSize,
        address: address && getAddress(address as string),
      };
      try {
        if (mountRef.current) {
          updateQueryParams({
            p: page,
            ps: pageSize,
            tab: TAB_NAME,
          });
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
    [address, chain],
  );

  useEffectOnce(() => {
    if (showHeader) return;
    fetchData(currentPage, pageSize);
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
    setCurrentPage(page);
    fetchData(page, pageSize);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
    fetchData(page, size);
  };

  return (
    <div>
      {showHeader && <HeadTitle content="Transactions"></HeadTitle>}
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: multiTitleDesc,
          },
        }}
        loading={loading}
        dataSource={data}
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
