'use client';
import Image from 'next/image';
import clsx from 'clsx';
import './index.css';
import Search from '@_components/Search';
import MobileHeaderMenu from '@_components/MobileHeaderMenu';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@_store';
import { usePad } from '@_hooks/useResponsive';
import { MenuItem, NetworkItem } from '@_types';
import { useEnvContext } from 'next-runtime-env';
import { useParams, useRouter } from 'next/navigation';
import { checkMainNet } from '@_utils/isMainNet';
import useBlockchainOverview from '@_hooks/useBlockchainOverview';
import { TChainID } from '@_api/type';
import { Dropdown } from 'aelf-design';
import { useMemo } from 'react';
import { MenuProps } from 'antd';
import useHomeSocket from '@_hooks/useHomeSocket';
import useSearchFilter from '@_hooks/useSearchFilters';

// at public file
const TopIconMain = '/image/aelf-header-top.svg';
const TopIcoTest = '/image/aelf-header-top-test.svg';
const ChangeIcoTest = '/image/aelf-header-top-test-change.svg';

const clsPrefix = 'header-top-container';
interface IProps {
  networkList: NetworkItem[];
  headerMenuList: MenuItem[];
  setCurrent: (key: string) => void;
  selectedKey: string;
}
export default function HeaderTop({ setCurrent, selectedKey, networkList, headerMenuList }: IProps) {
  const isMobile = usePad();
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const origin = typeof window !== 'undefined' && window.location.origin;
  const pathname = usePathname();
  const isHideSearch = ['/', '/tDVW', '/tDVV'].includes(pathname) || pathname.includes('search-');
  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const items: MenuProps['items'] = useMemo(() => {
    return networkList.map((item) => {
      return {
        key: item?.network_id?.key,
        label: (
          <a
            target="_blank"
            className={`text-sm leading-[22px] ${origin === item.network_id?.path ? '!text-link' : '!text-base-100'}`}
            href={item.network_id?.path}
            rel="noopener noreferrer">
            {item.network_id?.label}
          </a>
        ),
      };
    });
  }, [networkList, origin]);

  const { chain } = useParams();
  const router = useRouter();
  const { BlockchainOverview, overviewLoading } = useBlockchainOverview(defaultChain as TChainID);
  useHomeSocket(defaultChain as TChainID);
  useSearchFilter();

  const { tokenPriceRate24h = 0, tokenPriceInUsd = 0 } = BlockchainOverview || {};

  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  return (
    <div className={clsx(clsPrefix, isMobile && `${clsPrefix}-mobile`)}>
      {!isHideSearch && isMobile && (
        <div className={clsx(`${clsPrefix}-search-test`, `${clsPrefix}-search`, 'flex justify-center')}>
          <Search
            searchIcon={true}
            searchButton={false}
            enterIcon={true}
            label="otherSearch"
            searchWrapClassNames={clsx('px-3', 'py-2', 'rounded', 'border-D0 bg-F7')}
            searchInputClassNames={clsx('!pl-0')}
            placeholder={'Search by Address / Txn Hash / Block'}
            lightMode={true}
          />
        </div>
      )}
      <div className={clsx(`${clsPrefix}-content`)}>
        <Image
          className={clsx(`${clsPrefix}-icon`)}
          src={`${isMainNet ? TopIconMain : TopIcoTest}`}
          alt={'top-icon'}
          width="96"
          height="32"
          onClick={() => {
            const chainId = chain || defaultChain;
            router.push(chainId === 'AELF' ? '/' : `/${chainId}`);
            setCurrent('/');
          }}
        />
        <>
          {isMainNet && !isMobile && !overviewLoading && tokenPriceInUsd && (
            <div className={clsx(`${clsPrefix}-price`)}>
              <span className="title">ELF Price:</span>
              <span className="price">${tokenPriceInUsd}</span>
              <span className={clsx(`${tokenPriceRate24h < 0 ? 'text-rise-red' : 'text-fall-green'}`, 'range')}>
                {tokenPriceRate24h <= 0 ? tokenPriceRate24h : `+${tokenPriceRate24h}`}%
              </span>
            </div>
          )}

          <div className="flex items-center">
            {!isHideSearch && !isMobile && (
              <Search
                searchIcon={true}
                searchButton={false}
                enterIcon={true}
                label="otherSearch"
                searchWrapClassNames={clsx('px-3', 'py-2', '!w-[590px]', 'rounded border-D0 bg-F7')}
                searchInputClassNames={clsx('!pl-0')}
                placeholder={'Search by Address / Txn Hash / Block'}
                lightMode={true}
              />
            )}
            <Dropdown trigger={['click']} overlayClassName="network-drop w-[180px]" menu={{ items }}>
              <div className={clsx(`${clsPrefix}-right`)}>
                <div className={clsx(`${clsPrefix}-explorer-change`)}>
                  <Image
                    className={`${clsPrefix}-change-icon`}
                    width="16"
                    height="16"
                    src={`${ChangeIcoTest}`}
                    alt={'explorer-change-icon'}></Image>
                </div>
              </div>
            </Dropdown>
          </div>
        </>
        {isMobile && (
          <MobileHeaderMenu
            setCurrent={setCurrent}
            selectedKey={selectedKey}
            headerMenuList={headerMenuList}
            networkList={networkList}
          />
        )}
      </div>
    </div>
  );
}
