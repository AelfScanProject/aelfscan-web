'use client';
import Highcharts from 'highcharts/highstock';
import '../index.css';
import { thousandsNumber } from '@_utils/formatter';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IDeployedContractsData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyDeployContract } from '@_api/fetchChart';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import dayjs from 'dayjs';
import { HighchartsReactRefObject } from 'highcharts-react-official';

const title = 'aelf Deployed Contracts Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const dailyIncreaseData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const dateInMillis = dayjs(item.date).valueOf();
    const totalCount = Number(item.totalCount);
    const dailyIncreaseContract = Number(item.count);

    allData.push([dateInMillis, totalCount]);
    dailyIncreaseData.push([dateInMillis, dailyIncreaseContract]);

    customMap[item.date] = {};
    customMap[item.date].dailyIncreaseContract = dailyIncreaseContract;
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  return {
    legend: {
      enabled: true,
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
          title: 'View 1 month',
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
    yAxis: [
      {
        title: {
          text: 'aelf Cumulative Contracts Chart',
        },
      },
      {
        title: {
          text: 'Daily Increase Contracts',
        },
        opposite: true,
      },
    ],
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
        const newContracts = customMap[date].dailyIncreaseContract;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Deployed Contracts</b>: <b>${thousandsNumber(value)}</b><br/>Daily Increase: <b>${thousandsNumber(newContracts)}</b><br/>
        `;
      },
    },
    series: [
      {
        name: 'Cumulative Contracts',
        type: 'line',
        data: allData,
        yAxis: 0,
      },
      {
        name: 'Daily Increase Contracts',
        type: 'line',
        data: dailyIncreaseData,
        yAxis: 1,
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
  const [data, setData] = useState<IDeployedContractsData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyDeployContract({ chainId: chain });
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
                Highest increase of
                <span className="px-1 font-bold">{thousandsNumber(data.highest?.count)}</span>
                new contracts was recorded on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highest?.date)}</span>
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
        aboutTitle="The aelf Deployed Contracts Chart shows  total number of contracts deployed on the aelf network."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
