'use client';

import Table from '@_components/Table';
import getColumns from './columnConfig';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { pageSizeOption } from '@_utils/contant';
import { ITransactionsResponseItem } from '@_api/type';
import { useParams } from 'next/navigation';
import { getAddress, getChainId, getPageNumber } from '@_utils/formatter';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { TablePageSize } from '@_types/common';
import { fetchTransactionList } from '@_api/fetchTransactions';
import { useMultiChain } from '@_hooks/useSelectChain';
const TAB_NAME = 'transactions';
export default function List() {
  const isMobile = useMobileAll();
  const { defaultPage, defaultPageSize, defaultChain } = useSearchAfterParams(TablePageSize.mini, TAB_NAME);
  const [currentPage, setCurrentPage] = useState<number>(Number(defaultPage));
  const [pageSize, setPageSize] = useState<number>(Number(defaultPageSize));
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<ITransactionsResponseItem[]>();
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const { chain, address } = useParams();
  const mountRef = useRef(false);

  const [selectChain, setSelectChain] = useState(defaultChain);
  const updateQueryParams = useUpdateQueryParams();
  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = {
      skipCount: getPageNumber(currentPage, pageSize),
      chainId: getChainId(selectChain as string),
      maxResultCount: pageSize,
      address: address && getAddress(address as string),
    };
    try {
      if (mountRef.current) {
        updateQueryParams({
          p: currentPage,
          ps: pageSize,
          chain: selectChain,
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
  }, [address, currentPage, pageSize, selectChain, updateQueryParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const columns = useMemo<ColumnsType<ITransactionsResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      chainId: chain as string,
      type: 'tx',
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
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };
  const chainChange = (value) => {
    setCurrentPage(1);
    setSelectChain(value);
  };

  const multi = useMultiChain();

  return (
    <div>
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: multiTitleDesc,
          },
        }}
        showMultiChain={multi}
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
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
