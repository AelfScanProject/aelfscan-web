'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getColumns from './columnConfig';
import { useMobileAll } from '@_hooks/useResponsive';
import { ITokenList, ITokenListItem } from '../token/[tokenSymbol]/type';
import { fetchTokenList } from '@_api/fetchTokens';
import { getChainId, getPageNumber } from '@_utils/formatter';
import { pageSizeOption } from '@_utils/contant';
import { SortEnum } from '@_types/common';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';

interface TokensListProps {
  SSRData: ITokenList;
  defaultPage: string;
  defaultPageSize: string;
  defaultChain: string;
}

export default function TokensList({ SSRData, defaultPage, defaultPageSize, defaultChain }: TokensListProps) {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(Number(defaultPage));
  const [pageSize, setPageSize] = useState<number>(Number(defaultPageSize));
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<ITokenListItem[]>(SSRData.list);
  const [sort, setSort] = useState<SortEnum>(SortEnum.desc);
  const updateQueryParams = useUpdateQueryParams();

  const [selectChain, setSelectChain] = useState(defaultChain);

  const mountRef = useRef(true);

  const fetchData = useCallback(async () => {
    const params = {
      skipCount: getPageNumber(currentPage, pageSize),
      maxResultCount: pageSize,
      chainId: getChainId(selectChain),
      sort,
      orderBy: 'HolderCount',
    };
    setLoading(true);
    const data = await fetchTokenList(params);
    setTotal(data.total);
    setData(data.list);
    setLoading(false);
    return data;
  }, [selectChain, currentPage, pageSize, sort]);

  useEffect(() => {
    if (mountRef.current) {
      mountRef.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  const ChangeOrder = useCallback(() => {
    if (loading) return;
    setSort(sort === SortEnum.desc ? SortEnum.asc : SortEnum.desc);
  }, [loading, sort]);

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, sort, ChangeOrder }),
    [ChangeOrder, currentPage, pageSize, sort],
  );

  const pageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ p: page, ps: pageSize, chain: selectChain });
  };

  const chainChange = useCallback(
    (value) => {
      updateQueryParams({ p: 1, ps: pageSize, chain: value });
      setCurrentPage(1);
      setSelectChain(value);
    },
    [pageSize, updateQueryParams],
  );

  const title = useMemo(() => `Total ${total} tokens found`, [total]);

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    updateQueryParams({ p: page, ps: size, chain: selectChain });
    setCurrentPage(page);
  };

  return (
    <div>
      <HeadTitle content="Tokens" adPage="tokens" />
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
        loading={loading}
        showMultiChain
        MultiChainSelectProps={useMemo(() => {
          return {
            value: selectChain,
            onChange: chainChange,
          };
        }, [chainChange, selectChain])}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        options={pageSizeOption}
        rowKey={(record) => {
          return record.token?.symbol;
        }}
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
