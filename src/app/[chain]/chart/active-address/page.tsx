'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IDailyActiveAddressData, IHIGHLIGHTDataItem } from '../type';
const title = 'Daily Active aelf Addresses';
import { fetchDailyActiveAddresses } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const { date } = item;
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
    buttonPositionX: -25,
    minRange: 24 * 3600 * 1000,
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
  const { data, loading, chartRef, multi } = useFetchChartData<IDailyActiveAddressData>({
    fetchFunc: fetchDailyActiveAddresses,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    mergeAddressCount: 'Total Active Addresses',
    mainChainAddressCount: 'aelf MainChain Active Addresses',
    sideChainAddressCount: 'aelf dAppChain Active Addresses',
  });

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
