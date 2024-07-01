'use client';
import Highcharts from 'highcharts/highstock';
import '../index.css';
import { thousandsNumber } from '@_utils/formatter';
import { useCallback, useMemo, useState } from 'react';
import { IDailyTransactionsData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import dayjs from 'dayjs';
import { fetchDailyTransactions } from '@_api/fetchChart';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';

const title = 'aelf Daily Transactions Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const blockDataMap = {};
  list.forEach((item) => {
    allData.push([item.date, item.transactionCount]);
    blockDataMap[item.date] = item.blockCount;
  });

  return {
    legend: {
      enabled: false,
    },
    colors: ['#5c28a9', '#266CD3'],
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
        const transactionCount = point.y;
        const blockCount = blockDataMap[date];
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Transactions</b>: <b>${thousandsNumber(transactionCount)}</b><br/>Total Block Count: <b>${thousandsNumber(blockCount)}</b><br/>
        `;
      },
    },
    series: [
      {
        name: 'Tokyo',
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
  const [data, setData] = useState<IDailyTransactionsData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyTransactions({ chainId: chain });
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
    const columns = ['Date(UTC)', 'UnixTimeStamp'].concat(
      Object.keys(data?.list[0] || {}).filter((item) => item !== 'date'),
    );
    const rows = data?.list.map((item) => {
      return [
        dayjs(item.date).format('M/D/YYYY'),
        ...Object.values(item).map((item, index) => (index === 0 ? `'${String(item)}` : item)),
      ];
    });
    exportToCSV(title, columns, rows);
  };

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest number of
                <span className="px-1 font-bold">{thousandsNumber(data.highestTransactionCount.transactionCount)}</span>
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
                <span className="px-1 font-bold">{thousandsNumber(data.lowesTransactionCount.transactionCount)}</span>
                transactions on {Highcharts.dateFormat('%A, %B %e, %Y', data.lowesTransactionCount.date)}
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
      aboutTitle="The chart highlights the total number of transactions on the aelf blockchain with daily individual breakdown
    for total block"
      highlightData={highlightData}
      options={options}
      download={download}
    />
  );
}
