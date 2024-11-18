'use client';
import React, { useEffect, useMemo, useState } from 'react';
import HeaderTop from '@_components/HeaderTop';
import HeaderMenu from '@_components/HeaderMenu';
import './index.css';
import clsx from 'clsx';
import { useAppDispatch } from '@_store';
import { setChainArr } from '@_store/features/chainIdSlice';
import { usePathname } from 'next/navigation';
import { cloneDeep } from 'lodash';
import { homePath } from '@_components/Main';
import useBlockchainOverview from '@_hooks/useBlockchainOverview';
import useHomeSocket from '@_hooks/useHomeSocket';
import useSearchFilter from '@_hooks/useSearchFilters';
import { Affix } from 'antd';

const clsPrefix = 'header-container';
export default function Header({ chainList, networkList, headerMenuList }) {
  const chainArr = chainList.map((ele) => ele.chainList_id);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setChainArr(chainArr));
  }, [chainArr, dispatch]);

  const pathname = usePathname();
  const segments = pathname.split('/');
  const defaultCurrent = segments.length > 2 ? `/${segments[2]}` : '/';
  const [current, setCurrent] = useState(defaultCurrent);
  const headerList = useMemo(() => {
    const result = cloneDeep(headerMenuList.map((ele) => ele.headerMenu_id));
    return result;
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

  const path = usePathname();

  const isHome = useMemo(() => {
    return homePath.includes(path);
  }, [path]);

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

  useBlockchainOverview();
  useHomeSocket();
  useSearchFilter();

  const networkArr = networkList.map((ele) => ele.network_id);
  return (
    !isHome && (
      <div className={clsx(clsPrefix)}>
        <Affix offsetTop={0}>
          <HeaderTop
            selectedKey={current}
            networkList={networkArr}
            setCurrent={setCurrent}
            headerMenuList={headerList}
          />
        </Affix>
        <HeaderMenu
          headerMenuList={headerList}
          selectedKey={current}
          networkList={networkArr}
          setCurrent={setCurrent}
        />
      </div>
    )
  );
}
