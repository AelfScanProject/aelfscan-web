import { TChainID } from '@_api/type';
import { thousandsNumber } from '@_utils/formatter';
import { MultiDown } from '@pageComponents/home/_components/InfoSection';
import { Skeleton } from 'antd';

export default function TokensValue({
  total,
  side,
  title,
  main,
  chainIds,
  loading,
  suffix,
  dolar,
}: {
  total: number;
  side: number;
  main: number;
  loading: boolean;
  dolar?: boolean;
  title: string;
  suffix?: string;
  chainIds: TChainID[];
}) {
  return (
    <div>
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      {loading ? (
        <Skeleton.Input active />
      ) : chainIds.length < 2 ? (
        <div className="text-xl font-semibold">
          {dolar && '$'}
          {thousandsNumber(total)}
        </div>
      ) : (
        <MultiDown mainCount={main} sideCount={side} dolar={dolar}>
          <div className="cursor-pointer text-xl font-semibold text-primary">
            {dolar && '$'}
            {thousandsNumber(total)} {suffix}
          </div>
        </MultiDown>
      )}
    </div>
  );
}
