import { MenuOutlined } from '@aelf-design/icons';
import IconFont from '@_components/IconFont';
import { MenuItem, NetworkItem } from '@_types';
import { Drawer, Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import './index.css';
import { useAppSelector } from '@_store';
import { getPathnameFirstSlash, isURL } from '@_utils/urlUtils';
import { useEnvContext } from 'next-runtime-env';
import { checkMainNet } from '@_utils/isMainNet';
import { useMobileAll } from '@_hooks/useResponsive';
import clsx from 'clsx';
import { Dropdown } from 'aelf-design';
import Image from 'next/image';
import { homePath } from '@_components/Main';
import { DEFAULT_CHAIN, TG_BOT_LINK } from '@_utils/contant';
const ChangeIcoTest = '/image/aelf-header-top-test-change.svg';
import { TelegramPlatform } from '@portkey/did-ui-react';
import useChainSelect from '@_hooks/useChainSelect';

interface IProps {
  headerMenuList: MenuItem[];
  networkList: NetworkItem[];
  setCurrent: (key: string) => void;
  selectedKey: string;
}
type AntdMenuItem = Required<MenuProps>['items'][number];

export default function MobileHeaderMenu({ headerMenuList, setCurrent, selectedKey, networkList }: IProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isMobile = useMobileAll();

  const { chainArr, defaultChain } = useAppSelector((state) => state.getChainId);
  const toggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const onClick: MenuProps['onClick'] = (e) => {
    if (!e.key.startsWith('http')) {
      setCurrent(e.key);
    }
    setShowMobileMenu(false);
  };
  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  function getItem(label: React.ReactNode, key: React.Key, children?: AntdMenuItem[], type?: 'group'): AntdMenuItem {
    return {
      key,
      children,
      label,
      type,
    } as AntdMenuItem;
  }
  const convertMenuItems = (list) => {
    return list?.map((ele) => {
      const { children, path, label } = ele;
      if (!children?.length) {
        const secondSlashIndex = path.slice(1).indexOf('/');
        const key = secondSlashIndex === -1 ? path : getPathnameFirstSlash(path);
        return getItem(
          isURL(path) ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={defaultChain === DEFAULT_CHAIN ? path : `${path}?chainId=${defaultChain}`}>
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
          key,
        );
      }
      return getItem(label, path, convertMenuItems(children));
    });
  };

  const pathname = usePathname();

  const onSelectHandler = useChainSelect(headerMenuList, setCurrent);

  const origin = typeof window !== 'undefined' && window.location.origin;

  const { chain } = useParams();
  const chainId = useSearchParams().get('chainId');
  const selectChain = useMemo(() => {
    return chainId || (chain as string) || defaultChain;
  }, [chain, chainId, defaultChain]);

  const isTg = useMemo(() => {
    return TelegramPlatform.isTelegramPlatform();
  }, []);

  const networkItems: MenuProps['items'] = useMemo(() => {
    const Explorers = [
      {
        key: 'explorers',
        label: <span className="mb-2 inline-block text-xs leading-5 text-[#BBB]">Explorers</span>,
      },
    ];
    const explorers = networkList.map((item) => {
      return {
        key: item?.key + 'net',
        label: (
          <a
            target={isTg ? '_self' : '_blank'}
            className={`box-border flex items-center justify-between rounded-md px-3 py-[9px] text-sm leading-[22px]  ${origin === item?.path ? '!bg-F7 !text-link' : '!text-base-100'}`}
            href={isTg ? TG_BOT_LINK[item?.key] : item?.path}
            rel="noopener noreferrer">
            <span>{item?.label}</span>
            {origin === item?.path && <Image width={12} height={12} alt="correct" src="/image/correct.svg" />}
          </a>
        ),
      };
    });

    const divider = [
      {
        key: 'divider',
        label: <Image className="py-3" width="188" height={2} alt="divider" src="/image/divider.svg" />,
      },
    ];

    const chainList = chainArr.map((item) => {
      return {
        key: item?.key,
        label: (
          <a
            className={`box-border flex items-center justify-between rounded-md px-3 py-[9px] text-sm leading-[22px]  ${selectChain === item?.key ? '!bg-F7 !text-link' : '!text-base-100'}`}
            onClick={() => onSelectHandler(item.key)}>
            <span>{item?.label}</span>
            {selectChain === item.key && <Image width={12} height={12} alt="correct" src="/image/correct.svg" />}
          </a>
        ),
      };
    });

    return [
      ...Explorers,
      ...explorers,
      ...divider,
      {
        key: 'Networks',
        label: <span className="mb-2 inline-block text-xs leading-5 text-[#BBB]">Networks</span>,
      },
      ...chainList,
    ];
  }, [chainArr, isTg, networkList, onSelectHandler, origin, selectChain]);

  const items: MenuProps['items'] = [...convertMenuItems(headerMenuList)];

  return (
    <div className={`header-navbar-mobile-more flex ${isMainNet ? 'header-navbar-main-mobile-more' : ''}`}>
      <Dropdown trigger={['click']} overlayClassName="network-mobile-drop w-[220px]" menu={{ items: networkItems }}>
        <div>
          <div className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-[#EAECEF]">
            <Image width="20" height="20" src={`${ChangeIcoTest}`} alt={'explorer-change-icon'}></Image>
          </div>
        </div>
      </Dropdown>
      <div
        className={`item-center border-1 ml-3 flex size-8 justify-center rounded border`}
        onClick={() => toggleMenu()}>
        <MenuOutlined color="#252525" hoverColor="#252525" activeColor={'#266CD3'} style={{ fontSize: '20px' }} />
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
            homePath.includes(pathname) && 'home-header-drawer-menu-wrapper',
            isMobile && !homePath.includes(pathname) ? '!mt-28' : '',
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
