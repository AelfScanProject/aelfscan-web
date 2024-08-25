import clsx from 'clsx';
import './index.css';
import Image from 'next/image';

const AdvertiseIntroduce = [
  {
    title: 'Targeted Audience',
    key: 'targetedAudience',
    image: '/image/audience.svg',
    content:
      'Reach a highly engaged audience of blockchain enthusiasts, developers, and investors who actively use aelfscan to track transactions and monitor network activity.',
  },
  {
    title: 'High Visibility',
    image: '/image/visibility.svg',
    key: 'highVisibility',
    content:
      'Position your brand on a platform that receives thousands of daily visits from users seeking reliable and transparent blockchain data.',
  },
  {
    title: 'Industry Relevance',
    key: 'industryRelevance',
    image: '/image/relevance.svg',
    content:
      'Advertise alongside cutting-edge blockchain technology, solidifying your brand’s presence within the fast-growing aelf ecosystem.',
  },
];

const AdvertiseTypes = [
  {
    title: 'AELF Scan Homepage Banner Ad',
    key: 'bannerAds',
    image: '/image/banner-ad.png',
    content: `Boost your brand visibility with a banner ad on AELF Scan's homepage. Capture attention, enhance recognition, and drive user engagement with high-impact visuals.`,
    tips: ['Location: Top of the homepage', 'Size: 320x104 pixels', 'Image Format: PNG/JPG'],
  },
  {
    title: 'Search Ad',
    key: 'Search Ad',
    image: '/image/search-ad.png',
    content: `Elevate your brand visibility and captivate users with adsplaced on the Search Bar. Engage creatively, enhance retention, andmaximize your reach.`,
    tips: ['Location: Search box on all pages', 'Project Logo: 24x24 pixels', 'Text: Eye-catching introduction'],
  },
  {
    title: 'Banner Ad',
    key: 'Banner Ad',
    image: '/image/banner-detail.png',
    content: `Maximize brand visibility and user engagement with strategically placed banner ads on AELFScan’s pages. Capture attention, boost recognition, and expand your reach creatively.`,
    tips: ['Location: Detail Page', 'Size: 720x104 pixels', 'Image Format: PNG/JPG'],
  },
  {
    title: 'Header Text Ad',
    key: 'Header Text Ad',
    image: '/image/text-ad.png',
    content: `Engage users directly with CPM sponsorship. Your ad text appears prominently and seamlessly at the top of AELFScan’s pages, ensuring high visibility without disruption.`,
    tips: ['Location: 9 optional pages', 'Logo: 24x24 pixels', 'Text: Eye-catching introduction'],
  },
];

export default function Advertise() {
  return (
    <div className="ads-wrapper">
      <div className="bg-white">
        <div className="container-layout flex  flex-col items-start justify-between gap-6 py-12 min-[769px]:flex-row min-[769px]:items-center min-[769px]:gap-10 min-[769px]:py-16  min-[993px]:gap-20 min-[993px]:py-20">
          <div className="banner-title-wrapper flex-1">
            <div className="ads-title !mb-4 !text-start min-[993px]:!mb-6">Why Advertise on aelfscan?</div>
            <div className="text-base leading-6 text-base-100">
              Your premier destination for all things aelf blockchain. Ais the leading blockchain explorer and analytics
              platform for the aeIf network, aelfscan offers unparalleled access to blockchain data and user insights.
            </div>
          </div>
          <div className="flex-1">
            <Image
              width={640}
              height={260}
              className="aspect-[640/260]"
              src="/image/banner-main.svg"
              alt="cover"></Image>
          </div>
        </div>
      </div>
      <div className="container-layout min-w-[993px]:py-20  py-12 min-[769px]:py-16">
        <div className="ads-title">Why Advertise on aelfscan?</div>
        <div className="flex w-full flex-col gap-4 min-[769px]:flex-row min-[769px]:gap-6">
          {AdvertiseIntroduce.map((item) => {
            return (
              <div className="rounded-lg bg-white p-10" key={item.key}>
                <div className="mb-6">
                  <Image width={48} height={48} src={item.image} alt="icon"></Image>
                </div>
                <div className="mb-2 text-xl font-medium text-base-100">{item.title}</div>
                <div className="text-sm leading-[22px] text-base-100">{item.content}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white ">
        <div className="container-layout min-w-[993px]:py-20  py-12 min-[769px]:py-16">
          <div className="ads-title">Advertisement Types</div>
          {AdvertiseTypes.map((item, index) => {
            return (
              <div
                className={clsx(
                  'min-w-[993px]:gap-20 flex flex-col items-start justify-between gap-6 py-8  min-[769px]:flex-row min-[769px]:items-center min-[769px]:gap-10 min-[769px]:py-10 min-[993px]:py-12',
                  index === AdvertiseTypes.length - 1 && '!pb-0',
                  index === 0 && '!pt-0',
                  index % 2 !== 0 && 'min-[769px]:flex-row-reverse',
                )}
                key={item.key}>
                <div className="flex-1">
                  <Image width={640} height={400} className="aspect-[640/400]" src={item.image} alt={item.key}></Image>
                </div>
                <div className="flex-1">
                  <div className="min-w-[993px]:mb-4 mb-3 text-2xl  font-bold text-base-100">{item.title}</div>
                  <div className="min-w-[993px]:mb-8 mb-6 text-lg leading-[26px] text-base-200">{item.content}</div>
                  <ul className="flex flex-col gap-2">
                    {item.tips.map((tip) => {
                      return (
                        <li className="flex items-center" key={tip}>
                          <Image className="mr-4" width={8} height={8} src="/image/ellipse.svg" alt="tip"></Image>
                          <span className="inline-block text-lg leading-[26px] text-base-200">{tip}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-w-[993px]:py-20 bg-[#012254] py-12 min-[769px]:py-16">
        <div className="min-w-[993px]:pb-12 pb-8 text-center text-3xl font-bold leading-[38px]  text-white min-[769px]:pb-10">
          Contact Us to Advertise
        </div>
        <div className="flex justify-center">
          <a href="https://forms.gle/2DTrW3JybSGjyZLDA" target="_blank" rel="noreferrer">
            <div className="box-border flex h-[48px] w-[200px] items-center justify-center rounded border border-solid border-white text-sm leading-[22px] text-white hover:border-link hover:text-link">
              Apply for advertising
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
