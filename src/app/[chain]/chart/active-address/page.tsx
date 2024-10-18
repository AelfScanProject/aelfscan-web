'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IDailyActiveAddressData, IHIGHLIGHTDataItem } from '../type';
const title = 'Daily Active aelf Addresses';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyActiveAddresses } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const { date, sendAddressCount, receiveAddressCount } = item;
    const addressCount = multi ? item.mergeAddressCount : item.addressCount;
    const mainChainCount = multi ? item.mainChainAddressCount : addressCount;
    const sideChainCount = multi ? item.sideChainAddressCount : addressCount;

    allData.push([date, addressCount]);
    mainData.push([date, mainChainCount]);
    sideData.push([date, sideChainCount]);

    customMap[date] = {
      total: addressCount,
      main: mainChainCount,
      side: sideChainCount,
    };

    if (!multi) {
      customMap[date].sendAddressCount = sendAddressCount;
      customMap[date].receiveAddressCount = receiveAddressCount;
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
        const { total, main, side, sendAddressCount, receiveAddressCount } = customMap[date];
        if (multi) {
          return `
          ${Highcharts.dateFormat('%B %Y', date)}<br/><b>Total Active Addresses</b>: <b>${thousandsNumber(total)}</b><br/>MainChain Active Addresses: <b>${thousandsNumber(main)}</b><br/>SideChain Active Addresses: <b>${thousandsNumber(side)}</b><br/>
        `;
        } else {
          return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Active Addresses</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>Sender Address: <b>${thousandsNumber(sendAddressCount)}</b><br/>Receive Address: <b>${thousandsNumber(receiveAddressCount)}</b><br/>
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
  const { data, loading, chartRef, chain } = useFetchChartData<IDailyActiveAddressData>({
    fetchFunc: fetchDailyActiveAddresses,
    processData: (res) => res,
  });

  const multi = useMultiChain();

  const options = useMemo(() => {
    return getOption(data?.list || [], chain, multi);
  }, [chain, data?.list, multi]);

  useEffect(() => {
    if (data) {
      const chart = chartRef.current?.chart;
      if (chart) {
        const minDate = data.list[0]?.date;
        const maxDate = data.list[data.list.length - 1]?.date;
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
                addresses on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highestActiveCount.date)}</span>
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
                addresses on {Highcharts.dateFormat('%A, %B %e, %Y', data.lowestActiveCount.date)}
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
        aboutTitle="The Active aelf Address chart shows the daily number of unique addresses that were active on the network as a sender or receiver"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
