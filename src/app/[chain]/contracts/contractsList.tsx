'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { IContractDataItem, IContractResponseData, TChainID } from '@_api/type';
import { fetchContactList } from '@_api/fetchContact';
import { getPageNumber } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { pageSizeOption } from '@_utils/contant';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';
export default function List({ SSRData, defaultPage, defaultPageSize }) {
  console.log(SSRData, defaultPage, defaultPageSize, 'SSRData');
  const isMobile = useMobileAll();

  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<IContractDataItem[]>(SSRData.list);
  const updateQueryParams = useUpdateQueryParams();

  const { chain } = useParams<{ chain: TChainID }>();

  const fetchData = useCallback(
    async (page, size) => {
      const params = {
        chainId: chain,
        skipCount: getPageNumber(page, size),
        maxResultCount: size,
      };
      setLoading(true);
      try {
        const res: IContractResponseData = await fetchContactList(params);
        setTotal(res.total);
        setData(res.list);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    },
    [chain],
  );

  const columns = useMemo<ColumnsType<IContractDataItem>>(() => {
    return getColumns(chain);
  }, [chain]);

  const pageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ p: page, ps: pageSize });
    fetchData(page, pageSize);
  };

  const pageSizeChange = (page: number, pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(page);
    updateQueryParams({ p: page, ps: pageSize });
    fetchData(page, pageSize);
  };

  const multiTitle = useMemo(() => {
    return `A total of ${total} contracts found`;
  }, [total]);

  return (
    <div>
      <HeadTitle content="Contracts" adPage="contracts"></HeadTitle>
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: total > 1000 ? '(Showing the last 1,000 contracts only)' : '',
          },
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
