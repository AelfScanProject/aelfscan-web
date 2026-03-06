'use client';

import { Anchor, Card } from 'antd';
import './index.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useMobileContext } from '@app/pageProvider';
import PageAd from '@_components/PageAd';
import { ChartData, chartItems } from './type';
import { MULTI_CHAIN } from '@_utils/contant';

const DEFAULT_CHART_IMAGE = '/image/chart.svg';

export default function Page() {
  const { chartImg } = useMobileContext();
  const chainType = MULTI_CHAIN;
  const chartImgGroup = chartImg?.[chainType] ?? chartImg?.multi;
  const loggedMissingChartImgRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    if (!chartImgGroup && !loggedMissingChartImgRef.current) {
      console.warn('[chart] chartImg config is missing, using fallback chart preview image.');
      loggedMissingChartImgRef.current = true;
    }
  }, [chartImgGroup]);

  return (
    <div className="chart-home-container mb-[-40px]">
      <div className="mb-5 pt-8 text-xl font-bold">aelf Charts & Statistics</div>
      <PageAd hiddenBorder adPage="chart" />
      <div className="charts-container mt-4 flex">
        <div className="col-xl-2 col-lg-3 d-lg-block box-border hidden border-r border-solid border-border pr-8">
          <div className="sticky top-[80px]">
            <Anchor targetOffset={200} items={chartItems} />
          </div>
        </div>

        <div className="w-full min-[993px]:pl-8">
          {ChartData.map((chartItem) => {
            return (
              <section id={chartItem.id} key={chartItem.id} className="section-container mb-10">
                <div className="title text-ls mb-[10px] font-medium">{chartItem.title}</div>
                <ul className="grid items-stretch gap-5 min-[576px]:grid-cols-2 min-[1200px]:grid-cols-3">
                  {chartItem.charts.map((chart) => {
                    const chartPreviewSrc = chartImgGroup?.[chart.key] || DEFAULT_CHART_IMAGE;
                    return (
                      <li key={chart.path}>
                        <Link href={`/${MULTI_CHAIN}${chart.path}`}>
                          <Card className="h-full !border-border !p-0 !shadow-card_box">
                            <div className="mb-4 text-sm">{chart.title}</div>
                            <img
                              width={316}
                              height={106}
                              className="mx-auto block h-auto max-w-full"
                              src={chartPreviewSrc}
                              alt={chart.title}></img>
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
