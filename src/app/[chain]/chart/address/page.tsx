'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import { useMemo } from 'react';
import { IDailyAddAddressData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { fetchUniqueAddresses } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';

const title = 'aelf Cumulative Addresses Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const totalUniqueAddresses = item.mergeTotalUniqueAddressees;
    const mainUniqueAddresses = item.mainChainTotalUniqueAddressees;
    const sideUniqueAddresses = item.sideChainTotalUniqueAddressees;

    allData.push([item.date, totalUniqueAddresses]);
    mainData.push([item.date, mainUniqueAddresses]);
    sideData.push([item.date, sideUniqueAddresses]);

    customMap[item.date] = {
      totalCount: totalUniqueAddresses,
      mainData: mainUniqueAddresses,
      sideData: sideUniqueAddresses,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { totalCount, mainData, sideData } = customMap[date];
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Wallet Addresses</b>: <b>${thousandsNumber(totalCount)}</b><br/>aelf MainChain Wallet Addresses: <b>${thousandsNumber(mainData)}</b><br/>aelf dAppChain Wallet Addresses: <b>${thousandsNumber(sideData)}</b><br/>
      `;
    },
    yAxisTitle: 'aelf Cumulative Address Growth',
    buttonPositionX: -25,
    data: allData,
    series: [
      {
        name: 'All Chains',
        type: 'line',
        data: allData,
      },
      {
        name: 'aelf MainChain Wallet',
        type: 'line',
        data: mainData,
      },
      {
        name: 'aelf dAppChain Wallet',
        type: 'line',
        data: sideData,
      },
    ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef } = useFetchChartData<IDailyAddAddressData>({
    fetchFunc: fetchUniqueAddresses,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

  const Highest = useMemo(() => {
    return data?.highestIncrease;
  }, [data]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    mergeTotalUniqueAddressees: 'Total Wallet Addresses',
    mainChainTotalUniqueAddressees: 'aelf MainChain Wallet Addresses',
    sideChainTotalUniqueAddressees: 'aelf dAppChain Wallet Addresses',
  });

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = 'mergeAddressCount';
    return data
      ? [
          {
            key: 'Highest',
            hiddenTitle: true,
            text: (
              <span>
                Highest increase of
                <span className="px-1 font-bold">{thousandsNumber((Highest && Highest[key]) || 0)}</span>
                addresses was recorded on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', Highest?.date || 0)}</span>
              </span>
            ),
          },
        ]
      : [];
  }, [Highest, data]);
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The chart shows the total distinct numbers of address on the aelf blockchain and the increase in the number of address daily"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
