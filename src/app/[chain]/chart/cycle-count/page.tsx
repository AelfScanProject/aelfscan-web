'use client';
import Highcharts, { AlignValue } from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IAelfDailyCycleCountData, IHIGHLIGHTDataItem } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
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
    const value = point.y;
    const { missedCycle, missedBlockCount } = customMap[date];
    return `
    ${Highcharts.dateFormat('%A, %B %e, %Y', date)}
    <br/><b>Cycle Count</b>: <b>${thousandsNumber(value)}</b>
    <br/>Missed Block Count: <b>${thousandsNumber(missedBlockCount)}</b>
    <br/>Missed Cycle: <b>${thousandsNumber(missedCycle)}</b>
    <br/>
  `;
  };

const getChartOption = (list): Highcharts.Options => {
  const allData = list.map((item) => [item.date, item.cycleCount]);
  const customMap = list.reduce((acc, item) => {
    acc[item.date] = { missedBlockCount: item.missedBlockCount, missedCycle: item.missedCycle };
    return acc;
  }, {});

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'Daily Cycle Count',
    buttonPositionX: -30,
    tooltipFormatter: formatTooltip(customMap),
    data: allData,
    series: [{ name: 'Active Addresses', type: 'line', data: allData }],
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

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(
    () =>
      data
        ? [
            {
              key: 'Highest',
              text: (
                <span>
                  Highest missed cycle of
                  <span className="px-1 font-bold">{thousandsNumber(data.highestMissedCycle.missedCycle)}</span>
                  was on
                  <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highestMissedCycle.date)}</span>
                </span>
              ),
            },
          ]
        : [],
    [data],
  );

  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The aelf daily cycle count chart shows the daily cycle count and missed cycle of the aelf network. The aelf network has one cycle every 8 seconds"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
