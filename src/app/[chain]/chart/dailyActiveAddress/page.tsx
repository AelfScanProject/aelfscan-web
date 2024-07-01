'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useMemo, useState } from 'react';
import { IDailyActiveAddressData, IHIGHLIGHTDataItem } from '../type';
const title = 'Active aelf Addresses Chart';
import dayjs from 'dayjs';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchDailyActiveAddresses } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, item.addressCount]);
    customMap[item.date] = {};
    customMap[item.date].sendAddressCount = item.sendAddressCount;
    customMap[item.date].receiveAddressCount = item.sendAddressCount;
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
        text: 'Active Addresses',
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
        const sendAddressCount = customMap[date].sendAddressCount;
        const receiveAddressCount = customMap[date].receiveAddressCount;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Active Addresses</b>: <b>${thousandsNumber(value)}</b><br/>Sender Address: <b>${thousandsNumber(sendAddressCount)}</b><br/>Receive Address: <b>${thousandsNumber(receiveAddressCount)}</b><br/>
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
  const [data, setData] = useState<IDailyActiveAddressData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyActiveAddresses({ chainId: chain });
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
                <span className="px-1 font-bold">{thousandsNumber(data.highestActiveCount.addressCount)}</span>
                addresses on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highestActiveCount.date)}</span>
              </span>
            ),
          },
          {
            key: 'Lowest',
            text: (
              <span>
                Lowest number of
                <span className="px-1 font-bold">{thousandsNumber(data.lowestActiveCount.addressCount)}</span>
                addresses on {Highcharts.dateFormat('%A, %B %e, %Y', data.lowestActiveCount.date)}
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
      aboutTitle="The Active aelf Address chart shows the daily number of unique addresses that were active on the network as a sender or receiver"
      highlightData={highlightData}
      options={options}
      download={download}
    />
  );
}
