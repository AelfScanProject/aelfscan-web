import Image from 'next/image';
import { useMobileAll } from '@_hooks/useResponsive';
import { AdTracker } from '@_utils/ad';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useState } from 'react';
import { fetchAdsDetail } from '@_api/fetchSearch';
import { IPageAdsDetail } from '@_api/type';
export interface IAdProps {
  adPage: string;
  hiddenBorder?: boolean;
}

function PageAd(props: IAdProps) {
  const { adPage } = props;
  const isMobile = useMobileAll();
  const [adsDetail, setAdsDetail] = useState<IPageAdsDetail>();

  useEffect(() => {
    fetchAdsDetail({ label: adPage }).then((res) => {
      setAdsDetail(res);
    });
  }, [adPage]);
  const handleJump = useCallback(() => {
    AdTracker.trackEvent('ads-click', {
      date: dayjs(new Date()).format('YYYY-MM-DD'),
      pageName: adPage,
      adsId: adsDetail?.adsId,
      adsName: adsDetail?.adsText,
    });
  }, [adsDetail?.adsText, adsDetail?.adsId, adPage]);
  return (
    adsDetail?.adsId && (
      <div className={`${props.hiddenBorder && '!border-none !pt-0'} ${isMobile && '!pb-4'} flex py-2`}>
        <div className="text-sm font-medium text-muted-foreground">
          <span className="text-sm font-medium ">Sponsored:</span>
          <Image src={adsDetail.logo} width={24} height={24} className="mx-2 inline-block size-6 rounded-full" alt="" />
          {adsDetail?.adsText}
          <a
            className="ml-2 text-sm font-medium text-primary"
            href={adsDetail.clickLink}
            target="_blank"
            onClick={handleJump}
            rel="noreferrer">
            {adsDetail?.clickText}
          </a>
        </div>
      </div>
    )
  );
}

export default memo(PageAd);
