'use client';
import Highcharts from 'highcharts/highstock';
import { getChainId, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IHIGHLIGHTDataItem, IMonthActiveAddressData } from '../type';
const title = 'Monthly Active aelf Addresses';
import { exportToCSV } from '@_utils/urlUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchMonthActiveAddresses } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { useMultiChain } from '@_hooks/useSelectChain';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    const date = dayjs.utc(item.dateMonth.toString(), 'YYYYMM').valueOf();
    if (multi) {
      allData.push([date, item.mergeAddressCount]);
      mainData.push([date, item.mainChainAddressCount]);
      sideData.push([date, item.sideChainAddressCount]);
      customMap[date] = {};
      customMap[date].total = item.mergeAddressCount;
      customMap[date].main = item.mainChainAddressCount;
      customMap[date].side = item.sideChainAddressCount;
    } else {
      allData.push([date, item.addressCount]);
      mainData.push([date, item.addressCount]);
      sideData.push([date, item.addressCount]);
      customMap[date] = {};
      customMap[date].total = item.addressCount;
      customMap[date].main = item.addressCount;
      customMap[date].side = item.addressCount;
      customMap[date].sendAddressCount = item.sendAddressCount;
      customMap[date].receiveAddressCount = item.receiveAddressCount;
    }
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  return {
    legend: {
      enabled: multi,
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
      minRange: 30 * 24 * 3600 * 1000, // Minimum range is 1 month
      dateTimeLabelFormats: {
        month: '%B %Y', // Format x-axis labels as "Jan 2024"
      },
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
        const { total, main, side, sendAddressCount, receiveAddressCount } = customMap[date];
        if (multi) {
          return `
          ${Highcharts.dateFormat('%B %Y', date)}<br/><b>Total Active Addresses</b>: <b>${thousandsNumber(total)}</b><br/>MainChain Active Addresses: <b>${thousandsNumber(main)}</b><br/>SideChain Active Addresses: <b>${thousandsNumber(side)}</b><br/>
        `;
        } else {
          return `
          ${Highcharts.dateFormat('%B %Y', date)}<br/><b>Active Addresses</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>Sender Address: <b>${thousandsNumber(sendAddressCount)}</b><br/>Receive Address: <b>${thousandsNumber(receiveAddressCount)}</b><br/>
        `;
        }
      },
    },
    series: multi
      ? [
          {
            name: 'All Chains',
            type: 'line',
            data: allData,
          },
          {
            name: 'MainChain',
            type: 'line',
            data: mainData,
          },
          {
            name: 'SideChain',
            type: 'line',
            data: sideData,
          },
        ]
      : [
          {
            name: 'Active Addresses',
            type: 'line',
            data: chain === 'AELF' ? mainData : sideData,
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
  const [data, setData] = useState<IMonthActiveAddressData>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMonthActiveAddresses({ chainId: getChainId(chain) });
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

  const multi = useMultiChain();

  const options = useMemo(() => {
    return getOption(data?.list || [], chain, multi);
  }, [chain, data?.list, multi]);

  const chartRef = useRef<HighchartsReactRefObject>(null);
  useEffect(() => {
    if (data) {
      const chart = chartRef.current?.chart;
      if (chart) {
        const minDate = dayjs.utc(data.list[0]?.dateMonth.toString(), 'YYYYMM').valueOf();
        const maxDate = dayjs.utc(data.list[data.list.length - 1]?.dateMonth.toString(), 'YYYYMM').valueOf();
        chart.xAxis[0].setExtremes(minDate, maxDate);
      }
    }
  }, [data]);

  const download = () => {
    exportToCSV(data?.list || [], title);
  };
  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = multi ? 'mergeAddressCount' : 'addressCount';
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest number of
                <span className="px-1 font-bold">{thousandsNumber(data.highestActiveCount[key])}</span>
                addresses in
                <span className="pl-1">
                  {Highcharts.dateFormat(
                    '%B %Y',
                    dayjs.utc(data.highestActiveCount.dateMonth.toString(), 'YYYYMM').valueOf(),
                  )}
                </span>
              </span>
            ),
          },
          {
            key: 'Lowest',
            hidden: multi,
            text: (
              <span>
                Lowest number of
                <span className="px-1 font-bold">{thousandsNumber(data.lowestActiveCount[key])}</span>
                addresses in{' '}
                {Highcharts.dateFormat(
                  '%B %Y',
                  dayjs.utc(data.lowestActiveCount.dateMonth.toString(), 'YYYYMM').valueOf(),
                )}
              </span>
            ),
          },
        ]
      : [];
  }, [data, multi]);
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The Active aelf Address chart shows the daily number of unique addresses that were active on the network as a sender or receiver."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
