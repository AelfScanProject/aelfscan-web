/*
 * @author: Peterbjx
 * @Date: 2023-08-14 15:09:46
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 11:21:44
 * @Description: main container
 */
'use client';
import React, { useMemo } from 'react';
import './index.css';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { usePathname } from 'next/navigation';
const adsPath = ['/AELF/contactusadvertise', '/tDVV/contactusadvertise', '/tDVW/contactusadvertise'];
export const homePath = ['/', '/AELF', '/tDVV', '/tDVW', '/muliChain'];
export default function MainContainer({ children }) {
  const path = usePathname();
  const isMobile = useMobileAll();
  const isHome = useMemo(() => {
    return homePath.includes(path);
  }, [path]);
  const isAds = useMemo(() => {
    return adsPath.includes(path);
  }, [path]);
  return (
    <div
      className={clsx(
        isMobile && 'main-container-mobile',
        'main-container w-full',
        isHome && '!w-full !max-w-full !px-0',
        isAds && '!w-full !max-w-full !px-0 !pb-0',
      )}>
      {children}
    </div>
  );
}
