/*
 * @author: Peterbjx
 * @Date: 2023-08-14 15:09:46
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 11:21:44
 * @Description: main container
 */
'use client';
import React from 'react';
import './index.css';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { usePathname } from 'next/navigation';
export default function MainContainer({ children }) {
  const path = usePathname();
  const isMobile = useMobileAll();
  return (
    <div
      className={clsx(
        isMobile && 'main-container-mobile',
        'main-container w-full',
        path !== '/' && isMobile && '!pt-28',
      )}>
      {children}
    </div>
  );
}
