import AelfscanLogo from '@_components/Header/aelfscanLogo';
import MenuItemCom from '@_components/HeaderMenu/memuItem';
import TokenPrice from '@_components/HeaderTop/price';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
import { useHeaderContext } from '@app/pageProvider';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { cloneDeep } from 'lodash';
import NetWorkSwitch from '@_components/NetWorkSwitch';
import SearchComp from './SearchWithClient';
import IconFont from '@_components/IconFont';

const HOME_TEXT_LISTS = [
  {
    backgroundColors: 'bg-accent-blue-background',
    iconTypes: 'globe-f6em01fl',
    textColors: 'text-accentBlue',
    titles: 'Explorer',
  },
  {
    backgroundColors: 'bg-accent-teal-background',
    iconTypes: 'chart-column-big',
    textColors: 'text-accent-teal',
    titles: 'Analytics',
  },
  {
    backgroundColors: 'bg-accent-pink-background',
    iconTypes: 'chart-pie',
    textColors: 'text-accent-pink',
    titles: 'Portfolio',
  },
];

export function BannerContainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(HOME_TEXT_LISTS[0]);

  const { networkList, headerMenuList } = useHeaderContext();

  const pathname = usePathname();
  const segments = pathname.split('/');
  const defaultCurrent = segments.length > 2 ? `/${segments[2]}` : '/';
  const [current, setCurrent] = useState(defaultCurrent);

  const headerList = useMemo(() => {
    const result = cloneDeep(headerMenuList.map((ele) => ele.headerMenu_id));
    return result;
  }, [headerMenuList]);

  const networkArr = networkList.map((ele) => ele.network_id);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % HOME_TEXT_LISTS.length;
        setSelectedItem(HOME_TEXT_LISTS[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const isMobile = useMobileAll();

  const mobile = useMemo(() => {
    return isMobile;
  }, [isMobile]);

  const { isLG } = useResponsive();

  return (
    <div className={`banner-section-container z-8 relative w-full  ${selectedItem.backgroundColors}`}>
      <div className="absolute inset-0 h-full overflow-hidden">
        <div className="banner-bg absolute  -bottom-7 aspect-[393/85] max-h-[400px] w-full bg-cover bg-no-repeat mix-blend-multiply min-769:-bottom-2 min-769:aspect-[1024/232] min-769:bg-center min-[1025px]:-bottom-[53px] min-[1025px]:aspect-[1024/311] min-[1500px]:bg-top"></div>
      </div>
      <div className="header-section">
        <div className="flex items-center gap-4">
          <AelfscanLogo />

          <div className="hidden items-center justify-center rounded bg-white px-2 py-1 min-769:flex">
            <TokenPrice />
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          {!isLG && (
            <div>
              <MenuItemCom
                selectedKey={current}
                type={'horizontal'}
                headerMenuList={headerList}
                setCurrent={setCurrent}
              />
            </div>
          )}
          <NetWorkSwitch isSelect={false} networkList={networkArr} />
          {isLG && (
            <div className="block">
              <MenuItemCom selectedKey={current} type={'inline'} headerMenuList={headerList} setCurrent={setCurrent} />
            </div>
          )}
        </div>
      </div>
      <div className="banner-section z-8 relative flex justify-start py-12  min-769:!py-24">
        <div className="w-full flex-00auto">
          <div className="relative mb-4 flex w-full justify-center gap-1 text-center text-2xl min-769:mb-6 min-769:text-3xl">
            <div className="text-center font-bold tracking-[-0.75px]">aelf Multichain</div>
            <div className="relative flex   items-center justify-start " style={{ position: 'relative' }}>
              {HOME_TEXT_LISTS.map((item) => {
                const { iconTypes, textColors, titles } = item;
                return (
                  <div
                    className={`home-animate-text flex items-center gap-1 font-bold ${selectedItem.titles === item.titles ? 'block' : 'hidden'}`}
                    key={titles}>
                    <IconFont className="text-[24px] min-769:text-[32px]" type={iconTypes} />
                    <span className={textColors}>{titles}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="search-section w-full">
            <SearchComp isMobile={mobile} />
          </div>
        </div>
      </div>
    </div>
  );
}
