'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from '@_components/TokenTransfers/columnConfig';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { ITokenTransfers, TokenTransfersItemType } from '@_types/commonDetail';
import { getAddress, getPageNumber, thousandsNumber } from '@_utils/formatter';
import { useMobileAll } from '@_hooks/useResponsive';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { fetchAccountTransfers } from '@_api/fetchContact';
export interface IResponseData {
  total: number;
  data: TokenTransfersItemType[];
}
export default function List({ showHeader = true }) {
  const isMobile = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<TokenTransfersItemType[]>([]);
  const [timeFormat, setTimeFormat] = useState<string>('Age');

  const { chain, address } = useParams<{
    chain: TChainID;
    address: string;
  }>();

  const fetchData = useCallback(async () => {
    const params = {
      chainId: chain,
      skipCount: getPageNumber(currentPage, pageSize),
      maxResultCount: pageSize,
      tokenType: 0,
      address: getAddress(address),
    };
    setLoading(true);
    try {
      const res: ITokenTransfers = await fetchAccountTransfers(params);
      setTotal(res.total);
      setData(res.list);
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  }, [address, chain, currentPage, pageSize]);

  const columns = useMemo<ColumnsType<TokenTransfersItemType>>(() => {
    return getColumns({
      timeFormat,
      columnType: 'NFT',
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      address,
    });
  }, [address, timeFormat]);

  const singleTitle = useMemo(() => {
    return `A total of ${thousandsNumber(total)} NFT transfers found`;
  }, [total]);

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {showHeader && <HeadTitle content="Transactions"></HeadTitle>}
      <Table
        headerTitle={{
          single: {
            title: singleTitle,
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionId"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
