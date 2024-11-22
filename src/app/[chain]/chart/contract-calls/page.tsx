'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IContractCalls, IHIGHLIGHTDataItem } from '../type';
import { fetchDailyContractCall } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import TopContract from './topContract';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'Contract Calls Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const callCount = item.mergeCallCount;
    const mainCount = item.mainChainCallCount;
    const sideCount = item.sideChainCallCount;

    allData.push([date, callCount]);
    mainData.push([date, mainCount]);
    sideData.push([date, sideCount]);

    customMap[date] = {
      total: callCount,
      main: mainCount,
      side: sideCount,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: 'Number of Calls',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      return `
      ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Number of Calls</b>: <b>${thousandsNumber(total)}</b><br/>aelf MainChain Number of Calls: <b>${thousandsNumber(main)}</b><br/>aelf dAppChain Number of Calls: <b>${thousandsNumber(side)}</b><br/>
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
  const { data, loading, chartRef } = useFetchChartData<IContractCalls>({
    fetchFunc: fetchDailyContractCall,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  const { download } = useChartDownloadData(data, chartRef, title);

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = 'mergeCallCount';
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest calls of
                <span className="px-1 font-bold">{thousandsNumber(data.highest[key])}</span>
                were recorded on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highest.date)}</span>
              </span>
            ),
          },
        ]
      : [];
  }, [data]);
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    <div>
      {data && (
        <BaseHightCharts
          ref={chartRef}
          title={title}
          aboutTitle="The Contract Calls chart shows the number of daily contract calls on aelf."
          highlightData={highlightData}
          options={options}
          download={download}
        />
      )}
      <TopContract />
    </div>
  );
}
