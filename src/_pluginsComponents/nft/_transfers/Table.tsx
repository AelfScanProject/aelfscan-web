'use client';
import React from 'react';
import Table, { ITableSearch } from '@_components/Table';
import getColumns from './column';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { CollectionTransfer } from '../type';
import { useSearchParams } from 'next/navigation';
import { useMobileAll } from '@_hooks/useResponsive';
import { getChainId, getSort, getBlockTimeSearchAfter, thousandsNumber } from '@_utils/formatter';
import { fetchNFTTransfers } from '@_api/fetchNFTS';
import { PageTypeEnum } from '@_types';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { useMultiChain } from '@_hooks/useSelectChain';
export interface ItemActivityTableProps {
  search?: string;
  topSearchProps?: ITableSearch;
}

const TAB_NAME = 'transfers';
export default function ItemActivityTable(props: ItemActivityTableProps) {
  const searchParams = useSearchParams();
  const collectionSymbol: string = searchParams.get('collectionSymbol') || '';
  const isMobile = useMobileAll();
  const { activeTab, defaultPage, defaultPageSize, defaultPageType, defaultSearchAfter, defaultChain } =
    useSearchAfterParams(50, TAB_NAME);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<CollectionTransfer[]>([]);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);
  const mountRef = useRef(false);
  const updateQueryParams = useUpdateQueryParams();

  const [selectChain, setSelectChain] = useState(defaultChain);

  const fetchTableData = useCallback(async () => {
    setLoading(true);

    try {
      const sort = getSort(pageType, currentPage);
      const searchAfter = getBlockTimeSearchAfter(currentPage, data, pageType, 'dateTime');
      try {
        if (mountRef.current) {
          updateQueryParams({
            p: currentPage,
            ps: pageSize,
            chain: selectChain,
            pageType,
            tab: '',
            searchAfter: JSON.stringify(searchAfter),
          });
        }
      } catch (error) {
        console.log(error, 'error.rr');
      }
      const res = await fetchNFTTransfers({
        maxResultCount: pageSize,
        search: '',
        collectionSymbol: collectionSymbol,
        chainId: getChainId(selectChain),
        orderInfos: [
          { orderBy: 'BlockTime', sort },
          { orderBy: 'TransactionId', sort },
        ],
        searchAfter:
          !mountRef.current && defaultSearchAfter && activeTab ? JSON.parse(defaultSearchAfter) : searchAfter,
      });
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
      setTotal(res.total);
      setLoading(false);
      mountRef.current = true;
    } finally {
      setLoading(false);
      mountRef.current = true;
    }
  }, [pageType, currentPage, pageSize, collectionSymbol, selectChain]);

  const [timeFormat, setTimeFormat] = useState<string>('Age');

  const multi = useMultiChain();

  const columns = useMemo<ColumnsType<CollectionTransfer>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
    });
  }, [timeFormat]);

  const chainChange = (value) => {
    setSelectChain(value);
    setCurrentPage(1);
    setPageType(PageTypeEnum.NEXT);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
    setPageType(PageTypeEnum.NEXT);
  };

  const pageChange = (page: number) => {
    if (page > currentPage) {
      setPageType(PageTypeEnum.NEXT);
    } else {
      setPageType(PageTypeEnum.PREV);
    }
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  return (
    <div className="collection-transfers-table">
      <Table
        headerTitle={{
          single: {
            title: `Total ${thousandsNumber(total)} transactions found`,
          },
        }}
        showMultiChain={multi}
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        bordered={false}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        showLast={false}
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
