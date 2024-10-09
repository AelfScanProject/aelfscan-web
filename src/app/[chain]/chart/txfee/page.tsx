'use client';
import Highcharts from 'highcharts/highstock';
import { getChainId, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IDailyTxFeeData, IHIGHLIGHTDataItem } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchDailyTxFee } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { useMultiChain } from '@_hooks/useSelectChain';
const title = 'aelf Daily Transaction Fee';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    if (multi) {
      allData.push([item.date, Number(item.mergeTotalFeeElf)]);
      mainData.push([item.date, Number(item.mainChainTotalFeeElf)]);
      sideData.push([item.date, Number(item.sideChainTotalFeeElf)]);
      customMap[item.date] = {};
      customMap[item.date].total = Number(item.mergeTotalFeeElf);
      customMap[item.date].main = Number(item.mainChainTotalFeeElf);
      customMap[item.date].side = Number(item.sideChainTotalFeeElf);
    } else {
      allData.push([item.date, Number(item.totalFeeElf)]);
      mainData.push([item.date, Number(item.totalFeeElf)]);
      sideData.push([item.date, Number(item.totalFeeElf)]);
      customMap[item.date] = {};
      customMap[item.date].total = Number(item.totalFeeElf);
      customMap[item.date].main = Number(item.totalFeeElf);
      customMap[item.date].side = Number(item.totalFeeElf);
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
        text: 'Transaction Fees per Day',
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
        if (multi) {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Transaction Fees</b>: <b>${thousandsNumber(total)} ELF</b><br/>MainChain Transaction Fees: <b>${thousandsNumber(main)} ELF</b><br/>SideChain Transaction Fees: <b>${thousandsNumber(side)} ELF</b><br/>
        `;
        } else {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Transaction Fees</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)} ELF</b><br/>
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
            name: 'Total Tx Fee',
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
  const [data, setData] = useState<IDailyTxFeeData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyTxFee({ chainId: getChainId(chain) });
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
    const key = multi ? 'mergeTotalFeeElf' : 'totalFeeElf';
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
  }, [data, multi]);
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
