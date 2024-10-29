'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IAvgBlockSizeData } from '../type';
const title = 'Average Block Size Chart';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyAvgBlockSize } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const avgBlockSize = multi ? Number(item.mergeAvgBlockSize) : Number(item.avgBlockSize);
    const mainAvgBlockSize = multi ? Number(item.mainChainAvgBlockSize) : avgBlockSize;
    const sideAvgBlockSize = multi ? Number(item.sideChainAvgBlockSize) : avgBlockSize;

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
    legend: multi,
    yAxisTitle: title,
    buttonPositionX: -25,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      if (multi) {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Average Block Size(Bytes)</b>: <b>${thousandsNumber(total)}</b><br/>aelf MainChain Block Size(Bytes): <b>${thousandsNumber(main)}</b><br/>aelf dAppChain Block Size(Bytes): <b>${thousandsNumber(side)}</b><br/>
      `;
      } else {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Average Block Size(Bytes)</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>
      `;
      }
    },
    data: allData,
    series: multi
      ? [
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
        ]
      : [
          {
            name: title,
            type: 'line',
            data: allData,
          },
        ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef, chain, multi } = useFetchChartData<IAvgBlockSizeData>({
    fetchFunc: fetchDailyAvgBlockSize,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || [], chain, multi);
  }, [chain, data?.list, multi]);

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
