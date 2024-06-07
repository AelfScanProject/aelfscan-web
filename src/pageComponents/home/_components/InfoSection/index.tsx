'use client';
import clsx from 'clsx';
import './index.css';

import IconFont from '@_components/IconFont';
import { addSymbol, thousandsNumber, unitConverter } from '@_utils/formatter';
import { useAppSelector } from '@_store';
import { Skeleton } from 'antd';
import useResponsive, { usePad } from '@_hooks/useResponsive';
const clsPrefix = 'home-info-section';

const InfoSection = () => {
  const { tokenInfo: overview } = useAppSelector((state) => state.getChainId);
  const range = overview?.tokenPriceRate24h || 0;
  const { isMD, isPad } = useResponsive();
  return overview ? (
    isPad && !isMD ? (
      <div className={clsx(`${clsPrefix}`)}>
        <div className={`${clsPrefix}-col-item`}>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-price`)}>
            <div className="home-price flex size-12 items-center justify-center rounded-full bg-[#F7F8FA]">
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
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-height`)}>
            {' '}
            <IconFont type="home-blocks"></IconFont>
            <div className="content">
              <span className="title">Block Height</span>
              <span className="desc">{thousandsNumber(overview.blockHeight)}</span>
            </div>
          </div>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-reward`)}>
            {' '}
            <IconFont type="reward"></IconFont>
            <div className="content">
              <span className="title">Governance Rewards</span>
              <span className="desc">{addSymbol(overview.reward)}</span>
            </div>
          </div>
        </div>
        <div className={`${clsPrefix}-col-item`}>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-transaction`)}>
            {' '}
            <IconFont type="transactions-d6cj46ag"></IconFont>
            <div className="content">
              <span className="title">Transactions</span>
              <div>
                <span className="desc">{unitConverter(overview.transactions, 2)}</span>
                <span className="text-sm leading-[22px] text-base-200">（{overview.tps} TPS）</span>
              </div>
            </div>
          </div>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-accounts`)}>
            {' '}
            <IconFont type="account-d6cj465m"></IconFont>
            <div className="content">
              <span className="title">Accounts</span>
              <span className="desc">{thousandsNumber(overview.accounts)}</span>
            </div>
          </div>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-walfare`)}>
            {' '}
            <IconFont type="welfare"></IconFont>
            <div className="content">
              <span className="title">Citizen Welfare</span>
              <span className="desc">{addSymbol(overview.citizenWelfare)}</span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className={clsx(`${clsPrefix}`, isMD && `${clsPrefix}-mobile`)}>
        <div className={`${clsPrefix}-col-item`}>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-price`)}>
            <div className="home-price flex size-12 items-center justify-center rounded-full bg-[#F7F8FA]">
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
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-height`)}>
            {' '}
            <IconFont type="home-blocks"></IconFont>
            <div className="content">
              <span className="title">Block Height</span>
              <span className="desc">{thousandsNumber(overview.blockHeight)}</span>
            </div>
          </div>
        </div>
        <div className={`${clsPrefix}-col-item`}>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-transaction`)}>
            {' '}
            <IconFont type="transactions-d6cj46ag"></IconFont>
            <div className="content">
              <span className="title">Transactions</span>
              <div>
                <span className="desc">{unitConverter(overview.transactions, 2)}</span>
                <span className="text-sm leading-[22px] text-base-200">（{overview.tps} TPS）</span>
              </div>
            </div>
          </div>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-accounts`)}>
            {' '}
            <IconFont type="account-d6cj465m"></IconFont>
            <div className="content">
              <span className="title">Accounts</span>
              <span className="desc">{thousandsNumber(overview.accounts)}</span>
            </div>
          </div>
        </div>
        <div className={`${clsPrefix}-col-item`}>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-reward`)}>
            {' '}
            <IconFont type="reward"></IconFont>
            <div className="content">
              <span className="title">Governance Rewards</span>
              <span className="desc">{addSymbol(overview.reward)}</span>
            </div>
          </div>
          <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-walfare`)}>
            {' '}
            <IconFont type="welfare"></IconFont>
            <div className="content">
              <span className="title">Citizen Welfare</span>
              <span className="desc">{addSymbol(overview.citizenWelfare)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  ) : (
    <Skeleton active />
  );
};
export default InfoSection;
