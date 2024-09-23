'use client';
import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IHolderItem, ITokenSearchProps } from '../../type';
import getColumns from './columns';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchTokenDetailHolders } from '@_api/fetchTokens';
import { useParams } from 'next/navigation';
import { pageSizeOption } from '@_utils/contant';
import { PageTypeEnum } from '@_types';
import { getChainId, getHoldersSearchAfter, getSort } from '@_utils/formatter';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { useMultiChain } from '@_hooks/useSelectChain';

interface HoldersProps extends ITokenSearchProps {}

const TAB_NAME = 'holders';
export default function Holders({ search, onSearchChange, onSearchInputChange }: HoldersProps) {
  const isMobile = useMobileAll();

  const { chain, tokenSymbol } = useParams();
  const { activeTab, defaultPage, defaultPageSize, defaultPageType, defaultSearchAfter, defaultChain } =
    useSearchAfterParams(50, TAB_NAME);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<IHolderItem[]>();
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);
  const mountRef = useRef(false);

  const [selectChain, setSelectChain] = useState(defaultChain);

  const updateQueryParams = useUpdateQueryParams();
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const sort = getSort(pageType, currentPage);
      const searchAfter = getHoldersSearchAfter(currentPage, data, pageType);
      const params = {
        chainId: getChainId(selectChain),
        symbol: tokenSymbol as string,
        maxResultCount: pageSize,
        orderInfos: [
          { orderBy: 'FormatAmount', sort },
          { orderBy: 'Address', sort },
        ],
        searchAfter:
          !mountRef.current && defaultSearchAfter && activeTab ? JSON.parse(defaultSearchAfter) : searchAfter,
      };
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
      const res = await fetchTokenDetailHolders(params);
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
      setTotal(res.total);
      setLoading(false);
      mountRef.current = true;
    } catch (error) {
      setLoading(false);
      mountRef.current = true;
    }
  }, [chain, tokenSymbol, pageSize, pageType, currentPage, selectChain]);

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
    fetchData();
  }, [fetchData]);

  const multi = useMultiChain();

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, chain, multi }),
    [currentPage, pageSize, chain, multi],
  );
  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'token' : 'tokens'} found`, [total]);

  return (
    <div>
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
        topSearchProps={{
          value: search || '',
          onChange: ({ currentTarget }) => {
            onSearchInputChange(currentTarget.value);
          },
          onSearchChange,
        }}
        showMultiChain={multi}
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        // showTopSearch
        loading={loading}
        dataSource={data}
        columns={columns}
        options={pageSizeOption}
        isMobile={isMobile}
        rowKey="index"
        total={total}
        showLast={false}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
