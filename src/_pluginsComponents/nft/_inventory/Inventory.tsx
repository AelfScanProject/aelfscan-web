import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import CardList from './CardList';
import { InventoryItem } from '../type';
import { useSearchParams } from 'next/navigation';
import { ITableSearch } from '@_components/Table';
import { fetchNFTInventory } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { getAddress } from '@_utils/formatter';
import useSearchAfterParams from '@_hooks/useSearchAfterParams';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
export interface InventoryProps {
  search?: string;
  topSearchProps?: ITableSearch;
}
const TAB_NAME = 'inventory';
export default function Inventory(props: InventoryProps) {
  const searchParams = useSearchParams();
  const chain = searchParams.get('chainId');
  const collectionSymbol: string = searchParams.get('collectionSymbol') || '';
  const { defaultPage, defaultPageSize } = useSearchAfterParams(50, TAB_NAME);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<InventoryItem[]>([]);
  const mountRef = useRef(false);

  const updateQueryParams = useUpdateQueryParams();

  const [text, setSearchText] = useState<string>('');

  const [searchVal, setSearchVal] = useState<string>(props.search || '');

  // only trigger when onPress / onClear
  const handleSearchChange = (val) => {
    setCurrentPage(1);
    setSearchVal(val);
  };

  const handleClear = () => {
    setCurrentPage(1);
    setSearchVal('');
  };
  const onChange = ({ currentTarget }) => {
    setSearchText(currentTarget.value);
    if (!currentTarget.value.trim()) {
      handleClear();
    }
  };
  const topSearchProps = {
    value: text,
    onChange,
    disabledTooltip: false,
    onSearchChange: handleSearchChange,
    onClear: handleClear,
    placeholder: 'Filter Token Symbol',
  };

  const fetchInventoryListWrap = useCallback(async () => {
    setLoading(true);
    try {
      try {
        if (mountRef.current) {
          updateQueryParams({
            p: currentPage,
            ps: pageSize,
            tab: TAB_NAME,
          });
        }
      } catch (error) {
        console.log(error, 'error.rr');
      }
      const res = await fetchNFTInventory({
        chainId: chain as TChainID,
        skipCount: (currentPage - 1) * pageSize,
        maxResultCount: pageSize,
        search: getAddress(searchVal ?? ''),
        collectionSymbol: collectionSymbol,
      });
      setTotal(res.total);
      setData(res.list);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      mountRef.current = true;
    }
  }, [chain, currentPage, pageSize, searchVal, collectionSymbol]);

  const pageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = async (page, size) => {
    setPageSize(size);
    setCurrentPage(page);
  };
  useEffect(() => {
    fetchInventoryListWrap();
  }, [fetchInventoryListWrap]);

  return (
    <div>
      <CardList
        total={total}
        headerTitle={{
          single: {
            title: `A total of ${total} records found`,
          },
        }}
        loading={loading}
        showTopSearch={true}
        topSearchProps={topSearchProps}
        dataSource={data}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
