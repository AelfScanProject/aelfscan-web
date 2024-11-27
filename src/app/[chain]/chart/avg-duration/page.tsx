'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IAelfAVGBlockDurationData } from '../type';
import { fetchAvgBlockDuration } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'aelf AVG Block Duration Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    const main = Number(item.mainAvgBlockDuration);
    const side = Number(item.sideAvgBlockDuration);
    mainData.push([item.date, main]);
    sideData.push([item.date, side]);
    customMap[item.date] = {};
    customMap[item.date].main = main;
    customMap[item.date].side = side;
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: 'AVG Block Duration',
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const main = customMap[date].main;
      const side = customMap[date].side;
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>MainChain AVG Block Duration</b>: <b>${thousandsNumber(main)}s</b><br/>dAppChain AVG Block Duration: <b>${thousandsNumber(side)}s</b>
      `;
    },
    data: mainData,
    series: [
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
  const { data, loading, chartRef } = useFetchChartData<IAelfAVGBlockDurationData>({
    fetchFunc: fetchAvgBlockDuration,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    mainAvgBlockDuration: 'MainChain AVG Block Duration',
    sideAvgBlockDuration: 'dAppChain AVG Block Duration',
  });

  const highlightData = [];
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
