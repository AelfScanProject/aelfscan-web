'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import { useEffect, useMemo } from 'react';
import { ChartColors, IBlockProductionRateData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
const title = 'aelf Block Production Rate Chart';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchBlockProduceRate } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';

const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.blockProductionRate)]);
    customMap[item.date] = {};
    customMap[item.date].blockCount = item.blockCount;
    customMap[item.date].missedBlockCount = item.missedBlockCount;
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'Block Production Rate',
    buttonPositionX: -22,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const value = point.y;
      const blockCount = customMap[date].blockCount;
      const missedBlockCount = customMap[date].missedBlockCount;
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Block Production Rate</b>: <b>${thousandsNumber(value)}%</b><br/>Block Count: <b>${thousandsNumber(blockCount)}</b><br/>Missed Block Count: <b>${thousandsNumber(missedBlockCount)}</b><br/>
      `;
    },
    minDate,
    maxDate,
    series: [
      {
        name: 'Active Addresses',
        data: allData,
        type: 'line',
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

  const { download } = useChartDownloadData(data, chartRef, title);

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest block production rate of
                <span className="px-1 font-bold">
                  {thousandsNumber(data.highestBlockProductionRate.blockProductionRate)}%
                </span>
                was on
                <span className="pl-1">
                  {Highcharts.dateFormat('%A, %B %e, %Y', data.highestBlockProductionRate.date)}
                </span>
              </span>
            ),
          },
          {
            key: 'Lowest',
            text: (
              <span>
                Highest number of missed blocks of
                <span className="px-1 font-bold">
                  {thousandsNumber(data.lowestBlockProductionRate.missedBlockCount)}
                </span>
                was on
                <span className="pl-1">
                  {Highcharts.dateFormat('%A, %B %e, %Y', data.lowestBlockProductionRate.date)}
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
        aboutTitle="The aelf Block Production Rate Chart shows the daily block production rate of the aelf network"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
