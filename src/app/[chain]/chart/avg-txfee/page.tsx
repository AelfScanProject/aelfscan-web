'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IAvgTxFeeData, IHIGHLIGHTDataItem } from '../type';
const title = 'Average Transaction Fee';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyAvgTransactionFee } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const avgFeeUsdt = multi ? Number(item.mergeAvgFeeUsdt) : Number(item.avgFeeUsdt);
    const mainAvgFeeUsdt = multi ? Number(item.mainChainAvgFeeUsdt) : avgFeeUsdt;
    const sideAvgFeeUsdt = multi ? Number(item.sideChainAvgFeeUsdt) : avgFeeUsdt;

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
        x: -25,
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
        text: title,
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
        const { total, main, side, avgFeeElf } = customMap[date];
        if (multi) {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Average Txn Fee</b>: <b>$${thousandsNumber(total)}</b><br/>MainChain Average Tx Fee: <b>$${thousandsNumber(main)}</b><br/>SideChain Average Tx Fee: <b>$${thousandsNumber(side)}</b><br/>
        `;
        } else {
          return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Average Txn Fee</b>: <b>$${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>Average Txn Fee(ELF): <b>${thousandsNumber(avgFeeElf)} ELF</b><br/>
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
            name: 'Active Addresses',
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
  const { data, loading, chartRef, chain } = useFetchChartData<IAvgTxFeeData>({
    fetchFunc: fetchDailyAvgTransactionFee,
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
    const key = multi ? 'mergeAvgFeeUsdt' : 'avgFeeUsdt';
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
  }, [data, multi]);
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
