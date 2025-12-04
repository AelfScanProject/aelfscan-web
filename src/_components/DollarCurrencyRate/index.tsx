import { numberFormatter } from '@_utils/formatter';

export default function DollarCurrencyRate({ nowPrice, tradePrice }: { nowPrice: string; tradePrice: string }) {
  return (
    <div className="ml-1 flex h-6 items-center">
      <span className="text-sm leading-[16px] text-muted-foreground">(${numberFormatter(nowPrice, '')})</span>
    </div>
  );
}
