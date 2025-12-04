'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IAvgTxFeeData, IHIGHLIGHTDataItem } from '../type';
const title = 'Average Transaction Fee';
import { fetchDailyAvgTransactionFee } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const avgFeeUsdt = Number(item.mergeAvgFeeUsdt);
    const mainAvgFeeUsdt = Number(item.mainChainAvgFeeUsdt);
    const sideAvgFeeUsdt = Number(item.sideChainAvgFeeUsdt);

    allData.push([date, avgFeeUsdt]);
    mainData.push([date, mainAvgFeeUsdt]);
    sideData.push([date, sideAvgFeeUsdt]);

    customMap[date] = {
      total: avgFeeUsdt,
      main: mainAvgFeeUsdt,
      side: sideAvgFeeUsdt,
      avgFeeElf: item.avgFeeElf,
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
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Average Txn Fee</b>: <b>$${thousandsNumber(total)}</b><br/>aelf MainChain Average Tx Fee: <b>$${thousandsNumber(main)}</b><br/>aelf dAppChain Average Tx Fee: <b>$${thousandsNumber(side)}</b><br/>
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
  const { data, loading, chartRef } = useFetchChartData<IAvgTxFeeData>({
    fetchFunc: fetchDailyAvgTransactionFee,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    mergeAvgFeeUsdt: 'Average Txn Fee',
    mainChainAvgFeeUsdt: 'aelf MainChain Average Tx Fee',
    sideChainAvgFeeUsdt: 'aelf dAppChain Average Tx Fee',
  });

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = 'mergeAvgFeeUsdt';
    return data
      ? [
          {
            key: 'Lowest',
            text: (
              <span>
                Lowest average transaction fee of
                <span className="px-1 font-bold">${thousandsNumber(data.lowest[key])}</span>
                on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.lowest?.date)}</span>
              </span>
            ),
          },
          {
            key: 'Highest',
            text: (
              <span>
                Highest average transaction fee of
                <span className="px-1 font-bold">${thousandsNumber(data.highest[key])}</span>
                on {Highcharts.dateFormat('%A, %B %e, %Y', data.highest?.date)}
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
        title={title}
        ref={chartRef}
        aboutTitle="The chart shows the daily average amount in USD spent per transaction on the aelf network."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
