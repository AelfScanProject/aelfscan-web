'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IStakedData } from '../type';
import { fetchDailyStaked } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'ELF Staked Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.totalStaked)]);
    customMap[item.date] = {};
    customMap[item.date].bpStaked = item.bpStaked;
    customMap[item.date].voteStaked = item.voteStaked;
    customMap[item.date].stakingRate = item.rate;
  });

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'ELF Staked Amount',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const value = point.y;
      const bpStaked = customMap[date].bpStaked;
      const voteStaked = customMap[date].voteStaked;
      const stakingRate = customMap[date].stakingRate;
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total ELF Staked</b>: <b>${thousandsNumber(value)}</b><br/>BP Staked: <b>${thousandsNumber(bpStaked)}</b><br/>Vote Staked: <b>${thousandsNumber(voteStaked)}</b><br/>Staking Rate: <b>${stakingRate}%</b><br/>
      `;
    },
    data: allData,
    series: [
      {
        name: 'Total Supply',
        type: 'line',
        data: allData,
      },
    ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef } = useFetchChartData<IStakedData>({
    fetchFunc: fetchDailyStaked,
    processData: (res) => res,
  });
  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    totalStaked: 'Total ELF Staked',
    bpStaked: 'BP Staked',
    voteStaked: 'Vote Staked',
    rate: 'Staking Rate',
  });

  const highlightData = [];
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The ELF Staked chart shows the historical staked amount of ELF. A higher staked amount can make the PoS-based blockchain network more secure."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
