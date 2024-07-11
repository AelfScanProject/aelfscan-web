/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 17:28:28
 * @Description: home page
 */
'use client';
import InfoSection from './_components/InfoSection';
import SearchComp from './_components/SearchWithClient';
import clsx from 'clsx';
import './index.css';
import { memo, useMemo } from 'react';
// import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import Latest from './_components/Latest';
import TPSChart from './_components/TPSChart';
import { useMobileAll } from '@_hooks/useResponsive';
const clsPrefix = 'home-container';
import { Skeleton, Spin } from 'antd';
import { useAppSelector } from '@_store';
function Home() {
  const { blocks, transactions, tpsData } = useAppSelector((state) => state.getChainId);
  console.log(blocks, transactions, tpsData, '0000');

  const isMobile = useMobileAll();

  const mobile = useMemo(() => {
    return isMobile;
  }, [isMobile]);

  const OverView = useMemo(() => {
    return <InfoSection></InfoSection>;
  }, []);

  const LatestAll = useMemo(() => {
    return (
      <div className={clsx('latest-all', mobile && 'latest-all-mobile')}>
        <div className="flex-1">
          <Spin spinning={blocks.loading}>
            <Latest iconType="latest-block" isBlocks={true} data={blocks.data}></Latest>
          </Spin>
        </div>
        <div className="flex-1">
          <Spin spinning={transactions.loading}>
            <Latest iconType="latest-tx" isBlocks={false} data={transactions.data}></Latest>
          </Spin>
        </div>
      </div>
    );
  }, [mobile, blocks, transactions]);

  return (
    <main className={clsx(`${clsPrefix}`, mobile && `${clsPrefix}-mobile`)}>
      <div className="banner-section">
        <div className={clsx('banner-img-warp')}></div>
        {/* <Image src={BannerPc} layout="fill" objectFit="contain" priority alt="Picture of the banner"></Image> */}
        <h2>AELF Explorer</h2>
        <div className="search-section">
          <SearchComp isMobile={mobile} />
        </div>
      </div>
      {OverView}
      {LatestAll}
      {!tpsData.loading && tpsData.data ? (
        <TPSChart isMobile={mobile} data={tpsData.data}></TPSChart>
      ) : (
        <Skeleton active />
      )}
      {/* <Link
        className="px-4 py-1 text-sm font-semibold text-purple-600 border border-purple-200 rounded-full hover:text-white hover:bg-base-100 hover:border-transparent "
        href="/address">
        Address
      </Link>
      <Link className="btn-primary" href="/blocks">
        blocks
      </Link> */}
    </main>
  );
}

export default memo(Home);
