'use client';
import Table from '@_components/Table';
import getColumns from '../../../[collectionSymbol]/_Detail/_holders/column';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { fetchNFTItemHolders } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { useParams } from 'next/navigation';
import { pageSizeOption } from '@_utils/contant';
import { HolderItem } from '../../../[collectionSymbol]/_Detail/type';
import { PageTypeEnum } from '@_types';

export default function Holder() {
  const isMobile = useMobileAll();
  const { itemSymbol, chain } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<HolderItem[]>([]);
  const [pageType, setPageType] = useState<PageTypeEnum>(PageTypeEnum.NEXT);
  const fetchHolderDataWrap = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchNFTItemHolders({
        chainId: chain as TChainID,
        maxResultCount: pageSize,
        symbol: itemSymbol as string,
        orderInfos: [
          { orderBy: 'FormatAmount', sort: pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc' },
          { orderBy: 'Address', sort: pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc' },
        ],
        searchAfter:
          currentPage !== 1 && data && data.length
            ? [
                pageType === PageTypeEnum.NEXT ? data[data.length - 1].quantity : data[0].quantity,
                pageType === PageTypeEnum.NEXT ? data[data.length - 1].address.address : data[0].address.address,
              ]
            : ([] as any[]),
      });
      setTotal(res.total);
      setData(pageType === PageTypeEnum.NEXT || currentPage === 1 ? res.list : res.list.reverse());
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [chain, currentPage, itemSymbol, pageSize, pageType]);
  const columns = useMemo<ColumnsType<HolderItem>>(() => {
    return getColumns(currentPage, pageSize, chain);
  }, [chain, currentPage, pageSize]);

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
    fetchHolderDataWrap();
  }, [fetchHolderDataWrap]);

  return (
    <div>
      <Table
        headerTitle={{
          multi: {
            title: `A total of ${total} holders found`,
            desc: '',
          },
        }}
        loading={loading}
        dataSource={data}
        showLast={false}
        columns={columns}
        isMobile={isMobile}
        rowKey={(record) => {
          return record.address.address;
        }}
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
