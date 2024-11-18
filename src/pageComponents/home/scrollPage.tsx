import { memo } from 'react';
import AdsCarousel from './_components/ScrollAds';
import AelfUpdatesCarousel from './_components/ScrollTwitter';

function ScrollPage() {
  return (
    <div className="relative z-10 mx-auto box-border flex w-full max-w-[1440px] flex-col gap-4 px-2 py-6 min-769:px-5 min-[993px]:min-w-[200px] min-[1025px]:flex-row">
      <div className="min-[1025px]:w-[calc(50%-8px)]">
        <AelfUpdatesCarousel />
      </div>
      <div className="min-[1025px]:w-[calc(50%-8px)]">
        <AdsCarousel />
      </div>
    </div>
  );
}

export default memo(ScrollPage);
