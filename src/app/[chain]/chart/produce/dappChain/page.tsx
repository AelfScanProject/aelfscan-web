'use client';
import { useSideChain } from '@_hooks/useSelectChain';
import ProducePage from '../component';

export default function MainChain() {
  const chain = useSideChain();
  return <ProducePage chain={chain}></ProducePage>;
}
