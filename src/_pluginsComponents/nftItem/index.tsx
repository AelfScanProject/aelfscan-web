'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './index.css';
// import request from '@_api';
import NFTDetails from './NFTDetails';
import { fetchCollectionItemDetail } from '@_api/fetchNFTS';
import { TChainID } from '@_api/type';
import { ItemSymbolDetailOverview } from './type';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
export default async function NFTDetailsPage() {
  const searchParams = useSearchParams();
  const chain = searchParams.get('chainId');
  const itemSymbol: string = searchParams.get('itemSymbol') || '';
  const [overviewData, setOverviewData] = useState<ItemSymbolDetailOverview>();
  const fetchData = async () => {
    const [overview] = await Promise.all([
      fetchCollectionItemDetail({
        chainId: chain as TChainID,
        symbol: itemSymbol,
        cache: 'no-store',
      }),
    ]);
    setOverviewData(overview);
  };

  useEffectOnce(() => {
    fetchData();
  });
  return overviewData ? <NFTDetails overview={overviewData} /> : <PageLoadingSkeleton />;
}
