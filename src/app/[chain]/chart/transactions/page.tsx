'use client';
import Highcharts from 'highcharts/highstock';
import '../index.css';
import { getChainId, thousandsNumber } from '@_utils/formatter';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IDailyTransactionsData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyTransactions } from '@_api/fetchChart';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { useMultiChain } from '@_hooks/useSelectChain';

const title = 'aelf Daily Transactions Chart';
const getOption = (list: any[], multi, chain): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const blockDataMap = {};
  list.forEach((item) => {
    if (multi) {
      allData.push([item.date, item.mergeTransactionCount]);
      mainData.push([item.date, item.mainChainTransactionCount]);
      sideData.push([item.date, item.sideChainTransactionCount]);
      blockDataMap[item.date] = {};
      blockDataMap[item.date].blockCount = item.blockCount;
      blockDataMap[item.date].total = item.mergeTransactionCount;
      blockDataMap[item.date].main = item.mainChainTransactionCount;
      blockDataMap[item.date].side = item.sideChainTransactionCount;
    } else {
      allData.push([item.date, item.transactionCount]);
      mainData.push([item.date, item.transactionCount]);
      sideData.push([item.date, item.transactionCount]);
      blockDataMap[item.date] = {};
      blockDataMap[item.date].blockCount = item.blockCount;
      blockDataMap[item.date].total = item.transactionCount;
      blockDataMap[item.date].main = item.transactionCount;
      blockDataMap[item.date].side = item.transactionCount;
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
  const { chain } = useParams<{ chain: string }>();
  const [data, setData] = useState<IDailyTransactionsData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyTransactions({ chainId: getChainId(chain) });
      setData(res);
    } catch (error) {
      message.error(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, [chain]);
  useEffectOnce(() => {
    fetData();
  });
  const multi = useMultiChain();
  const options = useMemo(() => {
    return getOption(data?.list || [], multi, chain);
  }, [chain, data?.list, multi]);

  const chartRef = useRef<HighchartsReactRefObject>(null);
  useEffect(() => {
    if (data) {
      const chart = chartRef.current?.chart;
      if (chart) {
        const minDate = data.list[0]?.date;
        const maxDate = data.list[data.list.length - 1]?.date;
        chart.xAxis[0].setExtremes(minDate, maxDate);
      }
    }
  }, [data]);

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
