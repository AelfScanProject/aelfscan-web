import React, { useMemo } from 'react';
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
import Overview from '@_components/AddressDetail/components/overview';
import Link from 'next/link';
import { usePad } from '@_hooks/useResponsive';
import clsx from 'clsx';
const { Title } = Typography;

export interface OverViewProps {
  overview: CollectionDetailData;
}
const multiDetail = (overview: CollectionDetailData): IOverviewItem[][] => {
  return [
    [
      {
        key: 'mergeItems',
        label: 'Items',
        format: thousandsNumber,
        tooltip: 'The total number of NFT items in the collection',
        render: (text, record) => (
          <div className="text-sm leading-[22px] text-base-100">{thousandsNumber(overview.mergeItems)}</div>
        ),
      },
      {
        key: 'mainChainFloorPrice',
        label: 'MainChain FLOOR PRICE',
        render: (text, record) =>
          record.mainChainFloorPrice !== -1 ? (
            <div className="text-sm leading-[22px] text-base-100">
              ${record.mainChainFloorPriceOfUsd}
              <span className="ml-1 inline-block text-sm font-normal leading-[22px] text-base-200">
                ({addSymbol(record.mainChainFloorPrice)})
              </span>
            </div>
          ) : (
            '--'
          ),
      },
      {
        key: 'sideChainFloorPrice',
        label: 'SideChain FLOOR PRICE',
        render: (text, record) =>
          record.sideChainFloorPrice !== -1 ? (
            <div className="text-sm leading-[22px] text-base-100">
              ${record.sideChainFloorPriceOfUsd}
              <span className="ml-1 inline-block text-sm font-normal leading-[22px] text-base-200">
                ({addSymbol(record.sideChainFloorPrice)})
              </span>
            </div>
          ) : (
            '--'
          ),
      },
    ],
    [
      {
        key: 'mergeHolders',
        label: 'TOTAL HOLDERS',
        format: thousandsNumber,
      },
      {
        key: 'mainChainHolders',
        label: 'MainChain HOLDERS',
        format: thousandsNumber,
      },
      {
        key: 'sideChainHolders',
        format: thousandsNumber,
        label: 'SideChain HOLDERS',
      },
    ],
    [
      {
        key: 'mergeTransferCount',
        label: 'TOTAL TRANSFERS',
        format: thousandsNumber,
      },
      {
        key: 'mainChainTransferCount',
        label: 'MainChain TRANSFERS',
        format: thousandsNumber,
      },
      {
        key: 'sideChainTransferCount',
        label: 'Side TRANSFERS',
        format: thousandsNumber,
      },
    ],
  ];
};
export default function OverView(props: OverViewProps) {
  const searchParams = useSearchParams();
  const chain = searchParams.get('chainId');
  const { overview } = props;
  const multi = useMultiChain();
  const sideChain = useSideChain();
  const isPad = usePad();
  const collectionSymbol: string = searchParams.get('collectionSymbol') || '';

  const MultiChainInfo = useMemo(() => {
    const chainId = chain === 'AELF' ? sideChain : 'AELF';
    return [
      {
        label: 'Multichain Holders',
        value: <span className="inline-block leading-[22px]">{thousandsNumber(overview?.mergeHolders || 0)}</span>,
      },
      {
        label: 'Multichain',
        value:
          overview?.chainIds?.length && overview?.chainIds?.length > 1 ? (
            <div className="flex items-center">
              <Link className="h-[22px]" href={`/nft?chainId=${chainId}&&collectionSymbol=${collectionSymbol}`}>
                <span className="inline-block max-w-[120px] truncate text-sm leading-[22px] text-link">
                  SideChain {chainId}
                </span>
              </Link>
              <span className="ml-1 inline-block text-base-100">
                ({thousandsNumber(chain === 'AELF' ? overview?.sideChainHolders || 0 : overview?.mainChainHolders || 0)}{' '}
                Holders)
              </span>
            </div>
          ) : (
            '--'
          ),
      },
    ];
  }, [chain, overview, sideChain, collectionSymbol]);

  const multiDetailItems = multiDetail(overview);
  return (
    <div className="collection-overview-wrap">
      <HeadTitle
        content={`${overview?.nftCollection?.name || '--'}`}
        adPage="nftdetail"
        mainLink={
          multi && overview.chainIds?.includes('AELF')
            ? `/nft?chainId=AELF&&collectionSymbol=${overview?.nftCollection?.symbol}`
            : ''
        }
        sideLink={
          multi && overview.chainIds?.includes(sideChain)
            ? `/nft?chainId=${sideChain}&&collectionSymbol=${overview?.nftCollection?.symbol}`
            : ''
        }>
        <Title
          level={6}
          fontWeight={FontWeightEnum.Bold}
          className="ml-1 !text-[#858585]">{`(${overview?.nftCollection?.symbol || '--'})`}</Title>
      </HeadTitle>
      {multi ? (
        <OverviewThreeCard items={multiDetailItems} dataSource={overview} title="Overview" />
      ) : (
        <div className={clsx(isPad && 'flex-col', 'address-overview flex gap-4')}>
          <div className="collection-overview-body flex-1">
            <h2 className="flex items-center">Overview</h2>
            <div className="collection-overview-data">
              <ul className="collection-overview-left">
                <li className="collection-overview-data-item">
                  <div className="title">
                    ITEMS
                    <span className="icon">
                      <EPTooltip
                        title="The total number of NFT items in the collection"
                        mode="dark"
                        pointAtCenter={true}>
                        <IconFont type="question-circle" />
                      </EPTooltip>
                    </span>
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
                    CONTRACT
                    <span className="icon">
                      <EPTooltip
                        title="This is the MultiToken contract that defines a common implementation for fungible and non-fungible tokens."
                        mode="dark"
                        pointAtCenter={true}>
                        <IconFont type="question-circle" />
                      </EPTooltip>
                    </span>
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
                    FLOOR PRICE
                    <span className="icon">
                      <EPTooltip
                        title="The lowest listing price of an NFT item in the collection"
                        mode="dark"
                        pointAtCenter={true}>
                        <IconFont type="question-circle" />
                      </EPTooltip>
                    </span>
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
          {!multi && (
            <Overview title="Multichain Info" className={` ${isPad && '!w-full'} w-[448px]`} items={MultiChainInfo} />
          )}
        </div>
      )}
    </div>
  );
}
