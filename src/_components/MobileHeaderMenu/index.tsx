import { MenuOutlined } from '@aelf-design/icons';
import IconFont from '@_components/IconFont';
import { MenuItem, NetworkItem } from '@_types';
import { Drawer, Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import './index.css';
import { useAppDispatch, useAppSelector } from '@_store';
import { setDefaultChain } from '@_store/features/chainIdSlice';
import { getPathnameFirstSlash } from '@_utils/urlUtils';
import { useEnvContext } from 'next-runtime-env';
import { checkMainNet } from '@_utils/isMainNet';
import { useMobileAll } from '@_hooks/useResponsive';
import clsx from 'clsx';

interface IProps {
  headerMenuList: MenuItem[];
  networkList: NetworkItem[];
  setCurrent: (key: string) => void;
  selectedKey: string;
}
type AntdMenuItem = Required<MenuProps>['items'][number];

export default function MobileHeaderMenu({ headerMenuList, setCurrent, selectedKey, networkList }: IProps) {
  console.log(networkList, 'networkList');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isMobile = useMobileAll();

  const { chainArr, defaultChain } = useAppSelector((state) => state.getChainId);
  const toggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    setShowMobileMenu(false);
  };
  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  const router = useRouter();
  function getItem(label: React.ReactNode, key: React.Key, children?: AntdMenuItem[], type?: 'group'): AntdMenuItem {
    return {
      key,
      children,
      label,
      type,
    } as AntdMenuItem;
  }

  const jump = (url) => {
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    router.replace(url === '/' ? `?chainId=${defaultChain}` : `/${defaultChain}${url}`);
  };
  const convertMenuItems = (list) => {
    return list?.map((ele) => {
      const { children, path, label } = ele;
      if (!children?.length) {
        const secondSlashIndex = path.slice(1).indexOf('/');
        const key = secondSlashIndex === -1 ? path : getPathnameFirstSlash(path);
        return getItem(<a onClick={() => jump(path)}>{label}</a>, key);
      }
      return getItem(label, path, convertMenuItems(children));
    });
  };
  const dispatch = useAppDispatch();
  const onSelectHandler = (value: string) => {
    dispatch(setDefaultChain(value));
    router.push(`/?chainId=${value}`);
    setCurrent('/');
  };

  const pathname = usePathname();

  const items: MenuProps['items'] = [
    ...convertMenuItems(headerMenuList),
    { type: 'divider' },
    getItem(
      'Explorers',
      'explorers',
      networkList.map((ele) => {
        return getItem(<Link href={ele.network_id?.path}>{ele.network_id?.label}</Link>, ele.network_id?.key);
      }),
    ),
    getItem(
      'Networks',
      'networks',
      chainArr?.map((ele) => {
        return getItem(<a onClick={() => onSelectHandler(ele.key)}>{ele.label}</a>, ele.label);
      }),
    ),
  ];

  return (
    <div className={`header-navbar-mobile-more ${isMainNet ? 'header-navbar-main-mobile-more' : ''}`}>
      {/* <IconFont type={isMainNet ? 'moremainnet' : 'moretestnet'} onClick={() => toggleMenu()} /> */}
      <div
        className="item-center border-1 flex size-8 justify-center rounded border border-[#444F70] bg-[#222F55]"
        onClick={() => toggleMenu()}>
        <MenuOutlined color="#fff" hoverColor="#fff" activeColor="#fff" style={{ fontSize: '20px' }} />
      </div>
      {showMobileMenu && (
        <Drawer
          open={showMobileMenu}
          placement="top"
          closable={false}
          zIndex={40}
          styles={{ mask: { background: 'transparent' } }}
          className={clsx(
            'header-drawer-menu-wrapper',
            isMainNet ? 'header-main-drawer-menu-wrapper' : '',
            pathname === '/' && 'home-header-drawer-menu-wrapper',
            isMobile && pathname !== '/' ? '!mt-28' : '',
          )}
          rootClassName={`header-drawer-menu-root-wrapper`}
          onClose={() => toggleMenu()}>
          <Menu
            onClick={onClick}
            style={{ width: 256 }}
            expandIcon={<IconFont className="submenu-right-arrow" type="Down"></IconFont>}
            selectedKeys={[selectedKey]}
            mode="inline"
            items={items}
          />
        </Drawer>
      )}
    </div>
  );
}
