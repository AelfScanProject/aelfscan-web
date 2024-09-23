import ContractToken from '@_components/ContractToken';
import OverviewCard from '@_components/OverviewCard';
import { IOverviewItem } from '@_components/OverviewCard/type';
import { thousandsNumber } from '@_utils/formatter';
import { ITokenDetail } from '../../type';
import NumberPercentGroup from '../NumberPercentGroup';
import { AddressType } from '@_types/common';
import { useParams } from 'next/navigation';
import { usePad } from '@_hooks/useResponsive';
import clsx from 'clsx';
import Overview from '@_components/AddressDetail/components/overview';
import { useMultiChain, useSideChain } from '@_hooks/useSelectChain';
import Link from 'next/link';
import { useMemo } from 'react';
import OverviewFourCard from '@_components/OverviewCard/four';

const TokenDetail = (chain): IOverviewItem[] => {
  return [
    {
      key: 'totalSupply',
      label: 'MAXIMUM SUPPLY',
      format: thousandsNumber,
      tooltip: 'The maximum number of tokens that will ever exist in the lifetime of the cryptocurrency.',
    },
    {
      key: 'circulatingSupply',
      label: 'CIRCULATING SUPPLY',
      format: thousandsNumber,
      tooltip:
        "Circulating Supply is the best approximation of the number of tokens that are circulating in the market and in the general public's hands.",
    },
    {
      key: 'holders',
      label: 'HOLDERS',
      render: (text, record) => <NumberPercentGroup number={text} percent={record['holderPercentChange24H']} />,
    },
    {
      key: 'transferCount',
      label: 'TOTAL TRANSFERS',
      format: thousandsNumber,
    },
    {
      key: 'price',
      label: 'PRICE',
      render: (text, record) => (
        <NumberPercentGroup decorator="$" number={text} percent={record['pricePercentChange24h']} />
      ),
    },
    {
      key: 'tokenContractAddress',
      label: 'CONTRACT',
      tooltip:
        'This is the MultiToken contract that defines a common implementation for fungible and non-fungible tokens.',
      render: (text) => (text ? <ContractToken address={text} type={AddressType.address} chainId={chain} /> : '--'),
    },
    {
      key: 'token',
      label: 'DECIMAL',
      render: (token) => (token.decimals || token.decimals === 0 ? token.decimals : '--'),
    },
  ];
};

const multiTokenDetail = (): IOverviewItem[][] => {
  return [
    [
      {
        key: 'totalSupply',
        label: 'MAXIMUM SUPPLY',
        format: thousandsNumber,
        tooltip: 'The maximum number of tokens that will ever exist in the lifetime of the cryptocurrency.',
      },
      {
        key: 'price',
        label: 'PRICE',
        render: (text, record) => (
          <NumberPercentGroup decorator="$" number={text} percent={record['pricePercentChange24h']} />
        ),
      },
    ],
    [
      {
        key: 'circulatingSupply',
        label: 'CIRCULATING SUPPLY',
        format: thousandsNumber,
        tooltip:
          "Circulating Supply is the best approximation of the number of tokens that are circulating in the market and in the general public's hands.",
      },
      {
        key: 'mainChainCirculatingSupply',
        label: 'MainChain CIRCULATING SUPPLY',
        format: thousandsNumber,
      },
      {
        key: 'sideChainCirculatingSupply',
        label: 'SideChain CIRCULATING SUPPLY',
        format: thousandsNumber,
      },
    ],
    [
      {
        key: 'mergeHolders',
        label: 'TOTAL HOLDERS',
        render: (text, record) => <NumberPercentGroup number={text} percent={record['holderPercentChange24H']} />,
      },
      {
        key: 'mainChainHolders',
        label: 'MainChain HOLDERS',
        format: thousandsNumber,
      },
      {
        key: 'sideChainHolders',
        label: 'SideChain HOLDERS',
        format: thousandsNumber,
      },
    ],
    [
      {
        key: 'transferCount',
        label: 'TOTAL TRANSFERS',
        format: thousandsNumber,
      },
      {
        key: 'mainChainTransferCount',
        label: 'MainChain TRANSFERS',
        format: thousandsNumber,
      },
      {
        key: 'sideChainTransferCount',
        label: 'SideChain TRANSFERS',
        format: thousandsNumber,
      },
    ],
  ];
};

interface IDetailProps {
  data: Partial<ITokenDetail>;
}

export default function OverView({ data = {} }: IDetailProps) {
  const { chain, tokenSymbol } = useParams();
  const TokenDetailItems = TokenDetail(chain);
  const isPad = usePad();
  const multi = useMultiChain();
  const sideChain = useSideChain();

  const MultiChainInfo = useMemo(() => {
    const chainId = chain === 'AELF' ? sideChain : 'AELF';
    return [
      {
        label: 'Multichain Holders',
        value: <span className="inline-block leading-[22px]">{thousandsNumber(data?.mergeHolders || 0)}</span>,
      },
      {
        label: 'Multichain',
        value:
          data?.chainIds?.length && data?.chainIds?.length > 1 ? (
            <div className="flex items-center">
              <Link className="h-[22px]" href={`/${chainId}/token/${tokenSymbol}`}>
                <span className="inline-block max-w-[120px] truncate text-sm leading-[22px] text-link">
                  SideChain {chainId}
                </span>
              </Link>
              <span className="ml-1 inline-block text-base-100">
                ({thousandsNumber(chain === 'AELF' ? data?.sideChainHolders || 0 : data?.mainChainHolders || 0)}{' '}
                Holders)
              </span>
            </div>
          ) : (
            '--'
          ),
      },
    ];
  }, [chain, data, sideChain, tokenSymbol]);

  const multiTokenDetailItems = multiTokenDetail();

  return (
    <div className="mb-4">
      {multi ? (
        <OverviewFourCard items={multiTokenDetailItems} dataSource={data} />
      ) : (
        <div className={clsx(isPad && 'flex-col', 'address-overview flex gap-4')}>
          <div className="flex-1">
            <OverviewCard items={TokenDetailItems} dataSource={data} breakIndex={4} />
          </div>
          {!multi && (
            <Overview title="Multichain Info" className={` ${isPad && '!w-full'} w-[448px]`} items={MultiChainInfo} />
          )}
        </div>
      )}
    </div>
  );
}
