'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IContractCalls, IHIGHLIGHTDataItem } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyContractCall } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import TopContract from './topContract';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'Contract Calls Chart';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const callCount = multi ? item.mergeCallCount : item.callCount;
    const mainCount = multi ? item.mainChainCallCount : callCount;
    const sideCount = multi ? item.sideChainCallCount : callCount;

    allData.push([date, callCount]);
    mainData.push([date, mainCount]);
    sideData.push([date, sideCount]);

    customMap[date] = {
      total: callCount,
      main: mainCount,
      side: sideCount,
    };

    if (!multi) {
      customMap[date].callAddressCount = item.callAddressCount;
    }
  });
  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  const options = getChartOptions({
    title: title,
    legend: multi,
    yAxisTitle: 'Number of Calls',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      const callAddressCount = customMap[date].callAddressCount;
      if (multi) {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Number of Calls</b>: <b>${thousandsNumber(total)}</b><br/>MainChain Number of Calls: <b>${thousandsNumber(main)}</b><br/>SideChain Number of Calls: <b>${thousandsNumber(side)}</b><br/>
      `;
      } else {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Number of Calls</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>Calling Accounts: <b>${thousandsNumber(callAddressCount)}</b><br/>
      `;
      }
    },
    minDate,
    maxDate,
    series: multi
      ? [
          {
            name: 'All Chains',
            type: 'line',
            data: allData,
          },
          {
            name: 'MainChain',
            type: 'line',
            data: mainData,
          },
          {
            name: 'SideChain',
            type: 'line',
            data: sideData,
          },
        ]
      : [
          {
            name: 'calls',
            type: 'line',
            data: chain === 'AELF' ? mainData : sideData,
          },
        ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef, chain } = useFetchChartData<IContractCalls>({
    fetchFunc: fetchDailyContractCall,
    processData: (res) => res,
  });
  const multi = useMultiChain();
  const options = useMemo(() => {
    return getOption(data?.list || [], chain, multi);
  }, [chain, data?.list, multi]);

  useEffect(() => {
    if (data) {
      const chart = chartRef.current?.chart;
      if (chart) {
        const minDate = data.list[0]?.date;
        const maxDate = data.list[data.list.length - 1]?.date;
        chart.xAxis[0].setExtremes(minDate, maxDate);
      }
    }
  }, [chartRef, data]);
  const download = () => {
    exportToCSV(data?.list || [], title);
  };
  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = multi ? 'mergeCallCount' : 'callCount';
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
  }, [data, multi]);
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
