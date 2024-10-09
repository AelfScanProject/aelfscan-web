import Table from '@_components/Table';
import { useCallback, useEffect, useState } from 'react';
import getColumns from './columnConfig';
import './index.css';
import { NftsItemType } from '@_types/commonDetail';
import { fetchAccountsDetailNFTAssets } from '@_api/fetchContact';
import { useParams } from 'next/navigation';
import { getAddress, getChainId, getPageNumber } from '@_utils/formatter';
import { TableProps } from 'antd';
import { SortEnum, TableSortEnum } from '@_types/common';
import { useMultiChain } from '@_hooks/useSelectChain';

type OnChange = NonNullable<TableProps<NftsItemType>['onChange']>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

export default function NFTAssets() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<NftsItemType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [SearchFetchText, setSearchFetchText] = useState<string>('');
  const { chain, address } = useParams();
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

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
      const data = await fetchAccountsDetailNFTAssets(params);
      setTotal(data.total);
      setData(data.list);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [SearchFetchText, address, selectChain, currentPage, pageSize, sortedInfo]);

  const multi = useMultiChain();
  const columns = getColumns(chain, sortedInfo, multi);

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

  const searchChange = (value) => {
    setSearchFetchText(value);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as Sorts);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="asset-list">
      <div className="table-container p-4 py-0">
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
          showMultiChain={multi}
          MultiChainSelectProps={{
            value: selectChain,
            onChange: chainChange,
          }}
          onChange={handleChange}
          options={[10, 20]}
          dataSource={data}
          hideOnSinglePage={true}
          columns={columns}
          rowKey={(record) => record.token?.symbol + record?.chainIds?.join('')}
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      </div>
    </div>
  );
}
