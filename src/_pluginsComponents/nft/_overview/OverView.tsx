import React from 'react';
import { CollectionDetailData } from '../type';

import '../detail.css';
import { thousandsNumber } from '@_utils/formatter';
import HeadTitle from '@_components/HeaderTitle';
import OverviewThreeCard from '@_components/OverviewCard/three';
import { IOverviewItem } from '@_components/OverviewCard/type';
import { MultiDown } from '@pageComponents/home/_components/InfoSection';

export interface OverViewProps {
  overview: CollectionDetailData;
}
const multiDetail = (overview: CollectionDetailData): IOverviewItem[][] => {
  const { chainIds } = overview;
  return [
    [
      {
        key: 'mergeItems',
        label: 'Items',
        format: thousandsNumber,
        tooltip: 'The total number of NFT items in the collection',
      },
    ],
    [
      {
        key: 'Floor price',
        label: 'Floor price',
        render: (text, record) => {
          const main = record.mainChainFloorPrice !== -1 ? record.mainChainFloorPriceOfUsd : '--';
          const side = record.sideChainFloorPrice !== -1 ? record.sideChainFloorPrice : '--';
          return chainIds.length < 2 ? (
            <div className="text-base font-medium">{chainIds[0] === 'AELF' ? main : side}</div>
          ) : (
            <MultiDown mainCount={main} sideCount={side}>
              <div className="cursor-pointer text-base font-medium text-primary">
                {record.mainChainFloorPrice !== -1 && '$'}
                {main}
              </div>
            </MultiDown>
          );
        },
      },
    ],
    [
      {
        key: 'mergeHolders',
        label: 'Total holders',
        render: (text, record) =>
          chainIds.length < 2 ? (
            <div className="text-base font-medium">{thousandsNumber(text)}</div>
          ) : (
            <MultiDown mainCount={record.mainChainHolders} sideCount={record.sideChainHolders}>
              <div className="cursor-pointer text-base font-medium text-primary">{thousandsNumber(text)}</div>
            </MultiDown>
          ),
      },
    ],
    [
      {
        key: 'mergeTransferCount',
        label: 'Total transfers',
        render: (text, record) =>
          chainIds.length < 2 ? (
            <div className="text-base font-medium">{thousandsNumber(text)}</div>
          ) : (
            <MultiDown mainCount={record.mainChainTransferCount} sideCount={record.sideChainTransferCount}>
              <div className="cursor-pointer text-base font-medium text-primary">{thousandsNumber(text)}</div>
            </MultiDown>
          ),
      },
    ],
  ];
};
export default function OverView(props: OverViewProps) {
  const { overview } = props;
  console.log(overview, 'overview');

  const multiDetailItems = multiDetail(overview);
  return (
    <div className="collection-overview-wrap">
      <HeadTitle content={`${overview?.nftCollection?.name || '--'}`} adPage="tokendetail" className="!block">
        <div className="inline-block text-xl text-muted-foreground">{`(${overview?.nftCollection?.symbol || '--'})`}</div>
      </HeadTitle>
      <div className="mt-3">
        <OverviewThreeCard items={multiDetailItems} dataSource={overview} title="Overview" />
      </div>
    </div>
  );
}
