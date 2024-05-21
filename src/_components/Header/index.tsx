'use client';
import React, { useEffect, useState } from 'react';
import HeaderTop from '@_components/HeaderTop';
import HeaderMenu from '@_components/HeaderMenu';
import './index.css';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { useAppDispatch } from '@_store';
import { setChainArr } from '@_store/features/chainIdSlice';
import { usePathname } from 'next/navigation';
import { getPathnameFirstSlash } from '@_utils/urlUtils';
import { useEffectOnce } from 'react-use';

const clsPrefix = 'header-container';
export default function Header({ chainList, networkList, headerMenuList }) {
  const isMobile = useMobileAll();
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
  const headerList = headerMenuList.map((ele) => ele.headerMenu_id);
  const menus = headerList.reduce((pre, cur) => {
    if (cur.children.length) {
      pre.push(...cur.children);
    } else {
      pre.push(cur);
    }
    return pre;
  }, []);

  useEffectOnce(() => {
    if (menus.find((item) => item.path === current)) {
      return;
    } else if (current.startsWith('/nft')) {
      setCurrent('/nfts');
    } else if (current.startsWith('/token')) {
      setCurrent('blockchain');
    } else if (current === '/') {
      setCurrent('/');
    } else {
      setCurrent('blockchain');
    }
  });

  const networkArr = networkList.map((ele) => ele.network_id);
  return (
    <div className={clsx(clsPrefix)}>
      <HeaderTop
        price={100}
        range={'99'}
        selectedKey={current}
        setCurrent={setCurrent}
        networkList={networkList}
        headerMenuList={headerList}
      />
      {!isMobile && (
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
