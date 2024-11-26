'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IAvgBlockSizeData } from '../type';
const title = 'Average Block Size Chart';
import { fetchDailyAvgBlockSize } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const avgBlockSize = Number(item.mergeAvgBlockSize);
    const mainAvgBlockSize = Number(item.mainChainAvgBlockSize);
    const sideAvgBlockSize = Number(item.sideChainAvgBlockSize);

    allData.push([date, avgBlockSize]);
    mainData.push([date, mainAvgBlockSize]);
    sideData.push([date, sideAvgBlockSize]);

    customMap[date] = {
      total: avgBlockSize,
      main: mainAvgBlockSize,
      side: sideAvgBlockSize,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: title,
    buttonPositionX: -25,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      return `
      ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Average Block Size(Bytes)</b>: <b>${thousandsNumber(total)}</b><br/>aelf MainChain Block Size(Bytes): <b>${thousandsNumber(main)}</b><br/>aelf dAppChain Block Size(Bytes): <b>${thousandsNumber(side)}</b><br/>
    `;
    },
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
  const { data, loading, chartRef } = useFetchChartData<IAvgBlockSizeData>({
    fetchFunc: fetchDailyAvgBlockSize,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  const { download } = useChartDownloadData(data, chartRef, title);

  const highlightData = [];
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        title={title}
        ref={chartRef}
        aboutTitle="The aelf Average Block Size Chart indicates the historical average block size in bytes of the aelf network."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
