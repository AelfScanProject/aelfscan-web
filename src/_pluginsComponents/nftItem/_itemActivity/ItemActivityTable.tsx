'use client';
import React from 'react';
import Table from '@_components/Table';
import getColumns from './column';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { IActivityTableData, ItemSymbolDetailOverview } from '../type';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchNFTItemActivity } from '@_api/fetchNFTS';
import { useSearchParams } from 'next/navigation';
import { getChainId, getPageNumber, thousandsNumber } from '@_utils/formatter';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
const TAB_NAME = '';
export default function ItemActivityTable({ detailData }: { detailData: ItemSymbolDetailOverview }) {
  const isMobile = useMobileAll();
  const { defaultPage, defaultPageSize, defaultChain } = useSearchAfterParams(25, TAB_NAME);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<IActivityTableData[]>([]);
  const mountRef = useRef(false);
  const searchParams = useSearchParams();
  const itemSymbol: string = searchParams.get('itemSymbol') || '';

  const updateQueryParams = useUpdateQueryParams();

  const [selectChain, setSelectChain] = useState(defaultChain);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
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
      const data = await fetchNFTItemActivity({
        chainId: getChainId(selectChain),
        symbol: itemSymbol,
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
      });
      setData(data.list);
      setTotal(data.total);
    } finally {
      setLoading(false);
      mountRef.current = true;
    }
  }, [selectChain, itemSymbol, currentPage, pageSize, updateQueryParams]);

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<IActivityTableData>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      detailData,
    });
  }, [detailData, timeFormat]);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Table
        headerTitle={{
          multi: {
            title: `Total ${thousandsNumber(total)} transactions found`,
            desc: '',
          },
        }}
        showMultiChain
        bordered={false}
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        total={total}
        options={[10, 25, 50]}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
