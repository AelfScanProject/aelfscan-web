'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import { useEffect, useMemo } from 'react';
import { IDailyAddAddressData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchUniqueAddresses } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';

const title = 'aelf Cumulative Addresses Chart';
const getOption = (list: any[], multi, chain): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const totalUniqueAddresses = multi ? item.mergeTotalUniqueAddressees : item.ownerUniqueAddressees;
    const mainUniqueAddresses = multi ? item.mainChainTotalUniqueAddressees : item.ownerUniqueAddressees;
    const sideUniqueAddresses = multi ? item.sideChainTotalUniqueAddressees : item.ownerUniqueAddressees;

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
    legend: multi,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { totalCount, mainData, sideData } = customMap[date];

      if (multi) {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Wallet Addresses</b>: <b>${thousandsNumber(totalCount)}</b><br/>MainChain Wallet Addresses: <b>${thousandsNumber(mainData)}</b><br/>SideChain Wallet Addresses: <b>${thousandsNumber(sideData)}</b><br/>
      `;
      } else {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Wallet Addresses</b>: <b>${thousandsNumber(chain === 'AELF' ? mainData : sideData)}</b>
      `;
      }
    },
    yAxisTitle: 'aelf Cumulative Address Growth',
    buttonPositionX: -25,
    data: allData,
    series: multi
      ? [
          {
            name: 'All Chains',
            type: 'line',
            data: allData,
          },
          {
            name: 'MainChain Wallet',
            type: 'line',
            data: mainData,
          },
          {
            name: 'MainChain Wallet',
            type: 'line',
            data: sideData,
          },
        ]
      : [
          {
            name: 'Total Wallet',
            type: 'line',
            data: chain === 'AELF' ? mainData : sideData,
          },
        ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef, chain, multi } = useFetchChartData<IDailyAddAddressData>({
    fetchFunc: fetchUniqueAddresses,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || [], multi, chain);
  }, [data, multi, chain]);

  const { download } = useChartDownloadData(data, chartRef, title);

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = multi ? 'mergeAddressCount' : 'addressCount';
    return data
      ? [
          {
            key: 'Highest',
            hiddenTitle: true,
            text: (
              <span>
                Highest increase of
                <span className="px-1 font-bold">{thousandsNumber(data.highestIncrease[key])}</span>
                addresses was recorded on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highestIncrease.date)}</span>
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
        aboutTitle="The chart shows the total distinct numbers of address on the aelf blockchain and the increase in the number of address daily"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
