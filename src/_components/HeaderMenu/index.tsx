'use client';
import { Menu } from 'antd';
import { MenuProps } from 'rc-menu';
import { useMemo } from 'react';
import clsx from 'clsx';
import './index.css';
import IconFont from '@_components/IconFont';
import Search from '@_components/Search';
import { MenuItem } from '@_types';
import { getPathnameFirstSlash, isURL } from '@_utils/urlUtils';
import { useAppSelector } from '@_store';
import Link from 'next/link';
import { usePad } from '@_hooks/useResponsive';
import { homePath } from '@_components/Main';
import { usePathname } from 'next/navigation';
import { DEFAULT_CHAIN } from '@_utils/contant';
interface IProps {
  headerMenuList: MenuItem[];
  setCurrent: (key: string) => void;
  selectedKey: string;
}

const clsPrefix = 'header-menu-container';
export default function HeaderMenu({ selectedKey, setCurrent, headerMenuList }: IProps) {
  const { defaultChain } = useAppSelector((state) => state.getChainId);

  // TODO: use cms
  const items: MenuProps['items'] = useMemo(() => {
    return headerMenuList?.map((ele) => {
      if (!ele.children?.length) {
        // one layer
        const path = ele.path;
        return {
          label: isURL(path) ? (
            <a target="_blank" rel="noreferrer" href={`${path}?chainId=${defaultChain}`}>
              {ele.label}
            </a>
          ) : (
            <Link
              href={
                path === '/' ? (defaultChain === DEFAULT_CHAIN ? '/' : `/${defaultChain}`) : `/${defaultChain}${path}`
              }>
              {ele.label}
            </Link>
          ),
          key: ele.path,
        };
      } else {
        // parent of two layer
        const item = {
          label: (
            <div className="flex items-center">
              <span className="submenu-title-wrapper">{ele.label}</span>
              <IconFont className="submenu-right-arrow" type="menu-down" />
            </div>
          ),
          key: ele.path,
          popupClassName: `${clsPrefix}-popup`,
          children: [] as MenuProps['items'],
        };
        ele.children.forEach((element) => {
          const { label, path } = element;
          const secondSlashIndex = path.slice(1).indexOf('/');
          item.children?.push({
            label: isURL(path) ? (
              <a target="_blank" rel="noreferrer" href={`${path}?chainId=${defaultChain}`}>
                {label}
              </a>
            ) : (
              <Link
                href={
                  path === '/' ? (defaultChain === DEFAULT_CHAIN ? '/' : `/${defaultChain}`) : `/${defaultChain}${path}`
                }>
                {label}
              </Link>
            ),
            key: secondSlashIndex === -1 || isURL(path) ? path : getPathnameFirstSlash(path),
          });
        });
        return item;
      }
    });
  }, [defaultChain, headerMenuList]);

  const onClick: MenuProps['onClick'] = (e) => {
    if (!e.key.startsWith('http')) {
      setCurrent(e.key);
    }
  };

  const isMobile = usePad();

  const pathname = usePathname();

  const isHideSearch = homePath.includes(pathname) || pathname.includes('search-');

  return (
    <div className={clsx(`${clsPrefix}`)}>
      <div className={`${clsPrefix}-content`}>
        <Menu className="flex-1" onClick={onClick} selectedKeys={[selectedKey]} mode="horizontal" items={items}></Menu>
        {!isHideSearch && !isMobile && (
          <Search
            searchIcon={true}
            searchButton={false}
            enterIcon={true}
            label="otherSearch"
            searchWrapClassNames={clsx('px-3', 'py-2', 'h-[40px] !w-[560px]', 'rounded border-D0 bg-F7')}
            searchInputClassNames={clsx('!pl-0')}
            placeholder={'Search by Address / Txn Hash / Block'}
            lightMode={true}
          />
        )}
      </div>
    </div>
  );
}
