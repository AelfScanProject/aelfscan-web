import Table from '@_components/Table';
import { useCallback, useEffect, useState } from 'react';
import getColumns from './columnConfig';
import './index.css';
import { NftsItemType } from '@_types/commonDetail';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchAccountsDetailNFTAssets } from '@_api/fetchContact';
import { useParams } from 'next/navigation';
import { getAddress, getPageNumber } from '@_utils/formatter';
import { TChainID } from '@_api/type';
import { TableProps } from 'antd';
import { SortEnum, TableSortEnum } from '@_types/common';

type OnChange = NonNullable<TableProps<NftsItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

export default function NFTAssets() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<NftsItemType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [SearchFetchText, setSearchFetchText] = useState<string>('');
  const { chain, address } = useParams();
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

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
      const data = await fetchAccountsDetailNFTAssets(params);
      setTotal(data.total);
      setData(data.list);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [SearchFetchText, address, chain, currentPage, pageSize, sortedInfo]);
  const columns = getColumns(chain, sortedInfo);

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };

  const searchChange = (value) => {
    setSearchFetchText(value);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as Sorts);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isMobile = useMobileAll();
  return (
    <div className="asset-list">
      <div className="table-container p-4 pb-0">
        <Table
          loading={loading}
          showTopSearch
          headerTitle={{
            multi: {
              title: `NFT Assets(${total})`,
              desc: '',
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
          onChange={handleChange}
          options={[10, 20]}
          dataSource={data}
          columns={columns}
          isMobile={isMobile}
          rowKey={(record) => record.token?.symbol}
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </div>
    </div>
  );
}
