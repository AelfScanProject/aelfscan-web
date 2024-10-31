'use client';
import Highcharts from 'highcharts/highstock';
import '../index.css';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import { useMemo } from 'react';
import { IDailyTransactionsData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { fetchDailyTransactions } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';

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

  const options = getChartOptions({
    title: title,
    legend: multi,
    yAxisTitle: 'Transactions per Day',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { main, side, blockCount, total } = blockDataMap[date];
      if (multi) {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Transactions</b>: <b>${thousandsNumber(total)}</b><br/>aelf MainChain Transactions: <b>${thousandsNumber(main)}</b><br/>aelf dAppChain Transactions: <b>${thousandsNumber(side)}</b><br/>
      `;
      } else {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Transactions</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>Total Block Count: <b>${thousandsNumber(blockCount)}</b><br/>
      `;
      }
    },
    data: allData,
    series: multi
      ? [
          {
            name: 'Total',
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
            name: 'Total',
            type: 'line',
            data: chain === 'AELF' ? mainData : sideData,
          },
        ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef, chain, multi } = useFetchChartData<IDailyTransactionsData>({
    fetchFunc: fetchDailyTransactions,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || [], multi, chain);
  }, [chain, data?.list, multi]);

  const { download } = useChartDownloadData(data, chartRef, title);

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
