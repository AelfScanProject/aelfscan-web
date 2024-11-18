'use client';
import clsx from 'clsx';
import './index.css';

import IconFont from '@_components/IconFont';
import { thousandsNumber, unitConverter } from '@_utils/formatter';
import { useAppSelector } from '@_store';
import { Dropdown, Skeleton } from 'antd';
import useResponsive, { useMD } from '@_hooks/useResponsive';
import { useMemo } from 'react';
const clsPrefix = 'home-info-section';

export const MultiDown = ({
  mainCount,
  sideCount,
  children,
}: {
  mainCount?: number;
  sideCount?: number;
  children: React.ReactNode;
}) => {
  const isMd = useMD();
  const items = [
    {
      key: 'main',
      label: (
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <IconFont className="text-base" type="mainChainLogo"></IconFont>
            <div className="text-sm">aelf MainChain</div>
          </div>
          <div className="text-sm  text-muted-foreground">{thousandsNumber(mainCount || 0)}</div>
        </div>
      ),
    },
    {
      key: 'side',
      label: (
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center justify-between gap-1">
            <IconFont className="text-base" type="dappChainLogo"></IconFont>
            <div className="mx-1 text-sm">aelf dAppChain</div>
          </div>
          <div className="text-sm text-muted-foreground">{thousandsNumber(sideCount || 0)}</div>
        </div>
      ),
    },
  ];
  return (
    <Dropdown overlayClassName="multi-count" menu={{ items }} placement={isMd ? 'bottom' : 'bottomLeft'}>
      {children}
    </Dropdown>
  );
};

const InfoSection = () => {
  const { tokenInfo: overview } = useAppSelector((state) => state.getChainId);
  const range = overview?.tokenPriceRate24h || 0;
  const isMd = useMD();
  const { isLG } = useResponsive();
  const transactionsOverview = useMemo(() => {
    const { mainChain, sideChain } = overview?.mergeTransactions || {};
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-transaction`)}>
          <div className="title flex items-center gap-1">
            <div className="text">Toal Transactions</div>
            <IconFont className="text-base" type="square-menu"></IconFont>
          </div>
          <div className="flex items-center">
            <MultiDown mainCount={mainChain} sideCount={sideChain}>
              <span className="desc cursor-pointer text-primary">
                {unitConverter(overview.mergeTransactions.total, 2)}
                <span className="range text-foreground">txns</span>
              </span>
            </MultiDown>
          </div>
        </div>
      )
    );
  }, [overview]);
  const PriceOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-price`)}>
          <div className="title">
            <div className="text"> ELF Price </div>
            <IconFont className="text-base" type="ELF-f6dioc4d"></IconFont>
          </div>
          <span className="desc flex items-center">
            {typeof overview.tokenPriceInUsd === 'number' ? `$${thousandsNumber(overview.tokenPriceInUsd)}` : '-'}
            <span className={clsx('range !ml-[6px]', +range >= 0 ? 'rise' : 'fall')}>
              ({+range >= 0 ? '+' : ''}
              {+range}%)
            </span>
          </span>
        </div>
      )
    );
  }, [overview, range]);

  const marketCapOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-height`)}>
          <div>
            <div className="title">
              <div className="text">Market Cap</div>
              <IconFont className="text-base" type="globe"></IconFont>
            </div>
            <div className="desc">{unitConverter(overview.marketCap, 2)}</div>
          </div>
        </div>
      )
    );
  }, [overview]);
  const accountsOverview = useMemo(() => {
    const { mainChain, sideChain } = overview?.mergeAccounts || {};
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-accounts`)}>
          <div>
            <div className="title">
              <div className="text">Total Accounts</div>
              <IconFont className="text-base" type="users"></IconFont>
            </div>
            <MultiDown mainCount={mainChain} sideCount={sideChain}>
              <span className="desc flex cursor-pointer items-center text-primary">
                {thousandsNumber(overview.mergeAccounts.total)}
              </span>
            </MultiDown>
          </div>
        </div>
      )
    );
  }, [overview]);

  return overview ? (
    <div className={clsx('grid grid-cols-2 gap-4', !isLG && '!grid-cols-4', isMd && '!grid-cols-1')}>
      {PriceOverview}
      {marketCapOverview}
      {accountsOverview}
      {transactionsOverview}
    </div>
  ) : (
    <Skeleton active />
  );
};
export default InfoSection;
