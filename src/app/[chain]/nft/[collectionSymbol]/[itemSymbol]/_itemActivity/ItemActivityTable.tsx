'use client';
import Table from '@_components/Table';
import getColumns from './column';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { IActivityTableData, ItemSymbolDetailOverview } from '../type';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchNFTItemActivity } from '@_api/fetchNFTS';
import { useParams } from 'next/navigation';
import { getPageNumber } from '@_utils/formatter';
import { TChainID } from '@_api/type';

export default function ItemActivityTable({ detailData }: { detailData: ItemSymbolDetailOverview }) {
  const isMobile = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<IActivityTableData[]>([]);

  const { chain, itemSymbol } = useParams<{
    chain: TChainID;
    itemSymbol: string;
  }>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNFTItemActivity({
        chainId: chain,
        symbol: itemSymbol,
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
      });
      setData(data.list);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [chain, currentPage, itemSymbol, pageSize]);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<IActivityTableData>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      chainId: chain,
      detailData,
    });
  }, [chain, detailData, timeFormat]);

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Table
        headerTitle={{
          multi: {
            title: `A total of ${total} records found`,
            desc: '',
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionId"
        total={total}
        options={[10, 25, 50]}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
