/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 17:28:28
 * @Description: home page
 */
'use client';
import InfoSection from './_components/InfoSection';
import clsx from 'clsx';
import './index.css';
import { memo, useMemo } from 'react';
import { useMobileAll } from '@_hooks/useResponsive';
const clsPrefix = 'home-container';
import ScrollPage from './scrollPage';
import LatestAll from './_components/LatestAll';
import { BannerContainer } from './_components/Banner';

function Home() {
  const isMobile = useMobileAll();

  const mobile = useMemo(() => {
    return isMobile;
  }, [isMobile]);

  const OverView = useMemo(() => {
    return <InfoSection></InfoSection>;
  }, []);

  console.log(33333333333);

  return (
    <main className={clsx(`${clsPrefix}`, mobile && `${clsPrefix}-mobile`, 'relative')}>
      <BannerContainer />
      <ScrollPage />
      <div className="relative z-10 mx-auto box-border w-full max-w-[1440px] px-2 min-769:px-5 min-[993px]:min-w-[200px]">
        {OverView}
      </div>
      <LatestAll />
    </main>
  );
}

export default memo(Home);
