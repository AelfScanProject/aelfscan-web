'use client';
import { Menu } from 'antd';
import { MenuProps } from 'rc-menu';
import { useMemo } from 'react';
import clsx from 'clsx';
import './index.css';
import IconFont from '@_components/IconFont';
import ChainSelect from '@_components/ChainSelect';
import { MenuItem, NetworkItem } from '@_types';
import { getPathnameFirstSlash, isURL } from '@_utils/urlUtils';
import { useAppSelector } from '@_store';
import Link from 'next/link';
interface IProps {
  networkList: NetworkItem[];
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
              href={path === '/' ? (defaultChain === 'AELF' ? '/' : `/${defaultChain}`) : `/${defaultChain}${path}`}>
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
                href={path === '/' ? (defaultChain === 'AELF' ? '/' : `/${defaultChain}`) : `/${defaultChain}${path}`}>
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

  return (
    <div className={clsx(`${clsPrefix}`)}>
      <div className={`${clsPrefix}-content`}>
        <Menu className="flex-1" onClick={onClick} selectedKeys={[selectedKey]} mode="horizontal" items={items}></Menu>
        <ChainSelect setCurrent={setCurrent} />
      </div>
    </div>
  );
}
