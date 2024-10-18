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
import { useMultiChain } from '@_hooks/useSelectChain';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = dayjs.utc(item.dateMonth.toString(), 'YYYYMM').valueOf();
    const addressCount = multi ? item.mergeAddressCount : item.addressCount;
    const mainChainCount = multi ? item.mainChainAddressCount : item.addressCount;
    const sideChainCount = multi ? item.sideChainAddressCount : item.addressCount;

    allData.push([date, addressCount]);
    mainData.push([date, mainChainCount]);
    sideData.push([date, sideChainCount]);

    customMap[date] = {
      total: addressCount,
      main: mainChainCount,
      side: sideChainCount,
    };

    if (!multi) {
      customMap[date].sendAddressCount = item.sendAddressCount;
      customMap[date].receiveAddressCount = item.receiveAddressCount;
    }
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  const options = getChartOptions({
    title: title,
    legend: multi,
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
    minDate,
    maxDate,
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
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef, chain, multi } = useFetchChartData<IMonthActiveAddressData>({
    fetchFunc: fetchMonthActiveAddresses,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || [], chain, multi);
  }, [chain, data?.list, multi]);

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
