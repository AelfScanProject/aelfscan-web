'use client';
import Highcharts from 'highcharts/highstock';
import '../index.css';
import { thousandsNumber } from '@_utils/formatter';
import { useEffect, useMemo } from 'react';
import { ChartColors, IDailyTransactionsData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyTransactions } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useFetchChartData } from '@_hooks/useFetchChartData';

const title = 'aelf Daily Transactions Chart';
const getOption = (list: any[], multi, chain): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const blockDataMap = {};
  list.forEach((item) => {
    const transactionCount = multi ? item.mergeTransactionCount : item.transactionCount;
    const mainChainCount = multi ? item.mainChainTransactionCount : transactionCount;
    const sideChainCount = multi ? item.sideChainTransactionCount : transactionCount;

    allData.push([item.date, transactionCount]);
    mainData.push([item.date, mainChainCount]);
    sideData.push([item.date, sideChainCount]);

    blockDataMap[item.date] = {
      blockCount: item.blockCount,
      total: transactionCount,
      main: mainChainCount,
      side: sideChainCount,
    };
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
      text: 'aelf Daily Transactions Chart',
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
        text: 'Transactions per Day',
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
        const { main, side, blockCount, total } = blockDataMap[date];
        if (multi) {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Transactions</b>: <b>${thousandsNumber(total)}</b><br/>MainChain Transactions: <b>${thousandsNumber(main)}</b><br/>SideChain Transactions: <b>${thousandsNumber(side)}</b><br/>
        `;
        } else {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Transactions</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>Total Block Count: <b>${thousandsNumber(blockCount)}</b><br/>
        `;
        }
      },
    },
    series: multi
      ? [
          {
            name: 'Total',
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
            name: 'Total',
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
  const { data, loading, chartRef, chain } = useFetchChartData<IDailyTransactionsData>({
    fetchFunc: fetchDailyTransactions,
    processData: (res) => res,
  });
  const multi = useMultiChain();
  const options = useMemo(() => {
    return getOption(data?.list || [], multi, chain);
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
    const key = multi ? 'mergeTransactionCount' : 'transactionCount';
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest number of
                <span className="px-1 font-bold">{thousandsNumber(data.highestTransactionCount[key])}</span>
                transactions on
                <span className="pl-1">
                  {Highcharts.dateFormat('%A, %B %e, %Y', data.highestTransactionCount.date)}
                </span>
              </span>
            ),
          },
          {
            key: 'Lowest',
            text: (
              <span>
                Lowest number of
                <span className="px-1 font-bold">{thousandsNumber(data.lowesTransactionCount[key])}</span>
                transactions on {Highcharts.dateFormat('%A, %B %e, %Y', data.lowesTransactionCount.date)}
              </span>
            ),
          },
        ]
      : [];
  }, [data, multi]);
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The chart highlights the total number of transactions on the aelf blockchain with daily individual breakdown
    for total block"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
