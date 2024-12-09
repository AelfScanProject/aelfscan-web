'use client';
import clsx from 'clsx';
import './index.css';

import IconFont from '@_components/IconFont';
import { thousandsNumber, unitConverter } from '@_utils/formatter';
import { useAppSelector } from '@_store';
import { Dropdown, Skeleton } from 'antd';
import useResponsive, { useBreakpointMD } from '@_hooks/useResponsive';
import { useMemo } from 'react';
const clsPrefix = 'home-info-section';

export const MultiDown = ({
  mainCount,
  sideCount,
  children,
  dolar,
}: {
  mainCount: number | string;
  sideCount: number | string;
  dolar?: boolean;
  children: React.ReactNode;
}) => {
  const items = [
    {
      key: 'main',
      label: (
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <IconFont className="text-base" type="mainChainLogo"></IconFont>
            <div className="text-sm">aelf MainChain</div>
          </div>
          <div className="text-sm  text-muted-foreground">
            {dolar && thousandsNumber(mainCount) !== '--' && '$'}
            {thousandsNumber(mainCount)}
          </div>
        </div>
      ),
    },
    {
      key: 'side',
      label: (
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center justify-between gap-1">
            <IconFont className="text-base" type="dappChainLogo"></IconFont>
            <div className="text-sm">aelf dAppChain</div>
          </div>
          <div className="text-sm text-muted-foreground">
            {dolar && thousandsNumber(sideCount) !== '--' && '$'}
            {thousandsNumber(sideCount)}
          </div>
        </div>
      ),
    },
  ];
  return (
    <Dropdown overlayClassName="multi-count" menu={{ items }} placement="top">
      {children}
    </Dropdown>
  );
};

const InfoSection = () => {
  const { tokenInfo: overview } = useAppSelector((state) => state.getChainId);
  const range = overview?.tokenPriceRate24h || 0;
  const isMd = useBreakpointMD();
  const { isLG } = useResponsive();
  const transactionsOverview = useMemo(() => {
    const { mainChain, sideChain } = overview?.mergeTransactions || {};
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-transaction`, isMd && `${clsPrefix}-row-item-md`)}>
          <div className="title flex items-center gap-1">
            <div className="text">Total Transactions</div>
            <IconFont className="text-base" type="square-menu"></IconFont>
          </div>
          <div className="flex items-center">
            <MultiDown mainCount={mainChain as number} sideCount={sideChain as number}>
              <span className="desc cursor-pointer text-primary">
                {unitConverter(overview.mergeTransactions.total, 2)}
                <span className="range text-foreground">txns</span>
              </span>
            </MultiDown>
          </div>
        </div>
      )
    );
  }, [isMd, overview]);
  const PriceOverview = useMemo(() => {
    return (
      overview && (
        <div
          className={clsx(
            `${clsPrefix}-row-item`,
            `${clsPrefix}-price`,
            isMd && `${clsPrefix}-row-item-md`,
            !isLG && `${clsPrefix}-row-item-lg`,
          )}>
          <div className={`border-r border-solid ${isMd ? 'border-r-0 pr-0' : 'pr-6'}`}>
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
        </div>
      )
    );
  }, [isLG, isMd, overview, range]);

  const marketCapOverview = useMemo(() => {
    return (
      overview && (
        <div
          className={clsx(
            `${clsPrefix}-row-item`,
            `${clsPrefix}-height`,
            isMd && `${clsPrefix}-row-item-md`,
            !isLG && `${clsPrefix}-row-item-lg`,
          )}>
          <div className={`${!isLG && 'border-r border-solid pr-6'}`}>
            <div className="title">
              <div className="text">Market Cap</div>
              <IconFont className="text-base" type="globe"></IconFont>
            </div>
            <div className="desc">{unitConverter(overview.marketCap, 2)}</div>
          </div>
        </div>
      )
    );
  }, [isLG, isMd, overview]);
  const accountsOverview = useMemo(() => {
    const { mainChain, sideChain } = overview?.mergeAccounts || {};
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-accounts`, isMd && `${clsPrefix}-row-item-md`)}>
          <div className={`border-r border-solid ${isMd ? 'border-r-0 pr-0' : 'pr-6'}`}>
            <div className="title">
              <div className="text">Total Accounts</div>
              <IconFont className="text-base" type="users"></IconFont>
            </div>
            <MultiDown mainCount={mainChain as number} sideCount={sideChain as number}>
              <span className="desc cursor-pointer text-primary">{thousandsNumber(overview.mergeAccounts.total)}</span>
            </MultiDown>
          </div>
        </div>
      )
    );
  }, [isMd, overview]);

  return overview ? (
    <div
      className={clsx(
        'grid grid-cols-2 overflow-hidden rounded-lg border border-solid border-border bg-secondary',
        !isLG && '!grid-cols-4',
        isMd && '!grid-cols-1',
      )}>
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
