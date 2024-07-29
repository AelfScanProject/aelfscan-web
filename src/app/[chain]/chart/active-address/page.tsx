'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IDailyActiveAddressData, IHIGHLIGHTDataItem } from '../type';
const title = 'Active aelf Addresses Chart';
import dayjs from 'dayjs';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchDailyActiveAddresses } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, item.addressCount]);
    customMap[item.date] = {};
    customMap[item.date].sendAddressCount = item.sendAddressCount;
    customMap[item.date].receiveAddressCount = item.sendAddressCount;
  });
  const minDate = allData[0] && allData[0][0];
  console.log(allData[0], 'allData[0][0]');
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

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
      min: minDate,
      max: maxDate,
      startOnTick: false,
      endOnTick: false,
      minRange: 24 * 3600 * 1000,
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
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The Active aelf Address chart shows the daily number of unique addresses that were active on the network as a sender or receiver"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
