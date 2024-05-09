'use client';
import Table from '@_components/Table';
import getColumns from '../../_Detail/_holders/column';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchNFTItemHolders } from '@_api/fetchNFTS';
import { getPageNumber } from '@_utils/formatter';
import { TChainID } from '@_api/type';
import { useParams } from 'next/navigation';
import { pageSizeOption } from '@_utils/contant';
import { HolderItem } from '../../_Detail/type';

export default function Holder() {
  const isMobile = useMobileAll();
  const { itemSymbol, chain } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<HolderItem[]>([]);
  const fetchHolderDataWrap = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNFTItemHolders({
        chainId: chain as TChainID,
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
        symbol: itemSymbol as string,
      });
      setTotal(data.total);
      setData(data.list);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, currentPage, itemSymbol, pageSize]);
  const columns = useMemo<ColumnsType<HolderItem>>(() => {
    return getColumns(currentPage, pageSize, chain);
  }, [chain, currentPage, pageSize]);

  const pageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = async (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchHolderDataWrap();
  }, [fetchHolderDataWrap]);

  return (
    <div>
      <Table
        headerLeftNode={`A total of ${total} holders found`}
        headerTitle={{
          multi: {
            title: '',
            desc: '',
          },
        }}
        loading={loading}
        dataSource={data}
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
