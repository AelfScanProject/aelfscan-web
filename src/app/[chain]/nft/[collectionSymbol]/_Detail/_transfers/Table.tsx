'use client';
import Table, { ITableSearch } from '@_components/Table';
import getColumns from './column';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { CollectionTransfer } from '../type';
import { useParams } from 'next/navigation';
import { useMobileAll } from '@_hooks/useResponsive';
import { NftCollectionPageParams } from 'global';
import { getAddress, getSort, getTransferSearchAfter } from '@_utils/formatter';
import { fetchNFTTransfers } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { PageTypeEnum } from '@_types';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
export interface ItemActivityTableProps {
  search?: string;
  topSearchProps?: ITableSearch;
}

const TAB_NAME = 'transfers';
export default function ItemActivityTable(props: ItemActivityTableProps) {
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const { topSearchProps, search } = props;
  const isMobile = useMobileAll();
  const { activeTab, defaultPage, defaultPageSize, defaultPageType, defaultSearchAfter } = useSearchAfterParams(
    50,
    TAB_NAME,
  );
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<CollectionTransfer[]>([]);
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);
  const mountRef = useRef(false);
  const updateQueryParams = useUpdateQueryParams();
  const fetchTableData = useCallback(async () => {
    setLoading(true);

    try {
      const sort = getSort(pageType, currentPage);
      const searchAfter = getTransferSearchAfter(currentPage, data, pageType);
      try {
        if (mountRef.current) {
          updateQueryParams({
            p: currentPage,
            ps: pageSize,
            pageType,
            tab: TAB_NAME,
            searchAfter: JSON.stringify(searchAfter),
          });
        }
      } catch (error) {
        console.log(error, 'error.rr');
      }
      const res = await fetchNFTTransfers({
        maxResultCount: pageSize,
        search: getAddress(search ?? ''),
        collectionSymbol: collectionSymbol,
        chainId: chain as TChainID,
        orderInfos: [
          { orderBy: 'BlockHeight', sort },
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
  }, [pageSize, currentPage, search, collectionSymbol, chain, pageType]);

  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const columns = useMemo<ColumnsType<CollectionTransfer>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      chainId: chain,
    });
  }, [chain, timeFormat]);

  const pageChange = (page: number) => {
    if (page > currentPage) {
      setPageType(PageTypeEnum.NEXT);
    } else {
      setPageType(PageTypeEnum.PREV);
    }
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
    setPageType(PageTypeEnum.NEXT);
  };

  const onSearchChange = (value) => {
    setCurrentPage(1);
    setPageType(PageTypeEnum.NEXT);
    topSearchProps?.onSearchChange(value);
  };

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  return (
    <div className="collection-transfers-table">
      <Table
        headerTitle={{
          single: {
            title: `A total of ${total} records found`,
          },
        }}
        showTopSearch={true}
        topSearchProps={{ ...topSearchProps, onSearchChange }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        showLast={false}
        rowKey="transactionId"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
