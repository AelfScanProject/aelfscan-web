'use client';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { ITokenTransfers, TokenTransfersItemType } from '@_types/commonDetail';
import { getAddress, getSort, getTransferSearchAfter, thousandsNumber } from '@_utils/formatter';
import { useMobileAll } from '@_hooks/useResponsive';
import { useParams } from 'next/navigation';
import { fetchAccountTransfers } from '@_api/fetchContact';
import { TChainID } from '@_api/type';
import { PageTypeEnum } from '@_types';
// import { updateQueryParams } from '@_utils/urlUtils';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
const TAB_NAME = 'tokentransfers';
export default function List() {
  const isMobile = useMobileAll();
  const { activeTab, defaultPage, defaultPageSize, defaultPageType, defaultSearchAfter } = useSearchAfterParams(
    25,
    TAB_NAME,
  );
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<TokenTransfersItemType[]>([]);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);
  const mountRef = useRef(false);
  const { chain, address } = useParams<{
    chain: TChainID;
    address: string;
  }>();

  const updateQueryParams = useUpdateQueryParams();

  const fetchData = useCallback(async () => {
    const sort = getSort(pageType, currentPage);
    const searchAfter = getTransferSearchAfter(currentPage, data, pageType);
    const params = {
      chainId: chain,
      maxResultCount: pageSize,
      tokenType: 0,
      address: getAddress(address),
      orderInfos: [
        { orderBy: 'BlockHeight', sort },
        { orderBy: 'TransactionId', sort },
      ],
      searchAfter: !mountRef.current && defaultSearchAfter && activeTab ? JSON.parse(defaultSearchAfter) : searchAfter,
    };
    setLoading(true);
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
    try {
      const res: ITokenTransfers = await fetchAccountTransfers(params);
      setTotal(res.total);
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
    } catch (error) {
      mountRef.current = true;
      setLoading(false);
    } finally {
      mountRef.current = true;
      setLoading(false);
    }
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
        rowKey={(record) => {
          return record.transactionId + record.method;
        }}
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
