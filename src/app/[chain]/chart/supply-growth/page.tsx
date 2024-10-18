'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, ISupplyGrowthData } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { message } from 'antd';
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

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

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
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>ELF Circulating Supply</b>: <b>${thousandsNumber(value)}</b><br/>+ Daily ELF rewards: <b>${thousandsNumber(reward)}</b><br/>+ Organization Unlock: <b>${thousandsNumber(organizationUnlock)}</b><br/>- MainChain burnt: <b>${thousandsNumber(burnt)}</b><br/>- SideChain burnt: <b>${thousandsNumber(sideChainBurnt)}</b><br/>- Unreceived: <b>${thousandsNumber(totalUnReceived)}</b><br/>
      `;
    },
    minDate,
    maxDate,
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

  const { download } = useChartDownloadData(data, chartRef, title);

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
