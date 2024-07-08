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
import { getPathnameFirstSlash } from '@_utils/urlUtils';

const clsPrefix = 'header-container';
export default function Header({ chainList, networkList, headerMenuList }) {
  const isPad = usePad();
  const chainArr = chainList.map((ele) => ele.chainList_id);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setChainArr(chainArr));
  }, [chainArr, dispatch]);

  const pathname = usePathname();
  const secondSlashIndex = pathname.slice(6).indexOf('/');
  const [current, setCurrent] = useState(
    secondSlashIndex === -1 ? pathname.slice(5) : getPathnameFirstSlash(pathname.slice(5)),
  );
  const headerList = useMemo(() => {
    return headerMenuList.map((ele) => ele.headerMenu_id);
  }, [headerMenuList]);
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
    // console.log('current', current, pathname, menus);
    const secondSlashIndex = pathname.slice(6).indexOf('/');
    const current = secondSlashIndex === -1 ? pathname.slice(5) : getPathnameFirstSlash(pathname.slice(5));
    if (menus.find((item) => item.path === current)) {
      setCurrent(current);
    } else if (pathname.includes('/nft')) {
      setCurrent('/nfts');
    } else if (current.startsWith('/token')) {
      setCurrent('/tokens');
    } else if (!current || current === '/') {
      setCurrent('/');
    } else {
      setCurrent('blockchain');
    }
  }, [menus, pathname]);

  const networkArr = networkList.map((ele) => ele.network_id);
  return (
    <div className={clsx(clsPrefix)}>
      <HeaderTop selectedKey={current} setCurrent={setCurrent} networkList={networkList} headerMenuList={headerList} />
      {!isPad && (
        <HeaderMenu
          headerMenuList={headerList}
          selectedKey={current}
          setCurrent={setCurrent}
          networkList={networkArr}
        />
      )}
    </div>
  );
}
