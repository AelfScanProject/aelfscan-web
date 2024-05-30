'use client';
import Table from '@_components/Table';
import { Descriptions, DescriptionsProps } from 'antd';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ITokenSearchProps, ITransferItem, SearchType, TTransferSearchData } from '../../type';
import getColumns from './columns';

import { getSearchByHashItems, getSearchByHolderItems } from './utils';

import { useMobileAll } from '@_hooks/useResponsive';
import { pageSizeOption } from '@_utils/contant';
import { TChainID } from '@_api/type';
import { useParams } from 'next/navigation';
import { getAddress } from '@_utils/formatter';
import { fetchTokenDetailTransfers } from '@_api/fetchTokens';
import { PageTypeEnum } from '@_types';

interface ITransfersProps extends ITokenSearchProps {}

const labelStyle: React.CSSProperties = {
  color: '#858585',
  fontSize: '14px',
  lineHeight: '22px',
};

const contentStyle: React.CSSProperties = {
  color: '#252525',
  fontSize: '14px',
  lineHeight: '22px',
};

export interface ITransfersRef {
  setSearchStr: (val: string) => void;
}

const Transfers = ({ search, searchText, searchType, onSearchChange, onSearchInputChange }: ITransfersProps, ref) => {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<ITransferItem[]>([]);
  const [timeFormat, setTimeFormat] = useState<string>('Date Time (UTC)');
  const [address, setAddress] = useState<string>('');
  const [searchData, setSearchData] = useState<TTransferSearchData>();
  const [pageType, setPageType] = useState<PageTypeEnum>(PageTypeEnum.NEXT);

  const { chain, tokenSymbol } = useParams();
  const [, setSearchText] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        chainId: chain as TChainID,
        symbol: tokenSymbol as string,
        maxResultCount: pageSize,
        search: getAddress(searchText ?? ''.trim()),
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
      const res = await fetchTokenDetailTransfers(params);
      const { balance, value, list, total } = res;
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? list : list.reverse());
      setSearchData({ balance, value });
      setTotal(total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, tokenSymbol, currentPage, pageSize, searchText, pageType]);

  useImperativeHandle(
    ref,
    () => ({
      setSearchStr(val: string) {
        setAddress(val);
        setSearchText(val);
        setCurrentPage(1);
        setPageType(PageTypeEnum.NEXT);
      },
    }),
    [setSearchText],
  );

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

  const columns = useMemo(
    () =>
      getColumns({
        timeFormat,
        handleTimeChange: () => setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age'),
        chain,
      }),
    [chain, timeFormat],
  );
  const title = useMemo(() => `A total of ${total} ${total <= 1 ? 'token' : 'tokens'} found`, [total]);

  const searchByHolder: DescriptionsProps['items'] = useMemo(
    () => getSearchByHolderItems(address, isMobile, searchData),
    [address, isMobile, searchData],
  );
  const searchByHash: DescriptionsProps['items'] = useMemo(
    () => getSearchByHashItems(address, isMobile, chain, data[0]?.blockHeight),
    [address, chain, data, isMobile],
  );
  console.log(searchType, 'searchType');
  return (
    <div>
      {searchType !== SearchType.other && (
        <div className="mx-4 border-b border-b-[#e6e6e6] pb-4">
          {searchType === SearchType.address && (
            <Descriptions
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              colon={false}
              layout="vertical"
              column={4}
              items={searchByHolder}
            />
          )}
          {searchType === SearchType.txHash && (
            <Descriptions
              contentStyle={contentStyle}
              labelStyle={labelStyle}
              colon={false}
              layout="vertical"
              column={4}
              items={searchByHash}
            />
          )}
        </div>
      )}
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
          placeholder: 'Filter Address / Txn Hash',
        }}
        showTopSearch
        loading={loading}
        options={pageSizeOption}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="transactionHash"
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
