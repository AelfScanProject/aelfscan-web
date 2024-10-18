'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IDailyActiveAddressData, IHIGHLIGHTDataItem } from '../type';
const title = 'Daily Active aelf Addresses';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyActiveAddresses } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
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

  const options = getChartOptions({
    title: title,
    legend: multi,
    yAxisTitle: 'Active Addresses',
    buttonPositionX: -25,
    minRange: 24 * 3600 * 1000,
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
      ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Active Addresses</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>Sender Address: <b>${thousandsNumber(sendAddressCount)}</b><br/>Receive Address: <b>${thousandsNumber(receiveAddressCount)}</b><br/>
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
  const { data, loading, chartRef, chain, multi } = useFetchChartData<IDailyActiveAddressData>({
    fetchFunc: fetchDailyActiveAddresses,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || [], chain, multi);
  }, [chain, data?.list, multi]);

  const { download } = useChartDownloadData(data, chartRef, title);

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
