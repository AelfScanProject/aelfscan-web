'use client';

import { Anchor, Card } from 'antd';
import './index.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useMobileContext } from '@app/pageProvider';
import PageAd from '@_components/PageAd';
import { useMultiChain } from '@_hooks/useSelectChain';

const ChartData = [
  {
    id: 'section-market-data',
    title: 'Market Data',
    charts: [
      {
        title: 'ELF Daily Price (USD) Chart',
        path: '/chart/price',
        key: 'price',
      },
      {
        title: 'aelf Market Cap Chart',
        path: '/chart/marketcap',
        key: 'marketcap',
      },
      {
        title: 'ELF Circulating Supply Growth Chart',
        path: '/chart/supply-growth',
        key: 'supply-growth',
      },
      {
        title: 'ELF Staked Chart',
        path: '/chart/staked',
        key: 'staked',
      },
      {
        title: 'TVL Chart',
        path: '/chart/tvl',
        key: 'tvl',
      },
    ],
  },
  {
    id: 'section-blockchain-data',
    title: 'Blockchain Data',
    charts: [
      {
        title: 'aelf Daily Transactions Chart',
        path: '/chart/transactions',
        key: 'transactions',
      },
      {
        title: 'aelf Cumulative Addresses Chart',
        path: '/chart/address',
        key: 'address',
      },
      {
        title: 'Monthly Active aelf Addresses',
        path: '/chart/month-address',
        key: 'month-address',
      },
      {
        title: 'Daily Active aelf Addresses',
        path: '/chart/active-address',
        key: 'active-address',
      },
      {
        title: 'ELF Holders',
        path: '/chart/holders',
        key: 'holders',
      },
      {
        title: 'Daily ELF Burnt Chart',
        path: '/chart/burnt',
        key: 'burnt',
      },
      {
        title: 'Average Transaction Fee',
        path: '/chart/avg-txfee',
        key: 'avg-txfee',
      },
      {
        title: 'aelf Daily Transaction Fee',
        path: '/chart/txfee',
        key: 'txfee',
      },
      {
        title: 'Average Block Size Chart',
        path: '/chart/blocksize',
        key: 'blocksize',
      },
      {
        title: 'aelf Daily Block Rewards Chart',
        path: '/chart/rewards',
        key: 'rewards',
      },
    ],
  },
  {
    id: 'section-network-data',
    hiddenMulti: true,
    title: 'Network Data',
    charts: [
      {
        title: 'aelf Block Production Rate Chart',
        path: '/chart/production-rate',
        key: 'production-rate',
      },
      {
        title: 'aelf Daily Cycle Count Chart',
        path: '/chart/cycle-count',
        key: 'cycle-count',
      },
      {
        title: 'aelf AVG Block Duration Chart',
        path: '/chart/avg-duration',
        key: 'avg-duration',
      },
      {
        title: 'aelf Block Producers',
        path: '/chart/produce',
        key: 'produce',
      },
    ],
  },
  {
    id: 'section-contracts-data',
    title: 'Contracts Data',
    charts: [
      {
        title: 'aelf Deployed Contracts Chart',
        path: '/chart/deployed-contracts',
        key: 'deployed-contracts',
      },
      {
        title: 'Contract Calls Chart',
        path: '/chart/contract-calls',
        key: 'contract-calls',
      },
    ],
  },
];

const items = [
  {
    key: '1',
    href: '#section-market-data',
    title: 'Market Data',
  },
  {
    key: '2',
    href: '#section-blockchain-data',
    title: 'Blockchain Data',
  },
  {
    key: '3',
    href: '#section-network-data',
    title: 'Network Data',
  },
  {
    key: '4',
    href: '#section-contracts-data',
    title: 'Contracts Data',
  },
];
export default function Page() {
  const { chartImg } = useMobileContext();
  const { chain } = useParams();
  const multi = useMultiChain();
  const chainType = useMemo(() => {
    if (multi) return 'multi';
    return chain === 'AELF' ? 'mainChain' : 'sideChain';
  }, [chain, multi]);

  const AnchorItems = useMemo(() => {
    if (multi) {
      return items.filter((item) => item.key !== '3');
    } else {
      return items;
    }
  }, [multi]);

  const renderChartData = useMemo(() => {
    if (multi) {
      return ChartData.filter((item) => !item.hiddenMulti);
    } else {
      return ChartData;
    }
  }, [multi]);

  return (
    <div className="mb-[-40px]">
      <div className="mb-6 border-b border-solid border-color-divider py-6 text-[20px] font-medium leading-[28px] text-base-100">
        aelf Charts & Statistics
      </div>
      <PageAd hiddenBorder adPage="chart" />
      <div className="charts-container flex">
        <div className="col-xl-2 col-lg-3 d-lg-block box-border hidden border-r border-solid border-color-divider pr-8">
          <div className="sticky top-[120px]">
            <Anchor targetOffset={200} items={AnchorItems} />
          </div>
        </div>

        <div className="w-full min-[993px]:pl-8">
          {renderChartData.map((chartItem) => {
            return (
              <section id={chartItem.id} key={chartItem.id} className="section-container mb-10">
                <div className="title mb-4 text-base font-medium text-base-100">{chartItem.title}</div>
                <ul className="grid items-stretch gap-5 min-[576px]:grid-cols-2 min-[1200px]:grid-cols-3">
                  {chartItem.charts.map((chart) => {
                    return (
                      <li key={chart.path}>
                        <Link href={`/${chain}${chart.path}`}>
                          <Card className="h-full">
                            <div className="mb-4 text-sm leading-[22px] text-base-100">{chart.title}</div>
                            <img
                              width={316}
                              height={106}
                              className="mx-auto block h-auto max-w-full"
                              src={chartImg[chainType][chart.key]}
                              alt="charts"></img>
                          </Card>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
