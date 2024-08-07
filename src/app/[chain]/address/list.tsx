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
import { getAccountSearchAfter, getSort, thousandsNumber } from '@_utils/formatter';
import { fetchTopAccounts } from '@_api/fetchContact';
import { PageTypeEnum } from '@_types';
import { useUpdateQueryParams } from '@_hooks/useUpdateQueryParams';

export default function List({ SSRData, defaultPage, defaultPageSize, defaultPageType }) {
  const isMobile = useMobileAll();
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(SSRData.total);
  const [data, setData] = useState<IAccountsItem[]>(SSRData.list);
  const [totalBalance, setTotalBalance] = useState<number>(SSRData.totalBalance);
  const [pageType, setPageType] = useState<PageTypeEnum>(defaultPageType);

  const updateQueryParams = useUpdateQueryParams();
  const { chain } = useParams<{ chain: TChainID }>();
  const fetchData = useCallback(
    async (page, size, data, pageType) => {
      const sort = getSort(pageType, page);
      const searchAfter = getAccountSearchAfter(page, data, pageType);
      updateQueryParams({ p: page, ps: size, pageType, searchAfter: JSON.stringify(searchAfter) });
      const params = {
        chainId: chain || 'AELF',
        maxResultCount: size,
        orderInfos: [
          { orderBy: 'FormatAmount', sort },
          { orderBy: 'Address', sort },
        ],
        searchAfter,
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
    [chain, updateQueryParams],
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
    let pageType;
    if (page > currentPage) {
      pageType = PageTypeEnum.NEXT;
      setPageType(PageTypeEnum.NEXT);
    } else {
      pageType = PageTypeEnum.PREV;
      setPageType(PageTypeEnum.PREV);
    }
    setCurrentPage(page);
    fetchData(page, pageSize, data, pageType);
  };

  const pageSizeChange = (page: number, pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(page);
    setPageType(PageTypeEnum.NEXT);
    fetchData(page, pageSize, data, PageTypeEnum.NEXT);
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
        showLast={false}
        options={pageSizeOption}
        pageSize={pageSize}
        pageNum={currentPage}
        pageChange={pageChange}
        pageSizeChange={pageSizeChange}></Table>
    </div>
  );
}
