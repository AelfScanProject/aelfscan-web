'use client';
import clsx from 'clsx';
import './index.css';

import IconFont from '@_components/IconFont';
import { addSymbol, thousandsNumber, unitConverter } from '@_utils/formatter';
import { useAppSelector } from '@_store';
import { Skeleton } from 'antd';
import useResponsive from '@_hooks/useResponsive';
import { useMemo } from 'react';
const clsPrefix = 'home-info-section';

const InfoSection = ({ multi }: { multi: boolean }) => {
  const { tokenInfo: overview } = useAppSelector((state) => state.getChainId);
  const range = overview?.tokenPriceRate24h || 0;
  const { isMD, isPad } = useResponsive();

  const transactionsOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-transaction`)}>
          <IconFont type="transactions-d6cj46ag"></IconFont>
          <div className="content">
            <span className="title">Transactions</span>
            <div>
              <span className="desc">{unitConverter(overview.mergeTransactions.total, 2)}</span>
              <span className="text-sm leading-[22px] text-base-200">（{overview.mergeTps.total} TPS）</span>
            </div>
          </div>
        </div>
      )
    );
  }, [overview]);
  const PriceOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-price`)}>
          <div className="home-price flex size-12 items-center justify-center rounded-full bg-F7">
            <IconFont width={24} height={24} type="ELF"></IconFont>
          </div>
          <div className="content">
            <span className="title">ELF Price</span>
            <span className="desc">
              {typeof overview.tokenPriceInUsd === 'number' ? `$${thousandsNumber(overview.tokenPriceInUsd)}` : '-'}
              <span className={clsx('range', +range >= 0 ? 'rise' : 'fall')}>
                ({+range >= 0 ? '+' : ''}
                {+range}%)
              </span>
            </span>
          </div>
        </div>
      )
    );
  }, [overview, range]);

  const blockHeightOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-height`)}>
          <IconFont type="home-blocks"></IconFont>
          <div className="content">
            <span className="title">Block Height</span>
            <span className="desc">{thousandsNumber(overview.blockHeight)}</span>
          </div>
        </div>
      )
    );
  }, [overview]);

  const marketCapOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-height`)}>
          <IconFont type="reward"></IconFont>
          <div className="content">
            <span className="title">Market Cap</span>
            <span className="desc">{unitConverter(overview.marketCap, 2)}</span>
          </div>
        </div>
      )
    );
  }, [overview]);
  const accountsOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-accounts`)}>
          <IconFont type="account-d6cj465m"></IconFont>
          <div className="content">
            <span className="title">{multi ? 'Total Account' : 'Accounts'}</span>
            <span className="desc">{thousandsNumber(overview.mergeAccounts.total)}</span>
          </div>
        </div>
      )
    );
  }, [multi, overview]);
  const rewardsOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-reward`)}>
          <IconFont type="reward"></IconFont>
          <div className="content">
            <span className="title">Governance Rewards</span>
            <span className="desc">{addSymbol(overview.reward)}</span>
          </div>
        </div>
      )
    );
  }, [overview]);
  const tokensOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-reward`)}>
          <IconFont type="reward"></IconFont>
          <div className="content">
            <span className="title">Tokens</span>
            <span className="desc">{overview.mergeTokens.total}</span>
          </div>
        </div>
      )
    );
  }, [overview]);
  const nftsOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-reward`)}>
          <IconFont type="reward"></IconFont>
          <div className="content">
            <span className="title">NFTs</span>
            <span className="desc">{overview.mergeNfts.total}</span>
          </div>
        </div>
      )
    );
  }, [overview]);
  const welfareOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-walfare`)}>
          <IconFont type="welfare"></IconFont>
          <div className="content">
            <span className="title">Citizen Welfare</span>
            <span className="desc">{addSymbol(overview.citizenWelfare)}</span>
          </div>
        </div>
      )
    );
  }, [overview]);

  return overview ? (
    isPad && !isMD ? (
      <div className={clsx(`${clsPrefix}`)}>
        <div className={`${clsPrefix}-col-item`}>
          {PriceOverview}
          {multi ? transactionsOverview : blockHeightOverview}
          {multi ? accountsOverview : rewardsOverview}
        </div>
        <div className={`${clsPrefix}-col-item`}>
          {multi ? marketCapOverview : transactionsOverview}
          {multi ? tokensOverview : accountsOverview}
          {multi ? nftsOverview : welfareOverview}
        </div>
      </div>
    ) : (
      <div className={clsx(`${clsPrefix}`, isMD && `${clsPrefix}-mobile`)}>
        <div className={`${clsPrefix}-col-item`}>
          {PriceOverview}
          {multi ? transactionsOverview : blockHeightOverview}
        </div>
        <div className={`${clsPrefix}-col-item`}>
          {multi ? marketCapOverview : transactionsOverview}
          {multi ? tokensOverview : accountsOverview}
        </div>
        <div className={`${clsPrefix}-col-item`}>
          {multi ? accountsOverview : rewardsOverview}
          {multi ? nftsOverview : welfareOverview}
        </div>
      </div>
    )
  ) : (
    <Skeleton active />
  );
};
export default InfoSection;
