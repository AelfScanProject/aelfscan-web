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

// at public file
const TopIconMain = '/image/aelf-header-top.svg';
const TopIcoTest = '/image/aelf-header-top-test.svg';
const ChangeIconMain = '/image/aelf-header-top-change.svg';
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
  const pathname = usePathname();
  const isHideSearch = pathname === '/' || pathname.includes('search-');
  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const networkType = NEXT_PUBLIC_NETWORK_TYPE;
  const finalUrl = networkList.find((ele) => ele?.network_id.key === networkType)?.network_id?.path;
  const { chain } = useParams();
  const router = useRouter();
  const { BlockchainOverview, overviewLoading } = useBlockchainOverview(defaultChain as TChainID);

  const { tokenPriceRate24h = 0, tokenPriceInUsd = 0 } = BlockchainOverview || {};

  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  return (
    <div className={clsx(clsPrefix, isMainNet && `${clsPrefix}-main`, isMobile && `${clsPrefix}-mobile`)}>
      {!isHideSearch && isMobile && (
        <div className={clsx(`${clsPrefix}-search`)}>
          <Search
            searchIcon={true}
            searchButton={false}
            enterIcon={true}
            searchWrapClassNames={clsx(
              'px-3',
              'py-2',
              'max-w-[509px]',
              'rounded',
              isMainNet ? 'border-[#3A4668] bg-transparent' : 'rounded border-D0 bg-F7',
            )}
            searchInputClassNames={clsx('!pl-0', isMainNet && '!text-white placeholder:!text-white')}
            placeholder={'Search by Address / Txn Hash / Block'}
            lightMode={!isMainNet}
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
            router.push(`/?chainId=${chain || defaultChain}`);
            setCurrent('/');
          }}
        />
        <>
          {isMainNet && !isMobile && !overviewLoading && tokenPriceInUsd && (
            <div className={clsx(`${clsPrefix}-price`)}>
              <span className="title">ELF Price</span>
              <span className="price">${tokenPriceInUsd}</span>
              <span className={clsx(`${tokenPriceRate24h < 0 ? 'text-rise-red' : 'text-fall-green'}`, 'range')}>
                {tokenPriceRate24h <= 0 ? tokenPriceRate24h : `+${tokenPriceRate24h}`}%
              </span>
            </div>
          )}

          <div className={clsx(`${clsPrefix}-right`)} onClick={() => (window.location.href = finalUrl || '')}>
            <div className={clsx(`${clsPrefix}-explorer-change`)}>
              <Image
                className={`${clsPrefix}-change-icon`}
                width="16"
                height="16"
                src={`${isMainNet ? ChangeIconMain : ChangeIcoTest}`}
                alt={'explorer-change-icon'}></Image>
            </div>
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
