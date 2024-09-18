import React from 'react';
import IconFont from '@_components/IconFont';
import { CollectionDetailData } from '../type';

import '../detail.css';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';
import { useSearchParams } from 'next/navigation';
import { TChainID } from '@_api/type';
import { addSymbol, thousandsNumber } from '@_utils/formatter';
import EPTooltip from '@_components/EPToolTip';
import HeadTitle from '@_components/HeaderTitle';
import { FontWeightEnum, Typography } from 'aelf-design';
import { useMultiChain, useSideChain } from '@_hooks/useSelectChain';
import OverviewThreeCard from '@_components/OverviewCard/three';
import { IOverviewItem } from '@_components/OverviewCard/type';
import NumberPercentGroup from '@app/[chain]/token/[tokenSymbol]/_components/NumberPercentGroup';
const { Title } = Typography;

export interface OverViewProps {
  overview: CollectionDetailData;
}
export default function OverView(props: OverViewProps) {
  const searchParams = useSearchParams();
  const chain = searchParams.get('chainId');
  const { overview } = props;
  const multi = useMultiChain();
  const sideChain = useSideChain();

  const multiDetail = (): IOverviewItem[][] => {
    return [
      [
        {
          key: 'Items',
          label: 'Items',
          format: thousandsNumber,
          tooltip: 'The total number of NFT items in the collection',
          render: (text, record) => <div className="text-sm leading-[22px] text-base-100">{thousandsNumber(1000)}</div>,
        },
        {
          key: 'mainFloorPrice',
          label: 'MainChain FLOOR PRICE',
          render: (text, record) => (
            <div className="text-sm leading-[22px] text-base-100">
              $0.17<span className="ml-1 inline-block text-sm font-normal leading-[22px] text-base-200">(0.1ELF)</span>
            </div>
          ),
        },
        {
          key: 'sideFloorPrice',
          label: 'SideChain FLOOR PRICE',
          render: (text, record) => (
            <div className="text-sm leading-[22px] text-base-100">
              $0.17<span className="ml-1 inline-block text-sm font-normal leading-[22px] text-base-200">(0.1ELF)</span>
            </div>
          ),
        },
      ],
      [
        {
          key: 'holders',
          label: 'TOTAL HOLDERS',
          render: (text, record) => <NumberPercentGroup decorator="" number={222} percent={'0.11122'} />,
        },
        {
          key: 'MainChainHOLDERS',
          label: 'MainChain HOLDERS',
          render: (text, record) => <div className="text-sm leading-[22px] text-base-100">4099</div>,
        },
        {
          key: 'SideChainHOLDERS',
          label: 'SideChain HOLDERS',
          render: (text, record) => <div className="text-sm leading-[22px] text-base-100">40999</div>,
        },
      ],
      [
        {
          key: 'TOTALTRANSFERS',
          label: 'TOTAL TRANSFERS',
          render: (text, record) => <div className="text-sm leading-[22px] text-base-100">4099</div>,
        },
        {
          key: 'MainChainTRANSFERS',
          label: 'MainChain TRANSFERS',
          render: (text, record) => <div className="text-sm leading-[22px] text-base-100">4099</div>,
        },
        {
          key: 'SideTRANSFERS',
          label: 'Side TRANSFERS',
          render: (text, record) => <div className="text-sm leading-[22px] text-base-100">40999</div>,
        },
      ],
    ];
  };

  const multiDetailItems = multiDetail();
  return (
    <div className="collection-overview-wrap">
      <HeadTitle
        content={`${overview?.nftCollection?.name || '--'}`}
        adPage="nftdetail"
        mainLink={multi ? `/nft?chainId=AELF&&collectionSymbol=${overview?.nftCollection?.symbol}` : ''}
        sideLink={multi ? `/nft?chainId=${sideChain}&&collectionSymbol=${overview?.nftCollection?.symbol}` : ''}>
        <Title
          level={6}
          fontWeight={FontWeightEnum.Bold}
          className="ml-1 !text-[#858585]">{`(${overview?.nftCollection?.symbol || '--'})`}</Title>
      </HeadTitle>
      {multi ? (
        <OverviewThreeCard items={multiDetailItems} dataSource={overview} title="Overview" />
      ) : (
        <div className="collection-overview-body">
          <h2 className="flex items-center">Overview</h2>
          <div className="collection-overview-data">
            <ul className="collection-overview-left">
              <li className="collection-overview-data-item">
                <div className="title">
                  <span className="icon">
                    <EPTooltip title="The total number of NFT items in the collection" mode="dark" pointAtCenter={true}>
                      <IconFont type="question-circle" />
                    </EPTooltip>
                  </span>
                  ITEMS
                </div>
                <div className="desc">{thousandsNumber(overview.items)}</div>
              </li>
              <li className="collection-overview-data-item">
                <div className="title">HOLDERS</div>
                <div className="desc">{thousandsNumber(overview.holders)}</div>
              </li>
              <li className="collection-overview-data-item">
                <div className="title">TOTAL TRANSFERS</div>
                <div className="desc">{thousandsNumber(overview.transferCount)}</div>
              </li>
            </ul>
            <ul className="collection-overview-right">
              <li className="collection-overview-data-item">
                <div className="title">
                  <span className="icon">
                    <EPTooltip
                      title="This is the MultiToken contract that defines a common implementation for fungible and non-fungible tokens."
                      mode="dark"
                      pointAtCenter={true}>
                      <IconFont type="question-circle" />
                    </EPTooltip>
                  </span>
                  CONTRACT
                </div>
                <div className="desc item-center flex">
                  <IconFont className="mr-1 text-sm" type="Contract" />
                  <ContractToken
                    address={overview.tokenContractAddress}
                    type={AddressType.address}
                    chainId={chain as TChainID}
                  />
                </div>
              </li>
              <li className="collection-overview-data-item">
                <div className="title">
                  <span className="icon">
                    <EPTooltip
                      title="The lowest listing price of an NFT item in the collection"
                      mode="dark"
                      pointAtCenter={true}>
                      <IconFont type="question-circle" />
                    </EPTooltip>
                  </span>
                  FLOOR PRICE
                </div>
                <div className="desc h-[22px]">
                  {overview.floorPrice !== -1 ? (
                    <>
                      <span className="inline-block leading-[22px]">${overview.floorPriceOfUsd}</span>
                      <span className="ml-1 inline-block text-xs leading-[22px] text-base-200">
                        ({addSymbol(overview.floorPrice)})
                      </span>
                    </>
                  ) : (
                    '--'
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
