'use client';
import Table, { ITableSearch } from '@_components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { HolderItem } from '../type';
import getColumns from './column';
import { useParams } from 'next/navigation';
import { useMobileAll } from '@_hooks/useResponsive';
import { NftCollectionPageParams } from 'global';
import { getPageNumber } from '@_utils/formatter';
import { fetchNFTHolders } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';

export interface HolderProps {
  topSearchProps?: ITableSearch;
  search?: string;
}

export default function Holder(props: HolderProps) {
  const { topSearchProps } = props;
  const isMobile = useMobileAll();
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<HolderItem[]>([]);
  const fetchHolderDataWrap = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNFTHolders({
        chainId: chain as TChainID,
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
        collectionSymbol: collectionSymbol,
        search: '',
      });
      setTotal(data.total);
      setData(data.list);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, collectionSymbol, currentPage, pageSize]);

  const columns = useMemo<ColumnsType<HolderItem>>(() => {
    return getColumns(currentPage, pageSize, chain);
  }, [chain, currentPage, pageSize]);

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchHolderDataWrap();
  }, [fetchHolderDataWrap]);

  return (
    <div>
      <Table
        headerTitle={{
          single: {
            title: `A total of ${total} holders found`,
          },
        }}
        showTopSearch={true}
        topSearchProps={topSearchProps}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
