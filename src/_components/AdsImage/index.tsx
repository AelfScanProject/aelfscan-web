import { IPageBannerAdsDetail } from '@_api/type';
import { AdTracker } from '@_utils/ad';
import Image from 'next/image';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import clsx from 'clsx';

export default function AdsImage(props: {
  adsItem: IPageBannerAdsDetail;
  adPage: string;
  rootClassName?: string;
  onlyMobile?: boolean;
}) {
  const { adsItem, adPage, onlyMobile } = props;
  const handleJump = useCallback(() => {
    AdTracker.trackEvent('ads-click', {
      date: dayjs(new Date()).format('YYYY-MM-DD'),
      pageName: adPage,
      adsId: adsItem.adsBannerId,
      adsName: adsItem.text,
    });
  }, [adPage, adsItem.adsBannerId, adsItem.text]);
  return adsItem.adsBannerId ? (
    <div className={clsx(props.rootClassName, 'flex items-center justify-center')}>
      <a
        className={clsx(onlyMobile && 'min-[576px]:!inline-block', 'relative inline-block min-[576px]:hidden')}
        href={adsItem.clickLink}
        target="_blank"
        rel="noreferrer"
        onClick={handleJump}>
        <span className="absolute -top-2 right-2 inline-block rounded bg-white px-1 py-px text-xs text-base-100 shadow-sm">
          Ad
        </span>
        <Image
          src={adsItem.mobileImage}
          alt={adsItem.text}
          width={320}
          height={104}
          className="aspect-[320/104] h-auto max-w-full rounded-lg align-middle"
        />
      </a>
      <a
        className={clsx('relative hidden min-[576px]:inline-block', onlyMobile && 'min-[576px]:!hidden')}
        href={adsItem.clickLink}
        target="_blank"
        rel="noreferrer"
        onClick={handleJump}>
        <span className="absolute -top-2 right-2 inline-block rounded bg-white px-1 py-px text-xs text-base-100 shadow-sm">
          Ad
        </span>
        <Image
          src={adsItem.image}
          alt={adsItem.text}
          width={720}
          height={104}
          className="aspect-[720/104] h-auto max-w-full rounded-lg align-middle"
        />
      </a>
    </div>
  ) : null;
}
