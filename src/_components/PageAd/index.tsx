import adtestlogo from 'public/image/adtestlogo.svg';
import Image from 'next/image';
import { useMobileAll } from '@_hooks/useResponsive';
import { AdTracker } from '@_utils/ad';
import dayjs from 'dayjs';
export interface IAdProps {
  adPage: string;
  hiddenBorder?: boolean;
}
export default function PageAd(props: IAdProps) {
  const isMobile = useMobileAll();
  const handleJump = () => {
    AdTracker.trackEvent('ads-click', {
      date: dayjs(new Date()).format('YYYY-MM-DD'),
      pageName: props.adPage,
      adsId: 'ad-test-1',
      adsName: 'ad-test-name',
    });
    AdTracker.trackEvent('ads-exposure', {
      date: dayjs(new Date()).format('YYYY-MM-DD'),
      pageName: props.adPage,
      adsId: 'ad-test-1',
      adsName: 'ad-test-name',
    });
  };
  return (
    <div
      className={`${props.hiddenBorder && '!border-none pt-0'} ${isMobile && '!pb-4'} flex border-t border-solid border-color-divider pb-6 pt-4`}>
      <div className="text-sm font-medium leading-[22px] text-base-200">
        <span className="text-sm font-medium leading-[22px] text-base-200">Sponsored:</span>
        <Image src={adtestlogo} className="mx-2 inline-block size-6 rounded-full" alt="" />
        ETransfer: Your Universal Gateway to Seamless Transfers.
        <a className="ml-2 text-sm font-medium leading-[22px] text-link" href="" target="_blank" onClick={handleJump}>
          Try Now
        </a>
      </div>
    </div>
  );
}
