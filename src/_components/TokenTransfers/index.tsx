'use client';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { ITokenTransfers, TokenTransfersItemType } from '@_types/commonDetail';
import { getAddress, getBlockTimeSearchAfter, getChainId, getSort, thousandsNumber } from '@_utils/formatter';
import { useMobileAll } from '@_hooks/useResponsive';
import { useParams } from 'next/navigation';
import { fetchAccountTransfers } from '@_api/fetchContact';
import { TChainID } from '@_api/type';
import { PageTypeEnum } from '@_types';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { useAddressContext } from '@_components/AddressDetail/AddressContext';
const TAB_NAME = 'tokentransfers';
export default function List({ defaultChain }) {
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

  const [selectChain, setSelectChain] = useState(defaultChain);

  const { address } = useParams<{
    chain: TChainID;
    address: string;
  }>();

  const updateQueryParams = useUpdateQueryParams();

  const { isAddress } = useAddressContext();

  const fetchData = useCallback(async () => {
    const sort = getSort(pageType, currentPage);
    const searchAfter = getBlockTimeSearchAfter(currentPage, data, pageType, 'dateTime');
    const params = {
      chainId: getChainId(selectChain),
      maxResultCount: pageSize,
      tokenType: 0,
      address: getAddress(address),
      orderInfos: [
        { orderBy: 'BlockTime', sort },
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
          chain: selectChain,
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
  }, [address, selectChain, currentPage, pageSize]);

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
  const chainChange = (value) => {
    setCurrentPage(1);
    setPageType(PageTypeEnum.NEXT);
    setSelectChain(value);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const singleTitle = useMemo(() => {
    return `Total ${thousandsNumber(total)} token transfers found`;
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
        showMultiChain={isAddress}
        bordered={false}
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        columns={columns}
        options={[10, 25, 50]}
        isMobile={isMobile}
        showLast={false}
        total={total}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
