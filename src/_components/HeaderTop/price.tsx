'use client';
import { useMainNet } from '@_hooks/useSelectChain';
import { useAppSelector } from '@_store';
import clsx from 'clsx';

export default function TokenPrice() {
  const { tokenInfo: overview } = useAppSelector((state) => state.getChainId);
  const { tokenPriceInUsd = 0, tokenPriceRate24h = 0 } = overview || {};

  const main = useMainNet();
  return (
    overview &&
    (main ? (
      <div className="text-xs leading-4">
        <span className="text-muted-foreground">ELF Price: </span>
        <span className="price text-foreground">${tokenPriceInUsd} </span>
        <span className={clsx(`${tokenPriceRate24h < 0 ? 'text-destructive' : 'text-success'}`, 'range')}>
          ({tokenPriceRate24h <= 0 ? tokenPriceRate24h : `+${tokenPriceRate24h}`}%)
        </span>
      </div>
    ) : (
      <div className="rounded border border-border bg-secondary px-1 py-[2px] text-xs text-secondary-foreground">
        Testnet
      </div>
    ))
  );
}
