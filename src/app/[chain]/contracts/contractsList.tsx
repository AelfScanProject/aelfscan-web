'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { IContractDataItem, IContractResponseData, TChainID } from '@_api/type';
import { fetchContactList } from '@_api/fetchContact';
import { getChainId, getPageNumber, thousandsNumber } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { MULTI_CHAIN, pageSizeOption } from '@_utils/contant';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
import { usePagination } from '@_hooks/usePagination';
export default function List({ SSRData, defaultPage, defaultPageSize, defaultChain }) {
  console.log(SSRData, 'SSRData');
  const isMobile = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<IContractDataItem[]>(SSRData.list);
  const updateQueryParams = useUpdateQueryParams();
  const [selectChain, setSelectChain] = useState(defaultChain);

  const { chain } = useParams<{ chain: TChainID }>();

  const fetchData = useCallback(
    async (page, size, chain) => {
      const params = {
        chainId: getChainId(chain),
        skipCount: getPageNumber(page, size),
        maxResultCount: size,
      };
      setLoading(true);
      try {
        updateQueryParams({ p: page, ps: size, chain: chain });
        const res: IContractResponseData = await fetchContactList(params);
        setTotal(res.total);
        setData(res.list);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    },
    [updateQueryParams],
  );

  const columns = useMemo<ColumnsType<IContractDataItem>>(() => {
    return getColumns();
  }, []);

  const { pageChange, pageSizeChange, chainChange } = usePagination({
    setCurrentPage,
    setPageSize,
    fetchData,
    setSelectChain,
    selectChain,
    pageSize,
  });

  const multiTitle = useMemo(() => {
    return `Total ${thousandsNumber(total)} contracts found`;
  }, [total]);

  return (
    <div>
      <HeadTitle content="Contracts" adPage="contracts"></HeadTitle>
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: '',
          },
        }}
        showMultiChain={chain === MULTI_CHAIN}
        MultiChainSelectProps={{
          value: selectChain,
          onChange: chainChange,
        }}
        loading={loading}
        dataSource={data}
        columns={columns}
        isMobile={isMobile}
        rowKey="address"
        total={total}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
