'use client';

import { Anchor, Card, Divider } from 'antd';
import Image from 'next/image';
import './index.css';
import ChartSVG from 'public/image/chart.svg';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEnvContext } from 'next-runtime-env';
import { checkMainNet } from '@_utils/isMainNet';
import { useMemo } from 'react';

const getChartData = (network, chain) => {
  const chainPath = chain !== 'AELF' ? `side/` : '';
  return [
    // {
    //   id: 'section-market-data',
    //   title: 'Market Data',
    //   charts: [
    //     {
    //       title: 'AelfDaily Transactions Chart',
    //       path: '/chart/DailyTransactions',
    //       imgUrl: ChartSVG,
    //     },
    //   ],
    // },
    {
      id: 'section-blockchain-data',
      title: 'Blockchain Data',
      charts: [
        {
          title: 'aelf Daily Transactions Chart',
          path: '/chart/DailyTransactions',
          imgUrl: `/image/${network}/${chainPath}aelfDailyTransactionChart.png?v0.0.1`,
        },
        {
          title: 'aelf Unique Addresses Chart',
          path: '/chart/dailyAddAddress',
          imgUrl: `/image/${network}/${chainPath}AelfUniqueAddressesChart.png?v0.0.1`,
        },
        {
          title: 'Active aelf Addresses Chart',
          path: '/chart/dailyActiveAddress',
          imgUrl: `/image/${network}/${chainPath}ActiveAelfAddressesChart.png?v0.0.1`,
        },
      ],
    },
    {
      id: 'section-network-data',
      title: 'Network Data',
      charts: [
        {
          title: 'aelf Block Production Rate Chart',
          path: '/chart/BlockProductionRate',
          imgUrl: `/image/${network}/${chainPath}aelfBlockProductionRateChart.png?v0.0.1`,
        },
        {
          title: 'aelf Daily Cycle Count Chart',
          path: '/chart/AelfDailyCycleCount',
          imgUrl: `/image/${network}/${chainPath}aelfDailyCycleCountChart.png?v0.0.1`,
        },
        {
          title: 'aelf AVG Block Duration Chart',
          path: '/chart/AelfAVGBlockDuration',
          imgUrl: `/image/${network}/${chainPath}aelfAvgBlockDurationChart.png?v0.0.1`,
        },
        {
          title: 'aelf Block Producers',
          path: '/chart/nodeBlockProduce',
          imgUrl: '/image/table-preview.png?v0.0.1',
        },
      ],
    },
    // {
    //   id: 'section-contracts-data',
    //   title: 'Contracts Data',
    //   charts: [
    //     {
    //       title: 'AelfDaily Transactions Chart',
    //       path: '/chart/DailyTransactions',
    //       imgUrl: ChartSVG,
    //     },
    //   ],
    // },
  ];
};

const items = [
  // {
  //   key: '1',
  //   href: '#section-market-data',
  //   title: 'Market Data',
  // },
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
  // {
  //   key: '4',
  //   href: '#section-contracts-data',
  //   title: 'Contracts Data',
  // },
];

export default function Page() {
  const { NEXT_PUBLIC_NETWORK_TYPE } = useEnvContext();
  const isMainNet = checkMainNet(NEXT_PUBLIC_NETWORK_TYPE);
  const { chain } = useParams();
  const chartData = useMemo(() => {
    return getChartData(isMainNet ? 'main' : 'testnet', chain);
  }, [chain, isMainNet]);
  return (
    <div className="mb-[-40px]">
      <div className="mb-6 border-b border-solid border-color-divider py-6 text-[20px] font-medium leading-[28px] text-base-100">
        aelf Charts & Statistics
      </div>
      <div className="charts-container flex">
        <div className="col-xl-2 col-lg-3 d-lg-block box-border hidden border-r border-solid border-color-divider pr-8">
          <div className="sticky top-[120px]">
            <Anchor targetOffset={200} items={items} />
          </div>
        </div>
        <div className="w-full min-[993px]:pl-8">
          {chartData.map((chartItem) => {
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
                            <Image
                              width={316}
                              height={106}
                              className="mx-auto block h-auto max-w-full"
                              src={chart.imgUrl}
                              alt="charts"></Image>
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
