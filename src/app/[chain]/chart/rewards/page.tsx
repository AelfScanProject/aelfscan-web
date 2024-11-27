'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IDailyBlockRewardsData } from '../type';
const title = 'aelf Daily Block Rewards Chart';
import { fetchDailyBlockReward } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    const data = Number(item.blockReward);
    allData.push([item.date, data]);
    customMap[item.date] = {};
    customMap[item.date].total = data;
    customMap[item.date].totalBlockCount = item.totalBlockCount;
  });

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'Daily Block Rewards',
    buttonPositionX: -25,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, totalBlockCount } = customMap[date];
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Daily Block Rewards</b>: <b>${thousandsNumber(total)}</b><br/>Total Blocks: <b>${thousandsNumber(totalBlockCount)}</b><br/>
      `;
    },
    data: allData,
    series: [
      {
        name: 'Active Addresses',
        type: 'line',
        data: allData,
      },
    ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef } = useFetchChartData<IDailyBlockRewardsData>({
    fetchFunc: fetchDailyBlockReward,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    blockReward: 'Total Daily Block Rewards',
    totalBlockCount: 'Total Blocks',
  });

  const highlightData = [];
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The aelf Block Count and Rewards Chart shows the historical number of blocks produced daily on the aelf network and the total block reward."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
