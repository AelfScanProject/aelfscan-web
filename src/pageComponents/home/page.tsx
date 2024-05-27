/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 17:28:28
 * @Description: home page
 */
'use client';
import Image from 'next/image';
import InfoSection from './_components/InfoSection';
import SearchComp from './_components/SearchWithClient';
import clsx from 'clsx';
import './index.css';
import { useMemo } from 'react';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { IOverviewSSR } from './type';
// import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import Latest from './_components/Latest';
import TPSChart from './_components/TPSChart';
import { useMobileAll } from '@_hooks/useResponsive';
const BannerPc = '/image/banner_pc.png';
const BannerMobile = '/image/banner_mobile.png';
const clsPrefix = 'home-container';
import { Skeleton, Spin } from 'antd';
import { useAppSelector } from '@_store';
import { useSearchParams } from 'next/navigation';
import useHomeSocket from '@_hooks/useHomeSocket';
import { TChainID } from '@_api/type';
interface IProps {
  overviewSSR: IOverviewSSR;
}
const getConnectionBuilder = (url: string) => {
  const connect = new HubConnectionBuilder()
    .withUrl(url, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    // .withHubProtocol(new MessagePackHubProtocol())
    .withAutomaticReconnect()
    .build();
  return connect;
};
export default function Home({ overviewSSR }: IProps) {
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const searchParams = useSearchParams();
  const chain = searchParams.get('chainId') || defaultChain;

  const { blocks, blocksLoading, transactionsLoading, tpsData, transactions } = useHomeSocket(chain as TChainID);

  const isMobile = useMobileAll();

  const OverView = useMemo(() => {
    return <InfoSection isMobile={isMobile}></InfoSection>;
  }, [isMobile]);

  const LatestAll = useMemo(() => {
    return (
      <div className={clsx('latest-all', isMobile && 'latest-all-mobile')}>
        <div className="flex-1">
          <Spin spinning={blocksLoading}>
            <Latest iconType="latest-block" isBlocks={true} data={blocks} isMobile={isMobile}></Latest>
          </Spin>
        </div>
        <div className="flex-1">
          <Spin spinning={transactionsLoading}>
            <Latest iconType="latest-tx" isBlocks={false} data={transactions} isMobile={isMobile}></Latest>
          </Spin>
        </div>
      </div>
    );
  }, [isMobile, blocksLoading, blocks, transactionsLoading, transactions]);

  return (
    <main className={clsx(`${clsPrefix}`, isMobile && `${clsPrefix}-mobile`)}>
      <div className="banner-section">
        {isMobile ? (
          <Image
            src={BannerMobile}
            layout="fill"
            objectFit="contain"
            objectPosition={'0 top'}
            priority
            alt="Picture of the banner mobile"></Image>
        ) : (
          <Image src={BannerPc} layout="fill" objectFit="contain" priority alt="Picture of the banner"></Image>
        )}
        <h2>AELF Explorer</h2>
        <div className="search-section">
          <SearchComp isMobile={isMobile} />
        </div>
      </div>
      {OverView}
      {LatestAll}
      {tpsData ? <TPSChart isMobile={isMobile} data={tpsData}></TPSChart> : <Skeleton active />}
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
