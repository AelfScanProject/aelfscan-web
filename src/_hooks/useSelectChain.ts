import { TChainID } from '@_api/type';
import { MULTI_CHAIN } from '@_utils/contant';
import { checkMainNet } from '@_utils/isMainNet';
import { useEnvContext } from 'next-runtime-env';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useMultiChain = () => {
  const { chain } = useParams<{
    chain: TChainID;
  }>();
  const multi = useMemo(() => {
    return chain === MULTI_CHAIN;
  }, [chain]);

  return multi;
};

export const useMainNet = () => {
  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  return isMainNet;
};
