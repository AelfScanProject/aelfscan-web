import React, { memo, useMemo } from 'react';
import './index.css';
// import Marquee from 'react-fast-marquee';
import IconFont from '../../../../_components/IconFont/index';
import Link from 'next/link';
import Image from 'next/image';
import Marquee from 'react-easy-marquee';

const data = [
  {
    adsId: 'c1c710ce-d574-472e-9610-4bbce346a38e',
    adsText: 'Secure AA Crypto Wallet for Web3 Asset Management',
    clickLink: 'https://portkey.finance/download',
    clickText: 'Download',
    head: 'ads:',
    logo: 'https://aelfscan-mainnet.s3.ap-northeast-1.amazonaws.com/1727234820713-portkey.png',
    searchKey: null,
  },
  {
    adsId: 'a8505cb9-9a95-4eb7-ba4f-754e5b0a8a45',
    head: 'ads:',
    logo: 'https://aelfscan-mainnet.s3.ap-northeast-1.amazonaws.com/1727234944273-schrodinger.png',
    adsText: "World's first AI-powered 404 NFT collection.",
    clickText: 'Try now!',
    clickLink: 'https://schrodingernft.ai/',
    searchKey: 'adsb66c5bc3-b68d-4228-bf50-340392c2d077-otherSearch',
  },
  {
    adsId: 'c1c710ce-d574-472e-9610-4bbce346a38e',
    head: 'ads:',
    logo: 'https://aelfscan-mainnet.s3.ap-northeast-1.amazonaws.com/1727234820713-portkey.png',
    adsText: 'Secure AA Crypto Wallet for Web3 Asset Management',
    clickText: 'Download',
    clickLink: 'https://portkey.finance/download',
    searchKey: null,
  },
  {
    adsId: 'c978ac45-4bf1-42c7-9a35-216457ae7d33',
    head: 'ads:',
    logo: 'https://aelfscan-testnet.s3.ap-northeast-1.amazonaws.com/eBridge-ads-logo.png',
    adsText: "eBridge: Decentralized cross-chain bridge from aelf's ecosystem.",
    clickText: 'Bridge Now!',
    clickLink: 'https://ebridge.exchange/',
    searchKey: 'adsb66c5bc3-b68d-4228-bf50-340392c2d077-tokens',
  },
  {
    adsId: 'a8505cb9-9a95-4eb7-ba4f-754e5b0a8a45',
    head: 'ads:',
    logo: 'https://aelfscan-mainnet.s3.ap-northeast-1.amazonaws.com/1727234944273-schrodinger.png',
    adsText: "World's first AI-powered 404 NFT collection.",
    clickText: 'Try now!',
    clickLink: 'https://schrodingernft.ai/',
    searchKey: 'adsb66c5bc3-b68d-4228-bf50-340392c2d077-tokens',
  },
];

const AdsCarousel = () => {
  return (
    <div className="aelf-updates-container flex max-w-full items-center overflow-hidden rounded-lg border bg-white">
      <div className="box-border flex h-[38px] shrink-0 items-center justify-center gap-1 bg-border p-2">
        <div className="text-sm font-semibold">Sponsored</div>
      </div>
      <div className="w-full">
        <Marquee pauseOnHover={true} duration={40000} reverse={true} align="center" height="38px">
          {[...data].map((item, index) => (
            <div key={index} className="mx-4 flex items-center gap-1 text-sm text-foreground">
              <Image src={item.logo} width={20} height={20} className="mx-2 inline-block size-6 rounded-full" alt="" />
              <span className="text-sm text-muted-foreground">{item.adsText}</span>
              <Link target="_blank" href={item.clickLink} className="font-medium text-primary">
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
