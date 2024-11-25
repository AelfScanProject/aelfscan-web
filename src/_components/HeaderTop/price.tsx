import { useAppSelector } from '@_store';
import clsx from 'clsx';

export default function TokenPrice() {
  const { tokenInfo: overview } = useAppSelector((state) => state.getChainId);
  const { tokenPriceInUsd = 0, tokenPriceRate24h = 0 } = overview || {};
  return (
    overview && (
      <div className="text-xs leading-4">
        <span className="text-muted-foreground">ELF Price: </span>
        <span className="price text-foreground">${tokenPriceInUsd} </span>
        <span className={clsx(`${tokenPriceRate24h < 0 ? 'text-destructive' : 'text-success'}`, 'range')}>
          ({tokenPriceRate24h <= 0 ? tokenPriceRate24h : `+${tokenPriceRate24h}`}%)
        </span>
      </div>
    )
  );
}
