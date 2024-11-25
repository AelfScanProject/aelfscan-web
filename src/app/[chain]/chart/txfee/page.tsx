'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IDailyTxFeeData, IHIGHLIGHTDataItem } from '../type';
import { fetchDailyTxFee } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'aelf Daily Transaction Fee';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const totalFeeElf = Number(item.mergeTotalFeeElf);
    const mainTotalFeeElf = Number(item.mainChainTotalFeeElf);
    const sideTotalFeeElf = Number(item.sideChainTotalFeeElf);

    allData.push([date, totalFeeElf]);
    mainData.push([date, mainTotalFeeElf]);
    sideData.push([date, sideTotalFeeElf]);

    customMap[date] = {
      total: totalFeeElf,
      main: mainTotalFeeElf,
      side: sideTotalFeeElf,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: 'Transaction Fees per Day',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      return `
      ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Transaction Fees</b>: <b>${thousandsNumber(total)} ELF</b><br/>aelf MainChain Transaction Fees: <b>${thousandsNumber(main)} ELF</b><br/>aelf dAppChain Transaction Fees: <b>${thousandsNumber(side)} ELF</b><br/>
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
  const { data, loading, chartRef } = useFetchChartData<IDailyTxFeeData>({
    fetchFunc: fetchDailyTxFee,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  const { download } = useChartDownloadData(data, chartRef, title);

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = 'mergeTotalFeeElf';
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest Tx fee of
                <span className="px-1 font-bold">{thousandsNumber(data.highest[key])} ELF</span>
                was recorded on
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
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The aelf Daily Transaction Fee shows the historical total daily ELF Tx fee of the aelf network."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
