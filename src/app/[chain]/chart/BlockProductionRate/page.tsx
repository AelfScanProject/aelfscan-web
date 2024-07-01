'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import { useCallback, useMemo, useState } from 'react';
import { IBlockProductionRateData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
const title = 'aelf Block Production Rate Chart';
import dayjs from 'dayjs';
import { exportToCSV } from '@_utils/urlUtils';
import { useEffectOnce } from 'react-use';
import { fetchBlockProduceRate } from '@_api/fetchChart';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';

const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.blockProductionRate)]);
    customMap[item.date] = {};
    customMap[item.date].blockCount = item.blockCount;
    customMap[item.date].missedBlockCount = item.missedBlockCount;
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
        x: -22,
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
        text: 'Block Production Rate',
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
        const blockCount = customMap[date].blockCount;
        const missedBlockCount = customMap[date].missedBlockCount;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Block Production Rate</b>: <b>${thousandsNumber(value)}%</b><br/>Block Count: <b>${thousandsNumber(blockCount)}</b><br/>Missed Block Count: <b>${thousandsNumber(missedBlockCount)}</b><br/>
        `;
      },
    },
    series: [
      {
        name: 'Active Addresses',
        data: allData,
        type: 'line',
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
  const [data, setData] = useState<IBlockProductionRateData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchBlockProduceRate({ chainId: chain });
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
                Highest block production rate of
                <span className="px-1 font-bold">
                  {thousandsNumber(data.highestBlockProductionRate.blockProductionRate)}%
                </span>
                was on
                <span className="pl-1">
                  {Highcharts.dateFormat('%A, %B %e, %Y', data.highestBlockProductionRate.date)}
                </span>
              </span>
            ),
          },
          {
            key: 'Lowest',
            text: (
              <span>
                Highest number of missed blocks of
                <span className="px-1 font-bold">
                  {thousandsNumber(data.lowestBlockProductionRate.missedBlockCount)}
                </span>
                was on
                <span className="pl-1">
                  {Highcharts.dateFormat('%A, %B %e, %Y', data.lowestBlockProductionRate.date)}
                </span>
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
      aboutTitle="The aelf Block Production Rate Chart shows the daily block production rate of the aelf network"
      highlightData={highlightData}
      options={options}
      download={download}
    />
  );
}
