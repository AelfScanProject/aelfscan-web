import { IOverviewItem } from '@_components/OverviewCard/type';
import { thousandsNumber } from '@_utils/formatter';
import { ITokenDetail } from '../../type';
import NumberPercentGroup from '../NumberPercentGroup';
import OverviewCard from '@_components/OverviewCard/three';
import { MultiDown } from '@pageComponents/home/_components/InfoSection';

const multiTokenDetail = (chainIds): IOverviewItem[][] => {
  return [
    [
      {
        key: 'price',
        label: 'Price',
        render: (text, record) => (
          <NumberPercentGroup decorator="$" number={text} percent={record['pricePercentChange24h']} />
        ),
      },
    ],
    [
      {
        key: 'totalSupply',
        label: 'Max total supply',
        format: thousandsNumber,
        render: (text, record) => (
          <div className="text-base font-medium">
            {thousandsNumber(text)} {record.token?.symbol}
          </div>
        ),
        tooltip: 'The maximum number of tokens that will ever exist in the lifetime of the cryptocurrency.',
      },
      {
        key: 'mergeCirculatingSupply',
        label: 'Circulating supply',
        render: (text, record) => (
          <div>
            {chainIds.length < 2 ? (
              <div className="text-base font-medium">{thousandsNumber(text)}</div>
            ) : (
              <MultiDown mainCount={record.mainChainCirculatingSupply} sideCount={record.sideChainCirculatingSupply}>
                <div className="cursor-pointer text-base font-medium text-primary">{thousandsNumber(text)}</div>
              </MultiDown>
            )}
          </div>
        ),
        tooltip:
          "Circulating Supply is the best approximation of the number of tokens that are circulating in the market and in the general public's hands.",
      },
    ],
    [
      {
        key: 'mergeTransferCount',
        label: 'Total transfers',
        render: (text, record) => (
          <div>
            {chainIds.length < 2 ? (
              <div className="text-base font-medium">{thousandsNumber(text)}</div>
            ) : (
              <MultiDown mainCount={record.mainChainTransferCount} sideCount={record.sideChainTransferCount}>
                <div className="cursor-pointer text-base font-medium text-primary">{thousandsNumber(text)}</div>
              </MultiDown>
            )}
          </div>
        ),
      },
      {
        key: 'mergeHolders',
        label: 'Total holders',
        render: (text, record) =>
          chainIds.length < 2 ? (
            <NumberPercentGroup number={text} percent={record['holderPercentChange24H']} />
          ) : (
            <MultiDown mainCount={record.mainChainHolders} sideCount={record.sideChainHolders}>
              <div className="cursor-pointer">
                <NumberPercentGroup className="text-primary" number={text} percent={record['holderPercentChange24H']} />
              </div>
            </MultiDown>
          ),
      },
    ],
  ];
};

interface IDetailProps {
  data: Partial<ITokenDetail>;
}

export default function OverView({ data = {} }: IDetailProps) {
  const multiTokenDetailItems = multiTokenDetail(data.chainIds);

  return (
    <div className="mb-4 mt-3">
      <OverviewCard items={multiTokenDetailItems} dataSource={data} />
    </div>
  );
}
