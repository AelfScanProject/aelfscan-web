'use client';
import React, { useEffect, useMemo, useState } from 'react';
import HeaderTop from '@_components/HeaderTop';
import HeaderMenu from '@_components/HeaderMenu';
import './index.css';
import clsx from 'clsx';
import { usePad } from '@_hooks/useResponsive';
import { useAppDispatch } from '@_store';
import { setChainArr } from '@_store/features/chainIdSlice';
import { usePathname } from 'next/navigation';
import { useMultiChain } from '@_hooks/useSelectChain';
import { cloneDeep } from 'lodash';

const clsPrefix = 'header-container';
export default function Header({ chainList, networkList, headerMenuList }) {
  const isPad = usePad();
  const chainArr = chainList.map((ele) => ele.chainList_id);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setChainArr(chainArr));
  }, [chainArr, dispatch]);

  const pathname = usePathname();
  const segments = pathname.split('/');
  const defaultCurrent = segments.length > 2 ? `/${segments[2]}` : '/';
  const [current, setCurrent] = useState(defaultCurrent);
  const multi = useMultiChain();
  const headerList = useMemo(() => {
    const result = cloneDeep(headerMenuList.map((ele) => ele.headerMenu_id));
    if (multi || pathname === '/') {
      return result.map((item) => {
        if (item.children && item.children.length > 0) {
          item.children = item.children.filter((child) => child.path !== '/chart');
        }
        return item;
      });
    } else {
      return result;
    }
  }, [headerMenuList, multi, pathname]);
  const menus = useMemo(() => {
    return headerList.reduce((pre, cur) => {
      if (cur.children.length) {
        pre.push(...cur.children);
      } else {
        pre.push(cur);
      }
      return pre;
    }, []);
  }, [headerList]);

  useEffect(() => {
    const segments = pathname.split('/');
    const current = segments.length > 2 ? `/${segments[2]}` : '';

    if (menus.find((item) => item.path === current)) {
      setCurrent(current);
    } else if (pathname.includes('/nft')) {
      setCurrent('/nfts');
    } else if (current.startsWith('/token')) {
      setCurrent('/tokens');
    } else if (current.startsWith('/block')) {
      setCurrent('/blocks');
    } else if (current.startsWith('/tx')) {
      setCurrent('/transactions');
    } else if (!current || current === '/') {
      setCurrent('/');
    } else {
      setCurrent('blockchain');
    }
  }, [menus, pathname]);

  const networkArr = networkList.map((ele) => ele.network_id);
  return (
    <div className={clsx(clsPrefix)}>
      <HeaderTop selectedKey={current} networkList={networkArr} setCurrent={setCurrent} headerMenuList={headerList} />
      {!isPad && <HeaderMenu headerMenuList={headerList} selectedKey={current} setCurrent={setCurrent} />}
    </div>
  );
}
