import { useCallback, useEffect, useState } from 'react';
import CardList from './CardList';
import { InventoryItem } from '../type';
import { useParams } from 'next/navigation';
import { ITableSearch } from '@_components/Table';
import { NftCollectionPageParams } from 'global';
import { fetchNFTInventory } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
export interface InventoryProps {
  search?: string;
  topSearchProps?: ITableSearch;
}

export default function Inventory(props: InventoryProps) {
  const { collectionSymbol, chain } = useParams<NftCollectionPageParams>();
  const { topSearchProps, search } = props;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<InventoryItem[]>([]);

  const fetchInventoryListWrap = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchNFTInventory({
        chainId: chain as TChainID,
        skipCount: (currentPage - 1) * pageSize,
        maxResultCount: pageSize,
        search: search ?? '',
        collectionSymbol: collectionSymbol,
      });
      setTotal(res.total);
      setData(res.list);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, currentPage, pageSize, search, collectionSymbol]);

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

  console.log(111);
  return (
    <div>
      <CardList
        total={total}
        headerTitle={{
          single: {
            title: `A total of ${total} records found`,
          },
        }}
        showTopSearch={true}
        topSearchProps={topSearchProps}
        loading={loading}
        dataSource={data}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}
      />
    </div>
  );
}
