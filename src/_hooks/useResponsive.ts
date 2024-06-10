import { useEffect, useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';
import { isMobileDevices } from '@_utils/isMobile';
import { useMobileContext } from '@app/pageProvider';

export default function useResponsive() {
  const { width } = useWindowSize();

  const isSM = useMemo(() => {
    return width < 640;
  }, [width]);
  const isMD = useMemo(() => {
    return width < 769;
  }, [width]);
  const isPad = useMemo(() => {
    return width < 993;
  }, [width]);
  const isLG = useMemo(() => {
    return width < 1024;
  }, [width]);
  const isXL = useMemo(() => {
    return width < 1280;
  }, [width]);
  const is2XL = useMemo(() => {
    return width < 1440;
  }, [width]);

  return {
    isMobile: isLG || isMobileDevices(),
    isSM,
    isPad,
    isMD,
    isLG,
    isXL,
    is2XL,
  };
}

export const useMobileAll = () => {
  const { isMobileSSR } = useMobileContext();
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  const { isMobile: isMobileClient } = useResponsive();
  useEffect(() => {
    setIsMobile(isMobileClient);
  }, [isMobileClient]);
  return useMemo(() => isMobile, [isMobile]);
};

export const usePad = () => {
  const { isMobileSSR } = useMobileContext();
  const [isPad, setIsPad] = useState(isMobileSSR);
  const { isPad: isPadResponsive } = useResponsive();
  useEffect(() => {
    setIsPad(isPadResponsive);
  }, [isPadResponsive]);
  return useMemo(() => isPad, [isPad]);
};

export const useMD = () => {
  const { isMobileSSR } = useMobileContext();
  const [isMD, setIsMD] = useState(isMobileSSR);
  const { isMD: isMDResponsive } = useResponsive();
  useEffect(() => {
    setIsMD(isMDResponsive);
  }, [isMDResponsive]);
  return useMemo(() => isMD, [isMD]);
};
