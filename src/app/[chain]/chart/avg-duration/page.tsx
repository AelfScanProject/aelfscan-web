'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { IAelfAVGBlockDurationData, IHIGHLIGHTDataItem } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchAvgBlockDuration } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'aelf AVG Block Duration Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.avgBlockDuration)]);
    customMap[item.date] = {};
    customMap[item.date].longestBlockDuration = item.longestBlockDuration;
    customMap[item.date].shortestBlockDuration = item.shortestBlockDuration;
  });
  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'AVG Block Duration',
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const value = point.y;
      const longestBlockDuration = customMap[date].longestBlockDuration;
      const shortestBlockDuration = customMap[date].shortestBlockDuration;
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>AVG Block Duration</b>: <b>${thousandsNumber(value)}s</b><br/>Longest block duration: <b>${thousandsNumber(longestBlockDuration)}s</b><br/>Shortest block duration: <b>${thousandsNumber(shortestBlockDuration)}s</b><br/>
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
  const { data, loading, chartRef } = useFetchChartData<IAelfAVGBlockDurationData>({
    fetchFunc: fetchAvgBlockDuration,
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
                Highest AVG block duration of
                <span className="px-1 font-bold">
                  {thousandsNumber(data.highestAvgBlockDuration.avgBlockDuration)}s
                </span>
                was on
                <span className="pl-1">
                  {Highcharts.dateFormat('%A, %B %e, %Y', data.highestAvgBlockDuration.date)}
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
        aboutTitle="The AVG block duration Chart shows the daily block duration of the aelf network. Shows the stability of the network"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
