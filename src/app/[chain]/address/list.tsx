/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:57:13
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:44:31
 * @Description: BlockList
 */
'use client';
import HeadTitle from '@_components/HeaderTitle';
import Table from '@_components/Table';
import getColumns from './columnConfig';
import { useCallback, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useMobileAll } from '@_hooks/useResponsive';
import { IAccountResponseData, IAccountsItem, TChainID } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';
import { useParams } from 'next/navigation';
import { getPageNumber, thousandsNumber } from '@_utils/formatter';
import { fetchTopAccounts } from '@_api/fetchContact';
import { updateQueryParams } from '@_utils/urlUtils';

export default function List({ SSRData, defaultPage, defaultPageSize }) {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<IAccountsItem[]>(SSRData.list);
  const [totalBalance, setTotalBalance] = useState<number>(SSRData.totalBalance);
  console.log(SSRData, 'SSRData');
  const { chain } = useParams<{ chain: TChainID }>();
  const fetchData = useCallback(
    async (page, size) => {
      const params = {
        chainId: chain || 'AELF',
        skipCount: getPageNumber(page, size),
        maxResultCount: size,
      };
      setLoading(true);
      try {
        const res: IAccountResponseData = await fetchTopAccounts(params);
        setTotal(res.total);
        setData(res.list);
        setTotalBalance(res.totalBalance);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    },
    [chain],
  );
  const multiTitle = useMemo(() => {
    return `A total of ${thousandsNumber(total)} accounts found (${totalBalance} ELF)`;
  }, [total, totalBalance]);

  const multiTitleDesc = useMemo(() => {
    return '(Showing the top 10,000 accounts only)';
  }, []);
  const columns = useMemo<ColumnsType<IAccountsItem>>(() => {
    return getColumns(currentPage, pageSize, chain);
  }, [currentPage, pageSize, chain]);

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

  return (
    <div>
      <HeadTitle content="Top Accounts by ELF Balance" adPage="topaccount"></HeadTitle>
      <Table
        headerTitle={{
          multi: {
            title: multiTitle,
            desc: total > 10000 ? multiTitleDesc : '',
          },
        }}
        dataSource={data}
        loading={loading}
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
