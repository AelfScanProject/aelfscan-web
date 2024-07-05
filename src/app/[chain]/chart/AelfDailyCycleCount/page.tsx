'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useMemo, useState } from 'react';
import { ChartColors, IAelfDailyCycleCountData, IHIGHLIGHTDataItem } from '../type';
const title = 'aelf Daily Cycle Count Chart';
import dayjs from 'dayjs';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { useEffectOnce } from 'react-use';
import { fetchCycleCount } from '@_api/fetchChart';
import { message } from 'antd';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';

const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, item.cycleCount]);
    customMap[item.date] = {};
    customMap[item.date].missedBlockCount = item.missedBlockCount;
    customMap[item.date].missedCycle = item.missedCycle;
  });
  console.log(customMap, 'customMap');

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
      buttonPosition: {
        align: 'left',
        x: -30,
      },
      selected: 3,
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
        text: 'Daily Cycle Count',
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
        const missedCycle = customMap[date].missedCycle;
        const missedBlockCount = customMap[date].missedBlockCount;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Cycle Count</b>: <b>${thousandsNumber(value)}</b><br/>Missed Block Count: <b>${thousandsNumber(missedBlockCount)}</b><br/>MIssed Cycle: <b>${thousandsNumber(missedCycle)}</b><br/>
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
  const [data, setData] = useState<IAelfDailyCycleCountData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCycleCount({ chainId: chain });
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
            key: 'Highest',
            text: (
              <span>
                Highest missed cycle of
                <span className="px-1 font-bold">{thousandsNumber(data.highestMissedCycle.missedCycle)}</span>
                was on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highestMissedCycle.date)}</span>
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
      aboutTitle="The aelf daily cycle count chart shows the daily cycle count and missed cycle of the aelf network. The aelf network has one cycle every 8 seconds"
      highlightData={highlightData}
      options={options}
      download={download}
    />
  );
}
