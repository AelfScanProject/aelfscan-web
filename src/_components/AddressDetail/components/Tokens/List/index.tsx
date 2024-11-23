import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import getColumns from './columnConfig';
import './index.css';
import { TokensListItemType } from '@_types/commonDetail';
import { useMobileAll } from '@_hooks/useResponsive';
import { getAddress, getChainId, getPageNumber, numberFormatter, thousandsNumber } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { fetchAccountsDetailTokens } from '@_api/fetchContact';
import { TableProps } from 'antd';
import { Switch } from 'aelf-design';
import { SortEnum, TableSortEnum } from '@_types/common';

type OnChange = NonNullable<TableProps<TokensListItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

export default function TokensList({ totalTokenValue, totalTokenValueOfElf }) {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showELF, setShowELF] = useState<boolean>(false);
  const [data, setData] = useState<TokensListItemType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [SearchFetchText, setSearchFetchText] = useState<string>('');
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const { chain, address } = useParams();

  const [selectChain, setSelectChain] = useState(chain as string);

  const fetchData = useCallback(async () => {
    try {
      const params = {
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
        chainId: getChainId(selectChain),
        address: getAddress(address as string),
        orderBy: sortedInfo.order ? (sortedInfo.columnKey as string) : undefined,
        sort: sortedInfo.order ? SortEnum[TableSortEnum[sortedInfo.order]] : undefined,
        search: SearchFetchText,
      };
      setLoading(true);
      const data = await fetchAccountsDetailTokens(params);
      setTotal(data.total);
      setData(data.list);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [SearchFetchText, address, selectChain, currentPage, pageSize, sortedInfo.columnKey, sortedInfo.order]);

  const columns = getColumns(sortedInfo, chain, showELF);

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };
  const chainChange = (value) => {
    setCurrentPage(1);
    setSelectChain(value);
  };

  const searchChange = useCallback((value) => {
    setSearchFetchText(value);
  }, []);

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as Sorts);
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const desc = useMemo(() => {
    return `Total Value : ${showELF ? numberFormatter(totalTokenValueOfElf || '-') : `$${thousandsNumber(totalTokenValue)}`}`;
  }, [showELF, totalTokenValue, totalTokenValueOfElf]);

  return (
    <div className="token-list pb-2">
      <div className="table-container">
        <Table
          showTopSearch
          headerTitle={{
            multi: {
              title: `Tokens`,
              desc: desc,
            },
          }}
          bordered={false}
          showMultiChain={true}
          MultiChainSelectProps={{
            value: selectChain,
            onChange: chainChange,
          }}
          topSearchProps={{
            value: searchText,
            placeholder: 'Search by Name/Symbol',
            className: '!w-auto !min-w-[176px]',
            onChange: ({ currentTarget }) => {
              setSearchText(currentTarget.value);
            },
            onSearchChange: (value) => {
              searchChange(value);
            },
          }}
          tokenPage
          headerLeftNode={
            <div className="flex items-center">
              <span className="mr-2 text-xs leading-5 text-base-100">Show value in ELF</span>
              <Switch checked={showELF} onChange={setShowELF} />
            </div>
          }
          onChange={handleChange}
          loading={loading}
          options={[10, 20]}
          hideOnSinglePage={true}
          dataSource={data}
          columns={columns}
          isMobile={isMobile}
          rowKey={(record) => {
            return record.token?.symbol + record?.chainIds?.join('');
          }}
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </div>
    </div>
  );
}
