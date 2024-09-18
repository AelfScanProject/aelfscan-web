'use client';
import clsx from 'clsx';
import './index.css';

import IconFont from '@_components/IconFont';
import { addSymbol, thousandsNumber, unitConverter } from '@_utils/formatter';
import { useAppSelector } from '@_store';
import { Dropdown, Skeleton } from 'antd';
import useResponsive from '@_hooks/useResponsive';
import { useMemo } from 'react';
import { useSideChain } from '@_hooks/useSelectChain';
const clsPrefix = 'home-info-section';

const MultiDown = ({
  mainCount,
  sideCount,
  tps,
}: {
  mainCount?: number;
  sideCount?: number;
  tps?: {
    main?: string;
    side?: string;
  };
}) => {
  const sideChain = useSideChain();
  const items = [
    {
      key: 'main',
      label: (
        <div className="flex items-center">
          <IconFont type="mainchain"></IconFont>
          <div className="ml-1 mr-2 text-sm leading-[22px] text-base-100">MainChain</div>
          <div className="text-sm leading-[22px] text-base-200">{thousandsNumber(mainCount || 0)}</div>
          {tps && <span className="text-sm leading-[22px] text-base-200">({tps?.main} TPS)</span>}
        </div>
      ),
    },
    {
      key: 'side',
      label: (
        <div className="flex items-center">
          <IconFont type="sidechain"></IconFont>
          <div className="ml-1 mr-2 text-sm leading-[22px] text-base-100">SideChain({sideChain})</div>
          <div className="text-sm leading-[22px] text-base-200">{thousandsNumber(sideCount || 0)}</div>
          {tps && <span className="text-sm leading-[22px] text-base-200">({tps?.side} TPS)</span>}
        </div>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <IconFont className="Direction-Down ml-[6px]" color="#858585" type="Direction-Down"></IconFont>
    </Dropdown>
  );
};

const InfoSection = ({ multi }: { multi: boolean }) => {
  const { tokenInfo: overview } = useAppSelector((state) => state.getChainId);
  const range = overview?.tokenPriceRate24h || 0;
  const { isMD, isPad } = useResponsive();

  const transactionsOverview = useMemo(() => {
    const { mainChain, sideChain } = overview?.mergeTransactions || {};
    const { mainChain: mainTps, sideChain: sideTps } = overview?.mergeTps || {};
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-transaction`)}>
          <IconFont type="transactions-d6cj46ag"></IconFont>
          <div className="content">
            <span className="title">Transactions</span>
            <div className="flex items-center">
              <span className="desc">{unitConverter(overview.mergeTransactions.total, 2)}</span>
              <span className="ml-[6px] text-sm leading-[22px] text-base-200">({overview.mergeTps.total} TPS)</span>
              {multi && (
                <MultiDown mainCount={mainChain} sideCount={sideChain} tps={{ main: mainTps, side: sideTps }} />
              )}
            </div>
          </div>
        </div>
      )
    );
  }, [multi, overview]);
  const PriceOverview = useMemo(() => {
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-price`)}>
          <div className="home-price flex size-12 items-center justify-center rounded-full bg-F7">
            <IconFont width={24} height={24} type="ELF"></IconFont>
          </div>
          <div className="content">
            <span className="title">ELF Price</span>
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
          <IconFont type="MarketCap"></IconFont>
          <div className="content">
            <span className="title">Market Cap</span>
            <span className="desc">{unitConverter(overview.marketCap, 2)}</span>
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
          <IconFont type="account-d6cj465m"></IconFont>
          <div className="content">
            <span className="title">{multi ? 'Total Account' : 'Accounts'}</span>
            <span className="desc flex items-center">
              {thousandsNumber(overview.mergeAccounts.total)}
              {multi && <MultiDown mainCount={mainChain} sideCount={sideChain} />}
            </span>
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
    const { mainChain, sideChain } = overview?.mergeTokens || {};
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-reward`)}>
          <IconFont type="Token"></IconFont>
          <div className="content">
            <span className="title">Tokens</span>
            <span className="desc flex items-center">
              {overview.mergeTokens.total}
              {multi && <MultiDown mainCount={mainChain} sideCount={sideChain} />}
            </span>
          </div>
        </div>
      )
    );
  }, [multi, overview]);
  const nftsOverview = useMemo(() => {
    const { mainChain, sideChain } = overview?.mergeNfts || {};
    return (
      overview && (
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-reward`)}>
          <IconFont type="NFT"></IconFont>
          <div className="content">
            <span className="title">NFTs</span>
            <span className="desc">
              {overview.mergeNfts.total}
              {multi && <MultiDown mainCount={mainChain} sideCount={sideChain} />}
            </span>
          </div>
        </div>
      )
    );
  }, [multi, overview]);
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
