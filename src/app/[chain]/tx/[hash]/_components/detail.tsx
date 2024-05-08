'use client';
import HeadTitle from '@_components/HeaderTitle';
import JumpButton, { JumpTypes } from '@_components/JumpButton';
import { useRouter } from 'next/navigation';
import './detail.css';
import { useCallback, useState } from 'react';
import { TabsProps } from 'antd';
import BaseInfo from './baseInfo';
import MoreContainer from '@_components/MoreContainer';
import ExtensionInfo from './ExtensionInfo';
import LogsContainer from '@_components/LogsContainer';
import EPTabs from '@_components/EPTabs';
import { ITransactionDetailData } from '@_api/type';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';

export default function Detail({ SSRData }: { SSRData: ITransactionDetailData }) {
  console.log(SSRData, 'SSRData');
  const router = useRouter();
  const [detailData] = useState(SSRData);
  const isFirst = detailData.transactionId === '';
  const isLast = detailData.transactionId === '';
  const jump = (type: JumpTypes) => {
    switch (type) {
      case JumpTypes.Prev:
        router.push(`/tx/${detailData.transactionId}`);
        break;
      case JumpTypes.Next:
        router.push(`/tx/${detailData.transactionId}`);
    }
  };
  const [showMore, setShowMore] = useState<boolean>(false);
  const moreChange = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);
  const items: TabsProps['items'] = [
    {
      key: '',
      label: 'Overview',
      children: (
        <div className="overview-container">
          <BaseInfo data={detailData} />
          {showMore && <ExtensionInfo data={detailData} />}
          <MoreContainer diver={true} showMore={showMore} onChange={moreChange} />
        </div>
      ),
    },
    {
      key: 'logs',
      label: (
        <div>
          Logs<span className="ml-[2px]">({detailData.logEvents.length})</span>
        </div>
      ),
      children: (
        <div>
          <div className="px-4 py-2 text-sm leading-[22px] text-base-100">
            <EPTooltip title="Transaction Receipt Event Logs" mode={'dark'}>
              <IconFont className="text-sm" style={{ marginRight: '4px' }} type="question-circle" />
            </EPTooltip>
            Transaction Receipt Event Logs
          </div>
          <LogsContainer Logs={detailData.logEvents} />
        </div>
      ),
    },
  ];

  return (
    <div className="tx-detail-container">
      <HeadTitle content="Transactions">{/* <JumpButton isFirst={isFirst} isLast={isLast} jump={jump} /> */}</HeadTitle>
      <div className="detail-table">
        <EPTabs items={items} />
      </div>
    </div>
  );
}
