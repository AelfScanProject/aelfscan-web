'use client';
import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
// import request from '@_api';
import CollectionDetails from './CollectionDetails';
import { getCollectionDetail } from '@_api/fetchNFTS';
import { useState } from 'react';
import { CollectionDetailData } from './type';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { getChainId } from '@_utils/formatter';

export default function NFTDetailsPage() {
  const searchParams = useSearchParams();
  const collectionSymbol: string = searchParams.get('collectionSymbol') || '';
  const [overviewData, setOverviewData] = useState<CollectionDetailData>();
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await getCollectionDetail({
      chainId: getChainId(''),
      collectionSymbol,
    });
    setOverviewData(data);
    setLoading(false);
  }, [collectionSymbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // init data from  server

  return !loading && overviewData ? <CollectionDetails overview={overviewData} /> : <PageLoadingSkeleton />;
}
