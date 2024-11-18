import React, { memo, useMemo } from 'react';
import './index.css';
import Marquee from 'react-fast-marquee';
import IconFont from '../../../../_components/IconFont/index';
import Link from 'next/link';
import Image from 'next/image';

const data = [
  {
    id: '1856912338970157565',
    text: 'RT @aelfblockchain: Welcome to aelf—where we power a diverse range of products from #DeFi to #gaming and #NFT, all built on our robust Layer...',
  },
  {
    id: '1855901066132648374',
    text: "📢New on aelfscan: Contract Verification is LIVE! Upload your smart contract source code and we'll match it against the #blockchain for transparency.🌐🔍",
  },
  {
    id: '1855898689015042072',
    text: 'RT @aelfblockchain: dAppChain powered over half a billion transactions as tracked on @aelfscan, new highs in swap volumes...',
  },
  {
    id: '1855898674267861198',
    text: "RT @aelfblockchain: 🚨(CHAIN)GE IS HERE: Introducing aelf's dAppChain! With over half a billion transactions and leading #Web3 on @Telegram...",
  },
  {
    id: '1853712148566008300',
    text: 'Since the start of 2024, @aelfblockchain has seen 7x growth in addresses, now exceeding 896,000 addresses as of 4 Nov 2024.🙌',
  },
];

const truncateText = (text, maxLength = 60) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

const AelfUpdatesCarousel = () => {
  const renderData = useMemo(() => {
    return data.map((item) => {
      item.text = truncateText(item.text);
      return item;
    });
  }, []);
  return (
    <div className="aelf-updates-container flex max-w-full items-center overflow-hidden rounded-lg border bg-white">
      <div className="flex shrink-0 items-center justify-center gap-1 bg-border p-2">
        <Image width={16} height={16} alt="" src="/image/Megaphone.svg" />
        <div className="text-sm font-semibold">aelf updates</div>
      </div>
      <div>
        <Marquee pauseOnHover={true} speed={50} loop={0} gradient={false}>
          {[...renderData].map((item, index) => (
            <div key={index} className="mx-4 flex items-center gap-1 truncate text-sm text-foreground">
              <IconFont type="ELF-f6dioc4d" />
              <span>[LIVE] </span>
              <span>{item.text}</span>
              <Link
                target="_blank"
                href={`https://twitter.com/aelfblockchain/status/${item.id}`}
                className="text-primary">
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
