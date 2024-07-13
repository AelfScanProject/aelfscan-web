'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IBlockProductionRateData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
const title = 'aelf Block Production Rate Chart';
import dayjs from 'dayjs';
import { exportToCSV } from '@_utils/urlUtils';
import { useEffectOnce } from 'react-use';
import { fetchBlockProduceRate } from '@_api/fetchChart';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';

const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.blockProductionRate)]);
    customMap[item.date] = {};
    customMap[item.date].blockCount = item.blockCount;
    customMap[item.date].missedBlockCount = item.missedBlockCount;
  });

  const minDate = allData[0] && allData[0][0];
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
      min: minDate,
      max: maxDate,
      startOnTick: false,
      endOnTick: false,
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
      ref={chartRef}
      title={title}
      aboutTitle="The aelf Block Production Rate Chart shows the daily block production rate of the aelf network"
      highlightData={highlightData}
      options={options}
      download={download}
    />
  );
}
