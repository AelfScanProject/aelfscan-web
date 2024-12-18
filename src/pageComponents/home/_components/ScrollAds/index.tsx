import React, { memo, useEffect, useState } from 'react';
import './index.css';
// import Marquee from 'react-fast-marquee';
import Link from 'next/link';
import Image from 'next/image';
import Marquee from 'react-easy-marquee';
import { IPageAdsDetail } from '@_api/type';
import { fetchAdsDetailList } from '@_api/fetchCMS';
import { Skeleton } from 'antd';

const AdsCarousel = () => {
  const [data, setData] = useState<IPageAdsDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchAdsDetailList();
      setLoading(false);
      setData(res);
    };

    fetchData();
  }, []);
  return loading ? (
    <div className="w-full">
      <Skeleton.Input className="!h-[38px] !w-full" active />
    </div>
  ) : (
    <div className="aelf-updates-container flex max-w-full items-center overflow-hidden rounded-lg border bg-white">
      {/* <div className="box-border flex h-[38px] shrink-0 items-center justify-center gap-1 bg-border p-2">
        <div className="text-sm font-semibold">Sponsored</div>
      </div> */}
      <div className="w-full px-2">
        <Marquee pauseOnHover={true} duration={80000} reverse={true} align="start" height="38px">
          {[...data].map((item, index) => (
            <div key={index} className="mx-4 flex items-center gap-1 pr-4 text-sm text-foreground">
              <div className="h-5 rounded bg-secondary px-1 text-xs leading-5 text-secondary-foreground">Sponsored</div>
              <Image
                src={item.logo}
                width={20}
                height={20}
                className="box-border inline-block size-6 shrink-0 rounded-full"
                alt=""
              />
              <span className="text-sm text-muted-foreground">{item.adsText}</span>
              <Link
                target="_blank"
                href={item.clickLink}
                className="block shrink-0 cursor-pointer font-medium text-primary">
                {item.clickText}
              </Link>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default memo(AdsCarousel);
