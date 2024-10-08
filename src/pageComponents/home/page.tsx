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
import Latest from './_components/Latest';
import TPSChart from './_components/TPSChart';
import { useMobileAll } from '@_hooks/useResponsive';
const clsPrefix = 'home-container';
import { Skeleton, Spin } from 'antd';
import { useAppSelector } from '@_store';
import { useEnvContext } from 'next-runtime-env';
import { checkMainNet } from '@_utils/isMainNet';
import { IPageBannerAdsDetail, ITopTokensItem } from '@_api/type';
import { useEffectOnce } from 'react-use';
import { fetchBannerAdsDetail } from '@_api/fetchSearch';
import AdsImage from '@_components/AdsImage';
import { MULTI_CHAIN } from '@_utils/contant';

function Home() {
  const { blocks, transactions, tpsData, defaultChain, tokens } = useAppSelector((state) => state.getChainId);

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

  const multi = useMemo(() => {
    return defaultChain === MULTI_CHAIN;
  }, [defaultChain]);

  const OverView = useMemo(() => {
    return <InfoSection multi={multi}></InfoSection>;
  }, [multi]);

  const LatestAll = useMemo(() => {
    return (
      <div className={clsx('latest-all', mobile && 'latest-all-mobile')}>
        {multi ? (
          <div className="flex-1">
            <Spin spinning={tokens.loading}>
              <Latest
                iconType="latest-tokens"
                title="Hot Tokens"
                isBlocks={false}
                tips={`The tokens with the highest number of holding addresses on the network, indicating the most popular and widely held assets within the ecosystem.`}
                data={tokens.data as ITopTokensItem[]}></Latest>
            </Spin>
          </div>
        ) : (
          <div className="flex-1">
            <Spin spinning={blocks.loading}>
              <Latest iconType="latest-block" title="Latest Blocks" isBlocks={true} data={blocks.data}></Latest>
            </Spin>
          </div>
        )}
        <div className="flex-1">
          <Spin spinning={transactions.loading}>
            <Latest
              iconType="latest-tx"
              tips={`The most recent transactions on the network, providing real-time data on the latest activity across the MainChain and SideChain.`}
              title="Latest Transactions"
              isBlocks={false}
              data={transactions.data}></Latest>
          </Spin>
        </div>
      </div>
    );
  }, [mobile, blocks, multi, transactions, tokens]);

  const title = useMemo(() => {
    const multi = defaultChain === MULTI_CHAIN;
    if (multi) {
      return 'AELF Explorer';
    }
    if (isMainNet) {
      return defaultChain === 'AELF' ? 'AELF MainChain Explorer' : `AELF SideChain (${defaultChain}) Explorer `;
    } else {
      return defaultChain === 'AELF'
        ? 'AELF MainChain Testnet Explorer'
        : `AELF SideChain (${defaultChain}) Testnet Explorer `;
    }
  }, [isMainNet, defaultChain]);

  return (
    <main className={clsx(`${clsPrefix}`, mobile && `${clsPrefix}-mobile`, 'relative')}>
      <div className={`banner-section-container z-8 relative w-full ${!isMainNet && 'banner-section-container-test'}`}>
        <div className="banner-section z-8 relative flex justify-start">
          <div className="w-full flex-00auto md:w-[75%] min-[993px]:w-[58.333%]">
            <h2 className={`${!isMainNet && '!text-base-100'}`}>{title}</h2>
            {multi && (
              <h3 className={`${!isMainNet && '!text-base-100'} text-sm leading-[22px]`}>
                Supporting MainChain and SideChain({isMainNet ? 'tDVV' : 'tDVW'})
              </h3>
            )}
            <div className="search-section my-4 min-[996px]:mb-10">
              <SearchComp isMobile={mobile} />
            </div>
          </div>
          <div className="mx-auto hidden w-auto flex-00auto items-center justify-center min-[993px]:flex">
            {adsData && adsData.adsBannerId && <AdsImage adPage="home" onlyMobile adsItem={adsData} />}
          </div>
        </div>
      </div>

      <div className="mx-auto box-border w-full max-w-[1440px] px-4 min-[769px]:px-6 min-[993px]:min-w-[200px] min-[993px]:px-10">
        {OverView}
      </div>
      {adsData && adsData.adsBannerId && (
        <div className="mt-4 min-[993px]:hidden">
          <AdsImage adPage="home" adsItem={adsData} />
        </div>
      )}
      {LatestAll}
      {!multi && (
        <div className="mx-auto box-border w-full max-w-[1440px] px-4 min-[769px]:px-6 min-[993px]:min-w-[200px] min-[993px]:px-10">
          {!tpsData.loading && tpsData.data ? (
            <TPSChart isMobile={mobile} data={tpsData.data}></TPSChart>
          ) : (
            <Skeleton className="w-full" active />
          )}
        </div>
      )}
    </main>
  );
}

export default memo(Home);
