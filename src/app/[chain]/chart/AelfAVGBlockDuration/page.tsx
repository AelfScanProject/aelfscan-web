'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useMemo, useState } from 'react';
import { IAelfAVGBlockDurationData, IHIGHLIGHTDataItem } from '../type';
import dayjs from 'dayjs';
import { exportToCSV } from '@_utils/urlUtils';
import { useEffectOnce } from 'react-use';
import { fetchAvgBlockDuration } from '@_api/fetchChart';
import { message } from 'antd';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useParams } from 'next/navigation';
const title = 'aelf AVG Block Duration Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.avgBlockDuration)]);
    customMap[item.date] = {};
    customMap[item.date].longestBlockDuration = item.longestBlockDuration;
    customMap[item.date].shortestBlockDuration = item.shortestBlockDuration;
  });
  console.log(customMap, 'customMap');

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
        x: -30,
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
        text: 'AVG Block Duration',
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
        const longestBlockDuration = customMap[date].longestBlockDuration;
        const shortestBlockDuration = customMap[date].shortestBlockDuration;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>AVG Block Duration</b>: <b>${thousandsNumber(value)}s</b><br/>Longest block duration: <b>${thousandsNumber(longestBlockDuration)}s</b><br/>Shortest block duration: <b>${thousandsNumber(shortestBlockDuration)}s</b><br/>
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

  const [data, setData] = useState<IAelfAVGBlockDurationData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAvgBlockDuration({ chainId: chain });
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
                Highest AVG block duration of
                <span className="px-1 font-bold">
                  {thousandsNumber(data.highestAvgBlockDuration.avgBlockDuration)}s
                </span>
                was on
                <span className="pl-1">
                  {Highcharts.dateFormat('%A, %B %e, %Y', data.highestAvgBlockDuration.date)}
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
      aboutTitle="The AVG block duration Chart shows the daily block duration of the aelf network. Shows the stability of the network"
      highlightData={highlightData}
      options={options}
      download={download}
    />
  );
}
