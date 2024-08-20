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
import { memo, useMemo, useState } from 'react';
// import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import Latest from './_components/Latest';
import TPSChart from './_components/TPSChart';
import { useMobileAll } from '@_hooks/useResponsive';
const clsPrefix = 'home-container';
import { Skeleton, Spin } from 'antd';
import { useAppSelector } from '@_store';
import { useEnvContext } from 'next-runtime-env';
import { checkMainNet } from '@_utils/isMainNet';
import { IPageBannerAdsDetail } from '@_api/type';
import { useEffectOnce } from 'react-use';
import { fetchBannerAdsDetail } from '@_api/fetchSearch';
import AdsImage from '@_components/AdsImage';
function Home() {
  const { blocks, transactions, tpsData } = useAppSelector((state) => state.getChainId);

  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);

  const [adsData, setAdsData] = useState<IPageBannerAdsDetail>();

  useEffectOnce(() => {
    fetchBannerAdsDetail({ label: 'home' })
      .then((res) => {
        setAdsData(res);
      })
      .catch(() => {
        setAdsData(undefined);
      });
  });

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
    <main className={clsx(`${clsPrefix}`, mobile && `${clsPrefix}-mobile`, 'relative')}>
      <div className={`banner-section-container z-8 relative w-full ${!isMainNet && 'banner-section-container-test'}`}>
        <div className="banner-section z-8 relative flex justify-start">
          <div className="w-full flex-00auto md:w-[75%] min-[993px]:w-[58.333%]">
            <h2 className={`${!isMainNet && '!text-base-100'}`}>AELF Explorer</h2>
            <div className="search-section mt-4">
              <SearchComp isMobile={mobile} />
            </div>
          </div>
          <div className="mx-auto hidden w-auto flex-00auto items-center justify-center min-[993px]:flex">
            {adsData && <AdsImage adPage="home" onlyMobile adsItem={adsData} />}
          </div>
        </div>
      </div>

      <div className="mx-auto box-border w-full max-w-[1440px] px-4 min-[769px]:px-6 min-[993px]:min-w-[200px] min-[993px]:px-10">
        {OverView}
      </div>
      <div className="mt-4 min-[993px]:hidden">{adsData && <AdsImage adPage="home" adsItem={adsData} />}</div>
      {LatestAll}
      <div className="mx-auto box-border w-full max-w-[1440px] px-4 min-[769px]:px-6 min-[993px]:min-w-[200px] min-[993px]:px-10">
        {!tpsData.loading && tpsData.data ? (
          <TPSChart isMobile={mobile} data={tpsData.data}></TPSChart>
        ) : (
          <Skeleton className="w-full" active />
        )}
      </div>
    </main>
  );
}

export default memo(Home);
