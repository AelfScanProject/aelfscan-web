'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import { useCallback, useMemo, useState } from 'react';
import { IDailyAddAddressData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { fetchUniqueAddresses } from '@_api/fetchChart';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';

const title = 'aelf Unique Addresses Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, item.totalUniqueAddressees]);
    customMap[item.date] = {};
    customMap[item.date].addressCount = item.addressCount;
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
      text: 'aelf Unique Addresses Chart',
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
        text: 'aelf Cumulative Address Growth',
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
        const total = point.y;
        const value = customMap[date].addressCount;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Unique Addresses</b>: <b>${thousandsNumber(total)}</b><br/>Daily Increase: <b>${thousandsNumber(value)}</b><br/>
        `;
      },
    },
    series: [
      {
        name: 'Daily Increase',
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
  const [data, setData] = useState<IDailyAddAddressData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUniqueAddresses({ chainId: chain });
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
            hiddenTitle: true,
            text: (
              <span>
                Highest increase of
                <span className="px-1 font-bold">{thousandsNumber(data.highestIncrease.addressCount)}</span>
                addresses was recorded on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highestIncrease.date)}</span>
              </span>
            ),
          },
          {
            key: 'Lowest',
            text: (
              <span>
                Lowest increase of
                <span className="px-1 font-bold">{thousandsNumber(data.lowestIncrease.addressCount)}</span>
                new addresses was recorded on{' '}
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.lowestIncrease.date)}</span>
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
      aboutTitle="The chart shows the total distinct numbers of address on the aelf blockchain and the increase in the number of address daily"
      highlightData={highlightData}
      options={options}
      download={download}
    />
  );
}
