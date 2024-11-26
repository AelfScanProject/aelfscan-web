'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from '@_components/TokenTransfers/columnConfig';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { ITokenTransfers, TokenTransfersItemType } from '@_types/commonDetail';
import { getAddress, getBlockTimeSearchAfter, getChainId, getSort, thousandsNumber } from '@_utils/formatter';
import { useMobileAll } from '@_hooks/useResponsive';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { fetchAccountTransfers } from '@_api/fetchContact';
import { PageTypeEnum } from '@_types';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useAddressContext } from '@_components/AddressDetail/AddressContext';
export interface IResponseData {
  total: number;
  data: TokenTransfersItemType[];
}
const TAB_NAME = 'nfttransfers';
export default function List({ showHeader = true, defaultChain }) {
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

  const [selectChain, setSelectChain] = useState(defaultChain);

  const { isAddress } = useAddressContext();

  const mountRef = useRef(false);

  const updateQueryParams = useUpdateQueryParams();
  const { address } = useParams<{
    chain: TChainID;
    address: string;
  }>();

  const fetchData = useCallback(async () => {
    const sort = getSort(pageType, currentPage);
    const searchAfter = getBlockTimeSearchAfter(currentPage, data, pageType, 'dateTime');
    const params = {
      chainId: getChainId(selectChain),
      maxResultCount: pageSize,
      tokenType: 1,
      address: getAddress(address),
      orderInfos: [
        { orderBy: 'BlockTime', sort },
        { orderBy: 'TransactionId', sort },
      ],
      searchAfter: !mountRef.current && defaultSearchAfter && activeTab ? JSON.parse(defaultSearchAfter) : searchAfter,
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
    setLoading(true);
    try {
      const res: ITokenTransfers = await fetchAccountTransfers(params);
      setTotal(res.total);
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
      mountRef.current = true;
    }
  }, [address, selectChain, currentPage, pageSize, pageType]);

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
    return `Total ${thousandsNumber(total)} NFT transfers found`;
  }, [total]);

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

  return (
    <div>
      {showHeader && <HeadTitle content="Transactions" adPage="nfttransfers"></HeadTitle>}
      <Table
        headerTitle={{
          single: {
            title: singleTitle,
          },
        }}
        showMultiChain={isAddress}
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        bordered={false}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey={(record) => {
          return record.transactionId + record.method;
        }}
        total={total}
        showLast={false}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
