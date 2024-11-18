import { useAppSelector } from '@_store';
import { Spin } from 'antd';
import clsx from 'clsx';
import { useMemo } from 'react';
import Latest from './Latest';
import { useMobileAll } from '@_hooks/useResponsive';

export default function LatestAll() {
  const { blocks, transactions } = useAppSelector((state) => state.getChainId);

  const isMobile = useMobileAll();

  const mobile = useMemo(() => {
    return isMobile;
  }, [isMobile]);

  return (
    <div className={clsx('latest-all', mobile && 'latest-all-mobile')}>
      <div className="flex-1">
        <Spin spinning={blocks.loading}>
          <Latest iconType="latest-block" title="Latest blocks" isBlocks={true} data={blocks.data}></Latest>
        </Spin>
      </div>
      <div className="flex-1">
        <Spin spinning={transactions.loading}>
          <Latest
            iconType="latest-tx"
            tips={`The most recent transactions on the network, providing real-time data on the latest activity across the aelf MainChain and aelf dAppChain.`}
            title="Latest transactions"
            isBlocks={false}
            data={transactions.data}></Latest>
        </Spin>
      </div>
    </div>
  );
}
