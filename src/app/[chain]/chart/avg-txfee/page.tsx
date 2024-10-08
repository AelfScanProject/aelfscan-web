'use client';
import Highcharts from 'highcharts/highstock';
import { getChainId, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IAvgTxFeeData, IHIGHLIGHTDataItem } from '../type';
const title = 'Average Transaction Fee';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchDailyAvgTransactionFee } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { useMultiChain } from '@_hooks/useSelectChain';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    if (multi) {
      allData.push([item.date, Number(item.mergeAvgFeeUsdt)]);
      mainData.push([item.date, Number(item.mainChainAvgFeeUsdt)]);
      sideData.push([item.date, Number(item.sideChainAvgFeeUsdt)]);
      customMap[item.date] = {};
      customMap[item.date].total = Number(item.mergeAvgFeeUsdt);
      customMap[item.date].main = Number(item.mainChainAvgFeeUsdt);
      customMap[item.date].side = Number(item.sideChainAvgFeeUsdt);
      customMap[item.date].avgFeeElf = item.avgFeeElf;
    } else {
      allData.push([item.date, Number(item.avgFeeUsdt)]);
      mainData.push([item.date, Number(item.avgFeeUsdt)]);
      sideData.push([item.date, Number(item.avgFeeUsdt)]);
      customMap[item.date] = {};
      customMap[item.date].total = Number(item.avgFeeUsdt);
      customMap[item.date].main = Number(item.avgFeeUsdt);
      customMap[item.date].side = Number(item.avgFeeUsdt);
      customMap[item.date].avgFeeElf = item.avgFeeElf;
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
  const { chain } = useParams<{ chain: string }>();
  const [data, setData] = useState<IAvgTxFeeData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyAvgTransactionFee({ chainId: getChainId(chain) });
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
    return getOption(data?.list || [], chain, multi);
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
