'use client';
import Table, { ITableSearch } from '@_components/Table';
import getColumns from './column';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { CollectionTransfer } from '../type';
import { useParams } from 'next/navigation';
import { useMobileAll } from '@_hooks/useResponsive';
import { NftCollectionPageParams } from 'global';
import { getAddress } from '@_utils/formatter';
import { fetchNFTTransfers } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { PageTypeEnum } from '@_types';
export interface ItemActivityTableProps {
  search?: string;
  topSearchProps?: ITableSearch;
}
export default function ItemActivityTable(props: ItemActivityTableProps) {
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const { topSearchProps, search } = props;
  const isMobile = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<CollectionTransfer[]>([]);
  const [pageType, setPageType] = useState<PageTypeEnum>(PageTypeEnum.NEXT);

  const fetchTableData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchNFTTransfers({
        maxResultCount: pageSize,
        search: getAddress(search ?? ''),
        collectionSymbol: collectionSymbol,
        chainId: chain as TChainID,
        orderInfos: [
          { orderBy: 'BlockHeight', sort: pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc' },
          { orderBy: 'TransactionId', sort: pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc' },
        ],
        searchAfter:
          currentPage !== 1 && data && data.length
            ? [
                pageType === PageTypeEnum.NEXT ? data[data.length - 1].blockHeight : data[0].blockHeight,
                pageType === PageTypeEnum.NEXT ? data[data.length - 1].transactionId : data[0].transactionId,
              ]
            : ([] as any[]),
      });
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
      setTotal(res.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
