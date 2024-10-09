'use client';
import React from 'react';
import Table from '@_components/Table';
import getColumns from './column';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchNFTItemHolders } from '@_api/fetchNFTS';
import { useSearchParams } from 'next/navigation';
import { pageSizeOption } from '@_utils/contant';
import { HolderItem } from '../type';
import { PageTypeEnum } from '@_types';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { getChainId, getHoldersSearchAfter, getSort } from '@_utils/formatter';
import { useMultiChain } from '@_hooks/useSelectChain';
const TAB_NAME = 'holders';
export default function Holder() {
  const isMobile = useMobileAll();
  const searchParams = useSearchParams();
  const chain = searchParams.get('chainId');
  const itemSymbol: string = searchParams.get('itemSymbol') || '';

  const { activeTab, defaultPage, defaultPageSize, defaultPageType, defaultSearchAfter, defaultChain } =
    useSearchAfterParams(25, TAB_NAME);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<HolderItem[]>([]);
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);

  const [selectChain, setSelectChain] = useState(defaultChain);

  const mountRef = useRef(false);
  const updateQueryParams = useUpdateQueryParams();

  const fetchHolderDataWrap = useCallback(async () => {
    setLoading(true);
    try {
      const sort = getSort(pageType, currentPage);
      const searchAfter = getHoldersSearchAfter(currentPage, data, pageType);
      try {
        if (mountRef.current) {
          updateQueryParams({
            p: currentPage,
            ps: pageSize,
            pageType,
            chain: selectChain,
            tab: TAB_NAME,
            searchAfter: JSON.stringify(searchAfter),
          });
        }
      } catch (error) {
        console.log(error, 'error.rr');
      }
      const res = await fetchNFTItemHolders({
        chainId: getChainId(selectChain),
        maxResultCount: pageSize,
        symbol: itemSymbol as string,
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
  }, [selectChain, currentPage, itemSymbol, pageSize, pageType, updateQueryParams]);

  const multi = useMultiChain();

  const columns = useMemo<ColumnsType<HolderItem>>(() => {
    return getColumns(currentPage, pageSize, chain, multi);
  }, [chain, currentPage, pageSize, multi]);

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
  const chainChange = (value) => {
    setSelectChain(value);
    setCurrentPage(1);
    setPageType(PageTypeEnum.NEXT);
  };

  useEffect(() => {
    fetchHolderDataWrap();
  }, [fetchHolderDataWrap]);

  return (
    <div>
      <Table
        headerTitle={{
          multi: {
            title: `A total of ${total} holders found`,
            desc: '',
          },
        }}
        loading={loading}
        dataSource={data}
        showMultiChain={multi}
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        showLast={false}
        columns={columns}
        isMobile={isMobile}
        rowKey={(record) => {
          return record.address.address;
        }}
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
