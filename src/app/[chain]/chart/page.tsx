'use client';

import { Anchor, Card } from 'antd';
import './index.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useMobileContext } from '@app/pageProvider';
import PageAd from '@_components/PageAd';
import { useMultiChain } from '@_hooks/useSelectChain';
import { ChartData, chartItems } from './type';

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
      return chartItems.filter((item) => item.key !== '3');
    } else {
      return chartItems;
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
