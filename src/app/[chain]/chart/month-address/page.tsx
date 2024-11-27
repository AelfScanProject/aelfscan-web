'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { IHIGHLIGHTDataItem, IMonthActiveAddressData } from '../type';
const title = 'Monthly Active aelf Addresses';
import { exportToCSV } from '@_utils/urlUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { fetchMonthActiveAddresses } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = dayjs.utc(item.dateMonth.toString(), 'YYYYMM').valueOf();
    const addressCount = item.mergeAddressCount;
    const mainChainCount = item.mainChainAddressCount;
    const sideChainCount = item.sideChainAddressCount;

    allData.push([date, addressCount]);
    mainData.push([date, mainChainCount]);
    sideData.push([date, sideChainCount]);

    customMap[date] = {
      total: addressCount,
      main: mainChainCount,
      side: sideChainCount,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: 'Active Addresses',
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
    buttonPositionX: -25,
    xAxis: {
      minRange: 30 * 24 * 3600 * 1000, // Minimum range is 1 month
      dateTimeLabelFormats: {
        month: '%b %y', // Format x-axis labels as "Jan 2024"
      },
    },
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      return `
      ${Highcharts.dateFormat('%B %Y', date)}<br/><b>Total Active Addresses</b>: <b>${thousandsNumber(total)}</b><br/>aelf MainChain Active Addresses: <b>${thousandsNumber(main)}</b><br/>aelf dAppChain Active Addresses: <b>${thousandsNumber(side)}</b><br/>
    `;
    },
    data: allData,
    series: [
      {
        name: 'All Chains',
        type: 'line',
        data: allData,
      },
      {
        name: 'aelf MainChain',
        type: 'line',
        data: mainData,
      },
      {
        name: 'aelf dAppChain',
        type: 'line',
        data: sideData,
      },
    ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef } = useFetchChartData<IMonthActiveAddressData>({
    fetchFunc: fetchMonthActiveAddresses,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  useEffect(() => {
    if (data) {
      const chart = chartRef.current?.chart;
      if (chart) {
        const minDate = dayjs.utc(data.list[0]?.dateMonth.toString(), 'YYYYMM').valueOf();
        const maxDate = dayjs.utc(data.list[data.list.length - 1]?.dateMonth.toString(), 'YYYYMM').valueOf();
        chart.xAxis[0].setExtremes(minDate, maxDate);
      }
    }
  }, [chartRef, data]);

  const download = () => {
    exportToCSV(data?.list || [], title, {
      mergeAddressCount: 'Total Active Addresses',
      mainChainAddressCount: 'aelf MainChain Active Addresses',
      sideChainAddressCount: 'aelf dAppChain Active Addresses',
    });
  };
  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = 'mergeAddressCount';
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
            hidden: true,
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
  }, [data]);
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
