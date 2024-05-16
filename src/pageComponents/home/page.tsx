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
import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { IOverviewSSR } from './type';
// import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import Latest from './_components/Latest';
import TPSChart from './_components/TPSChart';
import tpsData from './mock';
import { useMobileAll } from '@_hooks/useResponsive';
const BannerPc = '/image/banner_pc.png';
const BannerMobile = '/image/banner_mobile.png';
const clsPrefix = 'home-container';
import { useEnvContext } from 'next-runtime-env';
import { Col, Row, Skeleton, Spin } from 'antd';
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
  const searchParmas = useSearchParams();
  const chain = searchParmas.get('chainId') || defaultChain;

  const { blocks, blocksLoading, transactionsLoading, transactions, BlockchainOverview, overviewLoading } =
    useHomeSocket(chain as TChainID);

  const isMobile = useMobileAll();

  const OverView: React.FC = () => {
    return BlockchainOverview && !overviewLoading ? (
      <InfoSection isMobile={isMobile} overview={BlockchainOverview}></InfoSection>
    ) : (
      <Skeleton active />
    );
  };

  const LatestAll = () => {
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
  };

  const Chart = () => {
    const data = tpsData;
    return <TPSChart isMobile={isMobile} data={data}></TPSChart>;
  };

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
      <OverView></OverView>
      <LatestAll></LatestAll>
      {/* <Chart></Chart> */}
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
