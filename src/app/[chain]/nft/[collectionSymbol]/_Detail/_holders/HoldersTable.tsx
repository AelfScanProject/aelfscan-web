'use client';
import Table, { ITableSearch } from '@_components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { HolderItem } from '../type';
import getColumns from './column';
import { useParams } from 'next/navigation';
import { useMobileAll } from '@_hooks/useResponsive';
import { NftCollectionPageParams } from 'global';
import { fetchNFTHolders } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';
import { PageTypeEnum } from '@_types';

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
  const [pageType, setPageType] = useState<PageTypeEnum>(PageTypeEnum.NEXT);
  const fetchHolderDataWrap = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchNFTHolders({
        chainId: chain as TChainID,
        maxResultCount: pageSize,
        collectionSymbol: collectionSymbol,
        search: '',
        orderInfos: [
          { orderBy: 'FormatAmount', sort: pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc' },
          { orderBy: 'Address', sort: pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc' },
        ],
        searchAfter:
          currentPage !== 1 && data && data.length
            ? [
                pageType === PageTypeEnum.NEXT ? data[data.length - 1].quantity : data[0].quantity,
                pageType === PageTypeEnum.NEXT ? data[data.length - 1].address.address : data[0].address.address,
              ]
            : ([] as any[]),
      });
      setTotal(res.total);
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, collectionSymbol, currentPage, pageSize, pageType]);

  const columns = useMemo<ColumnsType<HolderItem>>(() => {
    return getColumns(currentPage, pageSize, chain);
  }, [chain, currentPage, pageSize]);

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
        topSearchProps={{ ...topSearchProps, onSearchChange }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        showLast={false}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
