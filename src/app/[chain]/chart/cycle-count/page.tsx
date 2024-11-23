'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IAelfDailyCycleCountData } from '../type';
import { fetchCycleCount } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';

const title = 'aelf Daily Cycle Count Chart';

const formatTooltip = (customMap) =>
  function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const point = this.points[0];
    const date = point.x;
    const { total, main, side } = customMap[date];
    return `
    ${Highcharts.dateFormat('%A, %B %e, %Y', date)}
    <br/><b>Total Cycle Count</b>: <b>${thousandsNumber(total)}</b>
    <br/>MainChain Cycle Count: <b>${thousandsNumber(main)}</b>
    <br/>dAppChain Cycle Count: <b>${thousandsNumber(side)}</b>
    <br/>
  `;
  };

const getChartOption = (list): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const total = item.mergeCycleCount;
    const main = item.mainCycleCount;
    const side = item.sideCycleCount;

    allData.push([date, total]);
    mainData.push([date, main]);
    sideData.push([date, side]);

    customMap[date] = {
      total: total,
      main: main,
      side: side,
      avgFeeElf: item.avgFeeElf,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: 'Daily Cycle Count',
    buttonPositionX: -30,
    tooltipFormatter: formatTooltip(customMap),
    data: allData,
    series: [
      {
        name: 'All Chains',
        type: 'line',
        data: allData,
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
  const { data, loading, chartRef } = useFetchChartData<IAelfDailyCycleCountData>({
    fetchFunc: fetchCycleCount,
    processData: (res) => res,
  });

  const options = useMemo(() => getChartOption(data?.list || []), [data]);

  const { download } = useChartDownloadData(data, chartRef, title);

  const highlightData = [];

  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The aelf daily cycle count chart shows the daily cycle count of the aelf network. Each BP produces 8 blocks per cycle."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
