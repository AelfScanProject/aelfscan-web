'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
// import request from '@_api';
import CollectionDetails from '../CollectionDetails';
import { getCollectionDetail } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { useState } from 'react';
import { CollectionDetailData } from './type';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';

export default function NFTDetailsPage() {
  const searchParams = useSearchParams();
  const chain = searchParams.get('chainId');
  const collectionSymbol: string = searchParams.get('collectionSymbol') || '';
  console.log(chain, collectionSymbol, 'chain, collectionSymbol');
  const [overviewData, setOverviewData] = useState<CollectionDetailData>();
  const fetchData = async () => {
    const data = await getCollectionDetail({
      chainId: chain as TChainID,
      collectionSymbol,
    });
    setOverviewData(data);
  };

  useEffectOnce(() => {
    fetchData();
  });

  // init data from  server

  return overviewData ? <CollectionDetails overview={overviewData} /> : <PageLoadingSkeleton />;
}
