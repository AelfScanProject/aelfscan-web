'use client';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { ITokenTransfers, TokenTransfersItemType } from '@_types/commonDetail';
import { getAddress, thousandsNumber } from '@_utils/formatter';
import { useMobileAll } from '@_hooks/useResponsive';
import { useParams } from 'next/navigation';
import { fetchAccountTransfers } from '@_api/fetchContact';
import { TChainID } from '@_api/type';
import { PageTypeEnum } from '@_types';

export default function List() {
  const isMobile = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<TokenTransfersItemType[]>([]);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const [pageType, setPageType] = useState<PageTypeEnum>(PageTypeEnum.NEXT);

  const { chain, address } = useParams<{
    chain: TChainID;
    address: string;
  }>();

  const fetchData = useCallback(async () => {
    const params = {
      chainId: chain,
      maxResultCount: pageSize,
      tokenType: 0,
      address: getAddress(address),
      orderInfos: [
        { orderBy: 'BlockHeight', sort: pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc' },
        { orderBy: 'TransactionId', sort: pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc' },
      ],
      searchAfter:
        currentPage !== 1 && data && data.length
          ? [
              pageType === PageTypeEnum.NEXT ? data[data.length - 1].blockHeight : data[0].blockHeight,
              pageType === PageTypeEnum.NEXT ? data[data.length - 1].transactionId : data[0].transactionId,
            ]
          : ([] as any[]),
    };
    setLoading(true);
    try {
      const res: ITokenTransfers = await fetchAccountTransfers(params);
      setTotal(res.total);
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  }, [address, chain, currentPage, pageSize]);

  const columns = useMemo<ColumnsType<TokenTransfersItemType>>(() => {
    return getColumns({
      timeFormat,
      columnType: 'Token',
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      address: getAddress(address),
    });
  }, [address, timeFormat]);

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

  const singleTitle = useMemo(() => {
    return `A total of ${thousandsNumber(total)} token transfers found`;
  }, [total]);

  return (
    <div>
      <Table
        headerTitle={{
          single: {
            title: singleTitle,
          },
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        options={[10, 25, 50]}
        isMobile={isMobile}
        showLast={false}
        rowKey="transactionId"
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
