'use client';
import Table from '@_components/Table';
import getColumns from './column';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { IActivityTableData, ItemSymbolDetailOverview } from '../type';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchNFTItemActivity } from '@_api/fetchNFTS';
import { useParams } from 'next/navigation';
import { getPageNumber } from '@_utils/formatter';
import { TChainID } from '@_api/type';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
const TAB_NAME = 'activity';
export default function ItemActivityTable({ detailData }: { detailData: ItemSymbolDetailOverview }) {
  const isMobile = useMobileAll();
  const { defaultPage, defaultPageSize } = useSearchAfterParams(25, TAB_NAME);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<IActivityTableData[]>([]);
  const mountRef = useRef(false);
  const { chain, itemSymbol } = useParams<{
    chain: TChainID;
    itemSymbol: string;
  }>();

  const updateQueryParams = useUpdateQueryParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      try {
        if (mountRef.current) {
          updateQueryParams({
            p: currentPage,
            ps: pageSize,
            tab: TAB_NAME,
          });
        }
      } catch (error) {
        console.log(error, 'error.rr');
      }
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
      mountRef.current = true;
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
