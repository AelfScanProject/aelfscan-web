import { TChainID } from '@_api/type';
import { MULTI_CHAIN } from '@_utils/contant';
import { checkMainNet } from '@_utils/isMainNet';
import { useEnvContext } from 'next-runtime-env';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export const useMultiChain = () => {
  const { chain } = useParams<{
    chain: TChainID;
  }>();
  const searchParams = useSearchParams();
  const searchChain = searchParams.get('chainId');
  const multi = useMemo(() => {
    return chain === MULTI_CHAIN || searchChain === MULTI_CHAIN;
  }, [chain, searchChain]);

  return multi;
};

export const useMainNet = () => {
  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  return isMainNet;
};

export const useSideChain = () => {
  const isMainNet = useMainNet();
  return isMainNet ? 'tDVV' : 'tDVW';
};

export const useCurrentPageChain = () => {
  const searchParams = useSearchParams();
  const { chain } = useParams<{ chain: string }>();

  const pageChain: string = useMemo(() => {
    return searchParams.get('chainId') || chain;
  }, [chain, searchParams]);

  return pageChain;
};
