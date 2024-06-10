'use client';
import Table, { ITableSearch } from '@_components/Table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { getHoldersSearchAfter, getSort } from '@_utils/formatter';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';

export interface HolderProps {
  topSearchProps?: ITableSearch;
  search?: string;
}

const TAB_NAME = 'holders';

export default function Holder(props: HolderProps) {
  const { topSearchProps } = props;
  const isMobile = useMobileAll();
  const { activeTab, defaultPage, defaultPageSize, defaultPageType, defaultSearchAfter } = useSearchAfterParams(
    50,
    TAB_NAME,
  );
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<HolderItem[]>([]);
  const updateQueryParams = useUpdateQueryParams();
  const mountRef = useRef(false);
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);
  const fetchHolderDataWrap = useCallback(async () => {
    setLoading(true);
    try {
      const sort = getSort(pageType, currentPage);
      const searchAfter = getHoldersSearchAfter(currentPage, data, pageType);
      console.log(mountRef.current, 'mountRef.current');
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
      const res = await fetchNFTHolders({
        chainId: chain as TChainID,
        maxResultCount: pageSize,
        collectionSymbol: collectionSymbol,
        search: '',
        orderInfos: [
          { orderBy: 'FormatAmount', sort },
          { orderBy: 'Address', sort },
        ],
        searchAfter:
          !mountRef.current && defaultSearchAfter && activeTab ? JSON.parse(defaultSearchAfter) : searchAfter,
      });
      setTotal(res.total);
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      mountRef.current = true;
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
