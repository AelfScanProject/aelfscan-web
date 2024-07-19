'use client';

import { Anchor, Card } from 'antd';
import Image from 'next/image';
import './index.css';
import ChartSVG from 'public/image/chart.svg';
import ProduceImg from 'public/image/produce.png';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEnvContext } from 'next-runtime-env';
import { checkMainNet } from '@_utils/isMainNet';
import { useMemo } from 'react';
import { AdTracker } from '@_utils/ad';
import { Button } from 'aelf-design';

const getChartData = (network, chain) => {
  const chainPath = chain !== 'AELF' ? `side/` : '';
  return [
    {
      id: 'section-market-data',
      title: 'Market Data',
      charts: [
        {
          title: 'ELF Daily Price (USD) Chart',
          path: '/chart/price',
          imgUrl: `/image/${network}/${chainPath}price.png?v0.0.2`,
        },
        {
          title: 'aelf Market Cap Chart',
          path: '/chart/marketcap',
          imgUrl: `/image/${network}/${chainPath}marketcap.png?v0.0.2`,
        },
        {
          title: 'ELF Supply Growth Chart',
          path: '/chart/supply-growth',
          imgUrl: `/image/${network}/${chainPath}supply-growth.png?v0.0.2`,
        },
        {
          title: 'ELF Staked Chart',
          path: '/chart/staked',
          imgUrl: `/image/${network}/${chainPath}staked.png?v0.0.2`,
        },
        {
          title: 'TVL Chart',
          path: '/chart/tvl',
          imgUrl: `/image/${network}/${chainPath}tvl.png?v0.0.3`,
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
          imgUrl: `/image/${network}/${chainPath}transactions.png?v0.0.2`,
        },
        {
          title: 'aelf Unique Addresses Chart',
          path: '/chart/address',
          imgUrl: `/image/${network}/${chainPath}address.png?v0.0.2`,
        },
        {
          title: 'Active aelf Addresses Chart',
          path: '/chart/active-address',
          imgUrl: `/image/${network}/${chainPath}active-address.png?v0.0.2`,
        },
        {
          title: 'ELF Holders Account',
          path: '/chart/holders',
          imgUrl: `/image/${network}/${chainPath}holders.png?v0.0.2`,
        },
        {
          title: 'Daily ELF Burnt Chart',
          path: '/chart/burnt',
          imgUrl: `/image/${network}/${chainPath}burnt.png?v0.0.2`,
        },
        {
          title: 'Average Transaction Fee',
          path: '/chart/avg-txfee',
          imgUrl: `/image/${network}/${chainPath}avg-txfee.png?v0.0.2`,
        },
        {
          title: 'aelf Daily Tx fee Chart',
          path: '/chart/txfee',
          imgUrl: `/image/${network}/${chainPath}txfee.png?v0.0.2`,
        },
        {
          title: 'Average Block Size Chart',
          path: '/chart/blocksize',
          imgUrl: `/image/${network}/${chainPath}blocksize.png?v0.0.2`,
        },
        {
          title: 'aelf Daily Block Rewards Chart',
          path: '/chart/rewards',
          imgUrl: `/image/${network}/${chainPath}rewards.png?v0.0.2`,
        },
      ],
    },
    {
      id: 'section-network-data',
      title: 'Network Data',
      charts: [
        {
          title: 'aelf Block Production Rate Chart',
          path: '/chart/production-rate',
          imgUrl: `/image/${network}/${chainPath}production-rate.png?v0.0.2`,
        },
        {
          title: 'aelf Daily Cycle Count Chart',
          path: '/chart/cycle-count',
          imgUrl: `/image/${network}/${chainPath}cycle-count.png?v0.0.3`,
        },
        {
          title: 'aelf AVG Block Duration Chart',
          path: '/chart/avg-duration',
          imgUrl: `/image/${network}/${chainPath}avg-duration.png?v0.0.2`,
        },
        {
          title: 'aelf Block Producers',
          path: '/chart/produce',
          imgUrl: ProduceImg,
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
          imgUrl: `/image/${network}/${chainPath}deployed-contracts.png?v0.0.3`,
        },
        {
          title: 'Contract Calls Chart',
          path: '/chart/contract-calls',
          imgUrl: '/image/chart-table.png?v0.0.3',
        },
      ],
    },
  ];
};

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
      <Button
        onClick={() => {
          AdTracker.trackEvent('test-tracker', {
            page: 'chart',
          });
        }}>
        tracker test
      </Button>
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
