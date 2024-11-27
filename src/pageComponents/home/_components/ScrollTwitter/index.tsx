import React, { memo, useEffect, useMemo, useState } from 'react';
import './index.css';
import IconFont from '../../../../_components/IconFont/index';
import Link from 'next/link';
import Marquee from 'react-easy-marquee';
import Image from 'next/image';
import { fetchLatestTwitter } from '@_api/fetchCMS';
import { Skeleton } from 'antd';

interface ITwitterItem {
  id: string;
  text: string;
}

const truncateText = (text, maxLength = 60) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

const AelfUpdatesCarousel = () => {
  const [data, setData] = useState<ITwitterItem[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchLatestTwitter();
      setLoading(false);
      setData(res);
    };

    fetchData();
  }, []);

  const renderData = useMemo(() => {
    return (
      data?.map((item) => {
        item.text = truncateText(item.text);
        return item;
      }) || []
    );
  }, [data]);

  return loading ? (
    <div className="w-full">
      <Skeleton.Input className="!h-[38px] !w-full" active />
    </div>
  ) : (
    <div className="aelf-updates-container flex max-w-full items-center overflow-hidden rounded-lg border bg-white">
      <div className="flex h-[38px] shrink-0 items-center justify-center gap-1 bg-border p-2">
        <Image width={16} height={16} alt="" src="/image/Megaphone.svg" />
        <div className="text-sm font-semibold">aelf updates</div>
      </div>
      <div className="w-full">
        <Marquee pauseOnHover={true} duration={80000} reverse={true} align="center" height="38px">
          {[...renderData].map((item, index) => (
            <div key={index} className="mx-4 flex items-center gap-1 text-sm text-muted-foreground">
              <IconFont type="ELF-f6dioc4d" />
              <span>[LIVE] </span>
              <span>{item.text}</span>
              <Link
                target="_blank"
                href={`https://twitter.com/aelfblockchain/status/${item.id}`}
                className="cursor-pointer text-primary">
                Learn More
              </Link>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default memo(AelfUpdatesCarousel);
