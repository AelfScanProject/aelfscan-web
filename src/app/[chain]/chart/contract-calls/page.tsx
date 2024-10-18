'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
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

  return {
    legend: {
      enabled: multi,
    },
    colors: ChartColors,
    chart: {
      type: 'line',
    },
    rangeSelector: {
      enabled: true,
      selected: 3,
      buttonPosition: {
        align: 'left',
        x: -35,
      },
      buttons: [
        {
          type: 'month',
          count: 1,
          text: '1m',
          title: 'View 1 months',
        },
        {
          type: 'month',
          count: 6,
          text: '6m',
          title: 'View 6 months',
        },
        {
          type: 'year',
          count: 1,
          text: '1y',
          title: 'View 1 year',
        },
        {
          type: 'all',
          text: 'All',
          title: 'View all',
        },
      ],
    },
    navigator: {
      enabled: false,
    },
    title: {
      text: title,
      align: 'left',
    },
    subtitle: {
      text: 'Click and drag in the plot area to zoom in',
      align: 'left',
    },
    xAxis: {
      type: 'datetime',
      min: minDate,
      max: maxDate,
      startOnTick: false,
      endOnTick: false,
    },
    yAxis: {
      title: {
        text: 'Number of Calls',
      },
      labels: {
        formatter: function () {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const num = Number(this.value);
          if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
          } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
          } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
          } else {
            return num.toString();
          }
        },
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      formatter: function () {
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
    },
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
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['viewFullscreen', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
        },
      },
    },
  };
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
