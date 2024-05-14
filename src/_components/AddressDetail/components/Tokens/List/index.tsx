import Table from '@_components/Table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import getColumns from './columnConfig';
import './index.css';
import { TokensListItemType } from '@_types/commonDetail';
import { useMobileAll } from '@_hooks/useResponsive';
import { getAddress, getPageNumber, numberFormatter } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { fetchAccountsDetailTokens } from '@_api/fetchContact';
import { TableProps } from 'antd';
import { Switch } from 'aelf-design';
import { SortEnum, TableSortEnum } from '@_types/common';

type OnChange = NonNullable<TableProps<TokensListItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

export default function TokensList() {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showELF, setShowELF] = useState<boolean>(false);
  const [data, setData] = useState<TokensListItemType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [SearchFetchText, setSearchFetchText] = useState<string>('');
  const [assetInUsd, setAssetInUsd] = useState<number>();
  const [assetInElf, setAssetInElf] = useState<number>();
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const { chain, address } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const params = {
        skipCount: getPageNumber(currentPage, pageSize),
        maxResultCount: pageSize,
        chainId: chain as TChainID,
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
      setAssetInUsd(data.assetInUsd);
      setAssetInElf(data.assetInElf);
    } finally {
      setLoading(false);
    }
  }, [SearchFetchText, address, chain, currentPage, pageSize, sortedInfo.columnKey, sortedInfo.order]);

  const columns = getColumns(sortedInfo, chain, showELF);

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
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
    return `Total Value : ${showELF ? numberFormatter(assetInElf || '-') : `$${assetInUsd}`}`;
  }, [assetInElf, assetInUsd, showELF]);

  return (
    <div className="token-list px-4">
      <div className="table-container py-4 pb-0">
        <Table
          showTopSearch
          headerTitle={{
            multi: {
              title: `Tokens (${total})`,
              desc: desc,
            },
          }}
          topSearchProps={{
            value: searchText,
            placeholder: 'Search Token Name  Token Symbol',
            onChange: ({ currentTarget }) => {
              setSearchText(currentTarget.value);
            },
            onSearchChange: (value) => {
              searchChange(value);
            },
          }}
          headerLeftNode={
            <div className="flex items-center">
              <span className="mr-2 text-xs leading-5 text-base-100">Show/Hide value in ELF</span>
              <Switch checked={showELF} onChange={setShowELF} />
            </div>
          }
          onChange={handleChange}
          loading={loading}
          options={[10, 20]}
          dataSource={data}
          columns={columns}
          isMobile={isMobile}
          rowKey={(record) => {
            return record.token?.symbol;
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
