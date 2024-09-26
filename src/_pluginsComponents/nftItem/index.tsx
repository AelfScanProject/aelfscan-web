'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './index.css';
import NFTDetails from './NFTDetails';
import { fetchCollectionItemDetail } from '@_api/fetchNFTS';
import { ItemSymbolDetailOverview } from './type';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { getChainId } from '@_utils/formatter';
export default async function NFTDetailsPage() {
  const searchParams = useSearchParams();
  const chain = searchParams.get('chainId');
  const itemSymbol: string = searchParams.get('itemSymbol') || '';
  const [overviewData, setOverviewData] = useState<ItemSymbolDetailOverview>();
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [overview] = await Promise.all([
      fetchCollectionItemDetail({
        chainId: getChainId(chain || ''),
        symbol: itemSymbol,
        cache: 'no-store',
      }),
    ]);
    setLoading(false);
    setOverviewData(overview);
  }, [chain, itemSymbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return !loading && overviewData ? <NFTDetails overview={overviewData} /> : <PageLoadingSkeleton />;
}
