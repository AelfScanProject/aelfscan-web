'use client';
import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IHolderItem, ITokenSearchProps } from '../../type';
import getColumns from './columns';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchTokenDetailHolders } from '@_api/fetchTokens';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';
import { PageTypeEnum } from '@_types';

interface HoldersProps extends ITokenSearchProps {}

export default function Holders({ search, onSearchChange, onSearchInputChange }: HoldersProps) {
  const isMobile = useMobileAll();

  const { chain, tokenSymbol } = useParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<IHolderItem[]>();
  const [pageType, setPageType] = useState<PageTypeEnum>(PageTypeEnum.NEXT);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        chainId: chain as TChainID,
        symbol: tokenSymbol as string,
        maxResultCount: pageSize,
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
      };
      const res = await fetchTokenDetailHolders(params);
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
      setTotal(res.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, tokenSymbol, pageSize, pageType, currentPage]);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(() => getColumns({ currentPage, pageSize, chain }), [currentPage, pageSize, chain]);
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
