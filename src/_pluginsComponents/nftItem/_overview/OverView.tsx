import React from 'react';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import { Collapse, CollapseProps } from 'antd';
import OverViewDetail from './OverViewDetail';
import OverViewProperty from './OverViewProperty';
import { ItemSymbolDetailOverview } from '../type';
import NFTImage from '@_components/NFTImage';
import { Typography } from 'antd';
import { useSearchParams } from 'next/navigation';
import HeadTitle from '@_components/HeaderTitle';
import MultiChain from '@_components/ContractToken/multiChain';

const { Paragraph } = Typography;

export interface OverViewProps {
  overview: ItemSymbolDetailOverview;
  onHolderClick: () => void;
}

export default function OverView(props: OverViewProps) {
  const { overview, onHolderClick } = props;
  const { description, properties } = overview;
  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      showArrow: false,
      label: (
        <div className="nft-detail-label">
          <div className="nft-detail-label-left">
            <IconFont className="text-base" type="list" />
            <div className="text-base">Details</div>
          </div>
          <div className="nft-detail-label-right">
            <IconFont className="text-base" type="chevron-down-f731al7b" />
          </div>
        </div>
      ),
      children: <OverViewDetail overview={overview} onHolderClick={onHolderClick} />,
    },
  ];
  if (properties) {
    collapseItems.push({
      key: '2',
      showArrow: false,
      collapsible: properties ? 'header' : 'disabled',
      label: (
        <div className="nft-detail-label">
          <div className="nft-detail-label-left">
            <IconFont type="box" />
            <span>Properties &#40;{properties?.length}&#41;</span>
          </div>
          <div className="nft-detail-label-right">
            <IconFont type="Down" />
          </div>
        </div>
      ),
      children: <OverViewProperty properties={properties} />,
    });
  }
  if (description) {
    collapseItems.push({
      key: '3',
      showArrow: false,
      label: (
        <div className="nft-detail-label">
          <div className="nft-detail-label-left">
            <IconFont type="page" />
            <span>Description</span>
          </div>
          <div className="nft-detail-label-right">
            <IconFont type="Down" />
          </div>
        </div>
      ),
      children: (
        <div className="nft-detail-ul flex">
          <Paragraph ellipsis={{ rows: 5, expandable: true, symbol: 'more' }}>{description}</Paragraph>
        </div>
      ),
    });
  }

  return (
    <div className="ntf-overview-wrap">
      <div className="nft-image-wrap">
        <NFTImage className="nft-image" src={overview.item?.imageUrl} />
      </div>
      <div className="nft-detail-wrap">
        <div className="nft-title-wrap">
          {/* <h1 className="nft-title">{overview.item?.name}</h1> */}
          <HeadTitle
            content={overview.item?.name}
            rootClassName="!pt-0 !pb-4"
            hiddenAds
            adPage="collectionItemDetail"
          />
          <div className="nft-thumb">
            <div className="nft-thumb-image-wrap">
              <NFTImage className="aspect-square w-full object-cover" src={overview.nftCollection?.imageUrl} />
            </div>
            <Link
              href={`/nft?chainId=${MultiChain}&&collectionSymbol=${overview.nftCollection?.symbol}`}
              className="text-sm text-primary">
              {overview.nftCollection?.name}
            </Link>
          </div>
        </div>
        <div className="nft-detail">
          <Collapse defaultActiveKey={['1']} items={collapseItems} ghost />
        </div>
      </div>
    </div>
  );
}
