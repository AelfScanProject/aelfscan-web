/*
 * @author: Peterbjx
 * @Date: 2023-08-16 18:51:11
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:05:43
 * @Description:
 */
'use client';
import clsx from 'clsx';
import HeadTitle from '@_components/HeaderTitle';
import { useMemo, useState, useCallback } from 'react';
import './detail.css';
import BaseInfo from './baseinfo';
import ExtensionInfo from './ExtensionInfo';
import type { ITabsProps } from 'aelf-design';
import Table from '@_components/Table';
import getColumns from '@app/[chain]/transactions/columnConfig';
import { ColumnsType } from 'antd/es/table';
import MoreContainer from '@_components/MoreContainer';
import EPTabs from '@_components/EPTabs';
import { useMobileAll } from '@_hooks/useResponsive';
import { IBlocksDetailData, ITransactionsResponseItem } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';
import { useParams } from 'next/navigation';
import { useEffectOnce } from 'react-use';

export default function Detail({ SSRData }) {
  const isMobile = useMobileAll();
  const [detailData] = useState<IBlocksDetailData>(SSRData);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [total] = useState<number>(SSRData?.transactions?.length);
  const [timeFormat, setTimeFormat] = useState<string>('Age');

  const { chain } = useParams();
  const columns = useMemo<ColumnsType<ITransactionsResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      chainId: chain as string,
      type: 'block',
    });
  }, [chain, timeFormat]);

  const multiTitle = `More than > ${total} transactions found`;

  const multiTitleDesc = `Showing the last 500k records`;

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const [activeKey, setActiveKey] = useState<string>('');
  useEffectOnce(() => {
    setActiveKey(window.location.hash.replace('#', ''));
  });

  const tabChange = (key) => {
    setActiveKey(key);
  };

  const tableData = useMemo(() => {
    const transactions = detailData?.transactions || [];
    return transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [currentPage, detailData?.transactions, pageSize]);

  const moreChange = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);
  const items: ITabsProps['items'] = [
    {
      key: '',
      label: 'Overview',
      children: (
        <div className="overview-container pb-4">
          <BaseInfo data={detailData} tabChange={tabChange} />
          {showMore && <ExtensionInfo data={detailData} />}
          <MoreContainer showMore={showMore} onChange={moreChange} />
        </div>
      ),
    },
    {
      key: 'txns',
      label: 'Transactions',
      children: (
        <Table
          headerTitle={{
            multi: {
              title: multiTitle,
              desc: multiTitleDesc,
            },
          }}
          dataSource={tableData}
          columns={columns}
          isMobile={isMobile}
          options={pageSizeOption}
          rowKey="transactionId"
          total={total}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      ),
    },
  ];

  return (
    <div className={clsx('token-detail-container')}>
      <HeadTitle content="Blocks">
        <span className="ml-2 block text-sm leading-[22px] text-base-200">#{detailData?.blockHeight}</span>
      </HeadTitle>

      <div className="detail-table">
        <EPTabs selectKey={activeKey} items={items} onTabChange={tabChange} />
      </div>
    </div>
  );
}
