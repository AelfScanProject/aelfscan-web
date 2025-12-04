'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import { useMemo } from 'react';
import { IBlockProductionRateData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
const title = 'aelf Block Production Rate Chart';
import { fetchBlockProduceRate } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';

const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  const mainData: any[] = [];
  const sideData: any[] = [];
  list.forEach((item) => {
    const { date, mergeBlockProductionRate, mainBlockProductionRate, sideBlockProductionRate } = item;
    allData.push([date, Number(mergeBlockProductionRate)]);
    mainData.push([date, Number(mainBlockProductionRate)]);
    sideData.push([date, Number(sideBlockProductionRate)]);

    customMap[date] = {
      total: mergeBlockProductionRate,
      main: mainBlockProductionRate,
      side: sideBlockProductionRate,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: 'Block Production Rate',
    buttonPositionX: -22,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Block Production Rate</b>: <b>${thousandsNumber(total)}%</b><br/>MainChain Block Production Rate: <b>${thousandsNumber(main)}%</b><br/>dAppChain Block Production Rate: <b>${thousandsNumber(side)}%</b><br/>
      `;
    },
    data: allData,
    series: [
      {
        name: 'All Chains',
        data: allData,
        type: 'line',
      },
      {
        name: 'aelf MainChain',
        type: 'line',
        data: mainData,
      },
      {
        name: 'aelf dAppChain',
        type: 'line',
        data: sideData,
      },
    ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef } = useFetchChartData<IBlockProductionRateData>({
    fetchFunc: fetchBlockProduceRate,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    mergeBlockProductionRate: 'Total Block Production Rate',
    mainBlockProductionRate: 'MainChain Block Production Rate',
    sideBlockProductionRate: 'dAppChain Block Production Rate',
  });

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest block production rate of
                <span className="px-1 font-semibold">
                  {thousandsNumber(data.highestBlockProductionRate.mergeBlockProductionRate)}%
                </span>
                was on
                <span className="pl-1">
                  {Highcharts.dateFormat('%A, %B %e, %Y', data.highestBlockProductionRate.date)}
                </span>
              </span>
            ),
          },
        ]
      : [];
  }, [data]);
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The aelf Block Production Rate Chart shows the daily block production rate of the aelf network."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
