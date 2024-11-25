'use client';
import clsx from 'clsx';
import './index.css';
import Search from '@_components/Search';
import { useMD } from '@_hooks/useResponsive';
import { MenuItem, NetworkItem } from '@_types';
import NetWorkSwitch from '@_components/NetWorkSwitch';
import TokenPrice from './price';

const clsPrefix = 'header-top-container';
interface IProps {
  networkList: NetworkItem[];
  headerMenuList: MenuItem[];
  setCurrent: (key: string) => void;
  selectedKey: string;
}
export default function HeaderTop({ networkList }: IProps) {
  const isMobile = useMD();

  return (
    <div className={clsx(clsPrefix, isMobile && `${clsPrefix}-mobile`)}>
      <div className={clsx(`${clsPrefix}-content`)}>
        <>
          <div className="hidden min-[769px]:block">
            <TokenPrice />
          </div>

          <div className="flex w-full items-center gap-2 min-[769px]:w-auto">
            <div
              className={clsx(
                `${clsPrefix}-search-test`,
                `${clsPrefix}-search`,
                'flex w-full items-center justify-center min-[769px]:w-auto',
              )}>
              <Search
                searchIcon={true}
                searchButton={false}
                enterIcon={true}
                label="otherSearch"
                searchWrapClassNames={clsx('w-full min-[769px]:w-[480px]')}
                searchInputClassNames={clsx('!rounded-l-md bg-white !pl-0')}
                placeholder={'Search by Address / Txn Hash / Block'}
                lightMode={true}
              />
            </div>
            <div className="hidden min-[1025px]:block">
              <NetWorkSwitch networkList={networkList} />
            </div>
          </div>
        </>
        {/* {isMobile && (
          <MobileHeaderMenu
            setCurrent={setCurrent}
            selectedKey={selectedKey}
            headerMenuList={headerMenuList}
            networkList={networkList}
          />
        )} */}
      </div>
    </div>
  );
}
