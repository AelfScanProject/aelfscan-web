'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { ISupplyGrowthData } from '../type';
import { fetchDailySupplyGrowth } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'ELF Circulating Supply Growth Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.totalSupply)]);
    customMap[item.date] = {};
    customMap[item.date].reward = item.reward;
    customMap[item.date].burnt = item.mainChainBurnt;
    customMap[item.date].sideChainBurnt = item.sideChainBurnt;
    customMap[item.date].organizationUnlock = item.organizationUnlock;
    customMap[item.date].totalUnReceived = item.totalUnReceived;
  });

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'ELF Total Supply',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const value = point.y;
      const reward = customMap[date].reward;
      const burnt = customMap[date].burnt;
      const sideChainBurnt = customMap[date].sideChainBurnt;
      const organizationUnlock = customMap[date].organizationUnlock;
      const totalUnReceived = customMap[date].totalUnReceived;
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>ELF Circulating Supply</b>: <b>${thousandsNumber(value)}</b><br/>+ Daily ELF rewards: <b>${thousandsNumber(reward)}</b><br/>+ Organization Unlock: <b>${thousandsNumber(organizationUnlock)}</b><br/>- aelf MainChain burnt: <b>${thousandsNumber(burnt)}</b><br/>- aelf dAppChain burnt: <b>${thousandsNumber(sideChainBurnt)}</b><br/>- Unreceived: <b>${thousandsNumber(totalUnReceived)}</b><br/>
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
  const { data, loading, chartRef } = useFetchChartData<ISupplyGrowthData>({
    fetchFunc: fetchDailySupplyGrowth,
    processData: (res) => res,
  });

  const { download } = useChartDownloadData(data, chartRef, title, {
    totalSupply: 'ELF Circulating Supply',
    reward: 'Daily ELF rewards',
    burnt: 'aelf MainChain burnt',
    sideChainBurnt: 'aelf dAppChain burnt',
    organizationUnlock: 'Organization Unlock',
    totalUnReceived: 'Unreceived',
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

  const highlightData = [];

  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The ELF Circulating Supply Growth Chart shows a breakdown of daily block reward and burnt fees to arrive at the total daily ELF supply."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
