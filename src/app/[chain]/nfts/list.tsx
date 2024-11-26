'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getColumns from './columnConfig';
import { INFTsTableData, INFTsTableItem } from './type';
import { getChainId, getPageNumber, thousandsNumber } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { SortEnum } from '@_types/common';
import { fetchNFTSList } from '@_api/fetchNFTS';
import { pageSizeOption } from '@_utils/contant';
import { useMobileAll } from '@_hooks/useResponsive';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { useMultiChain } from '@_hooks/useSelectChain';
interface TokensListProps {
  SSRData: INFTsTableData;
  defaultPage: string | number;
  defaultPageSize: string | number;
  defaultChain: string;
}

export default function TokensList({ SSRData, defaultPage, defaultPageSize, defaultChain }: TokensListProps) {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(Number(defaultPage));
  const [pageSize, setPageSize] = useState<number>(Number(defaultPageSize));
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<INFTsTableItem[]>(SSRData.list);
  const [sort, setSort] = useState<SortEnum>(SortEnum.desc);
  const [selectChain, setSelectChain] = useState(defaultChain);
  const updateQueryParams = useUpdateQueryParams();

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
    const data = await fetchNFTSList(params);
    setTotal(data.total);
    setData(data.list);
    setLoading(false);
    return data;
  }, [selectChain, currentPage, pageSize, sort]);

  const ChangeOrder = useCallback(() => {
    if (loading) return;
    setSort(sort === SortEnum.desc ? SortEnum.asc : SortEnum.desc);
  }, [loading, sort]);

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, ChangeOrder, sort }),
    [ChangeOrder, currentPage, pageSize, sort],
  );

  const pageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ p: page, ps: pageSize, chain: selectChain });
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    updateQueryParams({ p: page, ps: size, chain: selectChain });
    setCurrentPage(page);
  };

  const chainChange = (value) => {
    updateQueryParams({ p: 1, ps: pageSize, chain: value });
    setCurrentPage(1);
    setSelectChain(value);
  };

  useEffect(() => {
    if (mountRef.current) {
      mountRef.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  const title = useMemo(() => `Total ${thousandsNumber(total)} collections found`, [total]);

  return (
    <div>
      <HeadTitle content="NFTs" adPage="nfts" />
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        showMultiChain
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        isMobile={isMobile}
        rowKey={(item) => {
          return item.nftCollection?.symbol;
        }}
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
