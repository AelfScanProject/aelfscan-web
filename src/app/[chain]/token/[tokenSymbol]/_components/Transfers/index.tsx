'use client';
import Table from '@_components/Table';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ITokenSearchProps, ITransferItem } from '../../type';
import getColumns from './columns';

import { useMobileAll } from '@_hooks/useResponsive';
import { pageSizeOption } from '@_utils/contant';
import { useParams } from 'next/navigation';
import { getChainId, getSort, getBlockTimeSearchAfter, thousandsNumber } from '@_utils/formatter';
import { fetchTokenDetailTransfers } from '@_api/fetchTokens';
import { PageTypeEnum } from '@_types';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';

interface ITransfersProps extends ITokenSearchProps {}

export interface ITransfersRef {
  setSearchStr: (val: string) => void;
}

const TAB_NAME = '';

const Transfers = ({ searchType, token }: ITransfersProps, ref) => {
  const isMobile = useMobileAll();
  const { activeTab, defaultPage, defaultPageSize, defaultPageType, defaultSearchAfter, defaultChain } =
    useSearchAfterParams(50, TAB_NAME);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<ITransferItem[]>([]);
  const [timeFormat, setTimeFormat] = useState<string>('Date Time (UTC)');
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);
  const [selectChain, setSelectChain] = useState(defaultChain);

  const mountRef = useRef(false);

  const updateQueryParams = useUpdateQueryParams();

  const { tokenSymbol } = useParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const sort = getSort(pageType, currentPage);
      const searchAfter = getBlockTimeSearchAfter(currentPage, data, pageType, 'dateTime');
      const params = {
        chainId: getChainId(selectChain),
        symbol: tokenSymbol as string,
        maxResultCount: pageSize,
        search: '',
        orderInfos: [
          { orderBy: 'BlockTime', sort },
          { orderBy: 'TransactionId', sort },
        ],
        searchAfter:
          !mountRef.current && defaultSearchAfter && activeTab ? JSON.parse(defaultSearchAfter) : searchAfter,
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
      const res = await fetchTokenDetailTransfers(params);
      const { list, total } = res;
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? list : list.reverse());
      setTotal(total);
      setLoading(false);
      mountRef.current = true;
    } catch (error) {
      setLoading(false);
      mountRef.current = true;
    }
  }, [pageType, currentPage, tokenSymbol, pageSize, selectChain]);

  const pageChange = (page: number) => {
    setCurrentPage(page);
    if (page > currentPage) {
      setPageType(PageTypeEnum.NEXT);
    } else {
      setPageType(PageTypeEnum.PREV);
    }
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

  const columns = useMemo(
    () =>
      getColumns({
        timeFormat,
        token,
        handleTimeChange: () => setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age'),
      }),
    [timeFormat, token],
  );
  const title = useMemo(() => `Total ${thousandsNumber(total)} token transfers found`, [total]);

  return (
    <div>
      <Table
        headerTitle={{
          single: {
            title,
          },
        }}
        bordered={false}
        showMultiChain
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        loading={loading}
        options={pageSizeOption}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        total={total}
        showLast={false}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
};

export default forwardRef<ITransfersRef, ITransfersProps>(Transfers);
