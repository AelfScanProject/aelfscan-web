'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useMemo, useState } from 'react';
import { ChartColors, IAvgTxFeeData, IHIGHLIGHTDataItem } from '../type';
const title = 'Average Transaction Fee';
import dayjs from 'dayjs';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchDailyAvgTransactionFee } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.avgFeeUsdt)]);
    customMap[item.date] = {};
    customMap[item.date].avgFeeElf = item.avgFeeElf;
  });

  return {
    legend: {
      enabled: false,
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
    },
    yAxis: {
      title: {
        text: 'Average Txn Fee',
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
        const value = point.y;
        const avgFeeElf = customMap[date].avgFeeElf;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Average Txn Fee</b>: <b>$${thousandsNumber(value)}</b><br/>Average Txn Fee(ELF): <b>${thousandsNumber(avgFeeElf)} ELF</b><br/>
        `;
      },
    },
    series: [
      {
        name: 'Active Addresses',
        type: 'line',
        data: allData,
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
      const res = await fetchDailyAvgTransactionFee({ chainId: chain });
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
  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);
  const download = () => {
    exportToCSV(data?.list || [], title);
  };
  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    return data
      ? [
          {
            key: 'Lowest',
            text: (
              <span>
                Lowest average transaction fee of
                <span className="px-1 font-bold">${thousandsNumber(data.lowest?.avgFeeUsdt)}</span>
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
                <span className="px-1 font-bold">${thousandsNumber(data.highest?.avgFeeUsdt)}</span>
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
    <BaseHightCharts
      title={title}
      aboutTitle="The chart shows the daily average amount in USD spent per transaction on the aelf network."
      highlightData={highlightData}
      options={options}
      download={download}
    />
  );
}
