'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getColumns from './columnConfig';
import { INFTsTableData, INFTsTableItem } from './type';
import { getPageNumber } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { SortEnum } from '@_types/common';
import { fetchNFTSList } from '@_api/fetchNFTS';
import { pageSizeOption } from '@_utils/contant';
import { useMobileAll } from '@_hooks/useResponsive';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';

interface TokensListProps {
  SSRData: INFTsTableData;
  defaultPage: string | number;
  defaultPageSize: string | number;
}

export default function TokensList({ SSRData, defaultPage, defaultPageSize }: TokensListProps) {
  console.log(SSRData, 'SSRData');
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(Number(defaultPage));
  const [pageSize, setPageSize] = useState<number>(Number(defaultPageSize));
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<INFTsTableItem[]>(SSRData.list);
  const [sort, setSort] = useState<SortEnum>(SortEnum.desc);
  const updateQueryParams = useUpdateQueryParams();

  const mountRef = useRef(true);

  const { chain } = useParams();
  const fetchData = useCallback(async () => {
    const params = {
      skipCount: getPageNumber(currentPage, pageSize),
      maxResultCount: pageSize,
      chainId: chain as TChainID,
      sort,
      orderBy: 'HolderCount',
    };
    setLoading(true);
    const data = await fetchNFTSList(params);
    setTotal(data.total);
    setData(data.list);
    setLoading(false);
    return data;
  }, [chain, currentPage, pageSize, sort]);

  const ChangeOrder = useCallback(() => {
    if (loading) return;
    setSort(sort === SortEnum.desc ? SortEnum.asc : SortEnum.desc);
  }, [loading, sort]);

  const columns = useMemo(
    () => getColumns({ currentPage, pageSize, ChangeOrder, sort, chain }),
    [ChangeOrder, chain, currentPage, pageSize, sort],
  );

  const pageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ p: page, ps: pageSize });
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    updateQueryParams({ p: page, ps: size });
    setCurrentPage(page);
  };

  useEffect(() => {
    if (mountRef.current) {
      mountRef.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'collection' : 'collections'} found`, [total]);

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
