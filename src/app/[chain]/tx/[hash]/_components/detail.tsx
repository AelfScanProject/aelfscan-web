'use client';
import HeadTitle from '@_components/HeaderTitle';
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
import CommonEmpty from '@_components/Table/empty';
import { useSearchParams } from 'next/navigation';

export default function Detail({ SSRData }: { SSRData: ITransactionDetailData }) {
  console.log(SSRData, 'SSRData');
  const [detailData] = useState(SSRData);
  const [showMore, setShowMore] = useState<boolean>(false);
  const moreChange = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);

  const params = useSearchParams();
  const tabName = params.get('tab');

  const [activeKey, setActiveKey] = useState<string>(tabName || '');

  const tabChange = (key) => {
    setActiveKey(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '',
      label: 'Overview',
      children: (
        <div className="overview-container pb-4">
          <BaseInfo data={detailData} />
        </div>
      ),
    },
    {
      key: 'logs',
      label: (
        <div>
          Logs<span className="ml-[2px]">({detailData.logEvents?.length})</span>
        </div>
      ),
      children: (
        <div>
          {detailData.logEvents?.length ? (
            <>
              <div className="px-4 py-2 text-base text-muted-foreground">
                <EPTooltip title="Transaction Receipt Event Logs" mode={'dark'}>
                  <IconFont className="text-base" style={{ marginRight: '4px' }} type="circle-help" />
                </EPTooltip>
                Transaction Receipt Event Logs
              </div>
              <LogsContainer Logs={detailData.logEvents} />
            </>
          ) : (
            <div className="pb-4">
              <CommonEmpty type="nodata" />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="tx-detail-container">
      <div className="pb-3">
        <HeadTitle content="Transaction Details" adPage="txndetail"></HeadTitle>
      </div>
      <div className="detail-table">
        <EPTabs selectKey={activeKey} items={items} onTabChange={tabChange} />
        {activeKey !== 'logs' && (
          <div className="mt-[10px] rounded-lg border border-border bg-white py-3 shadow-card_box">
            {showMore && <ExtensionInfo data={detailData} />}
            <MoreContainer showMore={showMore} onChange={moreChange} />
          </div>
        )}
      </div>
    </div>
  );
}
