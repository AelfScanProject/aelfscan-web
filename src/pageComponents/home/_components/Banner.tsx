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

const backgroundColors = ['bg-accent-blue-background', 'bg-accent-teal-background', 'bg-accent-pink-background'];
const iconTypes = ['globe-f6em01fl', 'chart-column-big', 'chart-pie'];
const textColors = ['text-accentBlue', 'text-accent-teal', 'text-accent-pink'];
const titles = ['Explorer', 'Analytics', 'Portfolio'];

export function BannerContainer() {
  const [randomIcon, setRandomIcon] = useState('globe-f6em01fl');
  const [textColor, setTextColor] = useState('text-accentBlue');
  const [backgroundColor, setBackgroundColor] = useState('bg-white');
  const [title, setTitle] = useState('Explorer');

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      setIsTransitioning(true);
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % titles.length;
        setCurrentIndex(nextIndex);
        setRandomIcon(iconTypes[nextIndex]);
        setTextColor(textColors[nextIndex]);
        setBackgroundColor(backgroundColors[nextIndex]);
        setTitle(titles[nextIndex]);

        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 300);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const isMobile = useMobileAll();

  const mobile = useMemo(() => {
    return isMobile;
  }, [isMobile]);

  const { isLG } = useResponsive();

  return (
    <div className={`banner-section-container z-8 relative w-full  ${backgroundColor}`}>
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
            <div className="text-center">aelf Multichain</div>
            <div
              className="relative flex w-[120px] items-center justify-start min-769:w-[200px]"
              style={{ position: 'relative' }}>
              <div
                className={`absolute flex items-center gap-1 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                style={{ position: 'absolute', width: 'max-content' }}>
                <IconFont className="text-[24px] min-769:text-[32px]" type={randomIcon} />
                <span className={textColor}>{title}</span>
              </div>

              <div
                className={`absolute flex items-center gap-1 transition-opacity duration-500 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
                style={{ position: 'absolute', width: 'max-content' }}>
                <IconFont className="text-[24px] min-769:text-[32px]" type={iconTypes[currentIndex]} />
                <span className={textColors[currentIndex]}>{titles[currentIndex]}</span>
              </div>
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
