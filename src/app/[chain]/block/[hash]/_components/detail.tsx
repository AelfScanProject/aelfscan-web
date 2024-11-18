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
import { IBlocksDetailData, ITransactionsResponseItem, TChainID } from '@_api/type';
import { pageSizeOption } from '@_utils/contant';
import { useParams, useSearchParams } from 'next/navigation';
import { JumpTypes } from '@_components/JumpButton';
import { fetchBlocksDetail } from '@_api/fetchBlocks';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';

export default function Detail({ SSRData }) {
  const isMobile = useMobileAll();
  const [detailData, setDetailData] = useState<IBlocksDetailData>(SSRData);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [total] = useState<number>(SSRData?.transactions?.length);
  const [timeFormat, setTimeFormat] = useState<string>('Age');
  const [loading, setLoading] = useState<boolean>(false);

  const { chain } = useParams();
  const jump = useCallback(
    async (type: JumpTypes) => {
      let blockHeight;
      switch (type) {
        case JumpTypes.Prev:
          blockHeight = detailData.preBlockHeight;
          history.pushState(null, '', `/${detailData.chainId}/block/${detailData.preBlockHeight}`);
          break;
        case JumpTypes.Next:
          history.pushState(null, '', `/${detailData.chainId}/block/${detailData.nextBlockHeight}`);
          blockHeight = detailData.nextBlockHeight;
      }

      setLoading(true);
      setShowMore(false);
      setCurrentPage(1);
      try {
        const res = await fetchBlocksDetail({
          blockHeight: blockHeight,
          chainId: chain as TChainID,
        });
        setDetailData(res);
      } finally {
        setLoading(false);
      }
    },
    [chain, detailData],
  );

  console.log(SSRData, 'SSRData');
  const columns = useMemo<ColumnsType<ITransactionsResponseItem>>(() => {
    return getColumns({
      timeFormat,
      handleTimeChange: () => {
        setTimeFormat(timeFormat === 'Age' ? 'Date Time (UTC)' : 'Age');
      },
      type: 'block',
      chainId: chain as string,
    });
  }, [chain, timeFormat]);

  const multiTitle = `${total} transactions found`;

  const pageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageSizeChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const params = useSearchParams();
  const tabName = params.get('tab');

  const [activeKey, setActiveKey] = useState<string>(tabName || '');

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
      children: loading ? (
        <div className="px-2">
          <PageLoadingSkeleton />
        </div>
      ) : (
        <div className="overview-container pb-4">
          <BaseInfo data={detailData} tabChange={tabChange} jump={jump} />
        </div>
      ),
    },
    {
      key: 'transactions',
      label: 'Transactions',
      children: (
        <Table
          headerTitle={{
            single: {
              title: multiTitle,
            },
          }}
          dataSource={tableData}
          columns={columns}
          isMobile={isMobile}
          options={pageSizeOption}
          rowKey="transactionId"
          total={total}
          bordered={false}
          loading={loading}
          pageSize={pageSize}
          pageNum={currentPage}
          pageChange={pageChange}
          pageSizeChange={pageSizeChange}></Table>
      ),
    },
  ];

  return (
    <div className={clsx('token-detail-container')}>
      <HeadTitle content="Blocks" adPage="blockdetail">
        <span className="ml-2 block text-sm text-muted-foreground">#{detailData?.blockHeight}</span>
      </HeadTitle>

      <div className="detail-table mt-3">
        <EPTabs selectKey={activeKey} items={items} onTabChange={tabChange} />
        {activeKey !== 'transactions' && (
          <div className="mt-[10px] rounded-lg border border-border bg-white py-3 shadow-card_box">
            {showMore && <ExtensionInfo data={detailData} />}
            <MoreContainer showMore={showMore} onChange={moreChange} />
          </div>
        )}
      </div>
    </div>
  );
}
