'use client';
import Highcharts from 'highcharts/highstock';
import '../index.css';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import { useEffect, useMemo } from 'react';
import { IDeployedContractsData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyDeployContract } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import dayjs from 'dayjs';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';

const title = 'aelf Deployed Contracts Chart';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const dailyIncreaseData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const dateInMillis = dayjs(item.date).valueOf();
    const dailyIncreaseContract = Number(item.count);
    const totalCount = multi ? Number(item.mergeTotalCount) : Number(item.totalCount);
    const mainCount = multi ? Number(item.mainChainTotalCount) : totalCount;
    const sideCount = multi ? Number(item.sideChainTotalCount) : totalCount;

    allData.push([dateInMillis, totalCount]);
    mainData.push([dateInMillis, mainCount]);
    sideData.push([dateInMillis, sideCount]);
    dailyIncreaseData.push([dateInMillis, dailyIncreaseContract]);

    customMap[item.date] = {
      total: totalCount,
      main: mainCount,
      side: sideCount,
      dailyIncreaseContract: dailyIncreaseContract,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: multi,
    yAxisTitle: 'aelf Cumulative Contracts',
    buttonPositionX: -25,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const value = point.y;
      const { total, main, side } = customMap[date];
      if (multi) {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Deployed Contracts</b>: <b>${thousandsNumber(total)}</b><br/>aelf MainChain Deployed Contracts: <b>${thousandsNumber(main)}</b><br/>aelf dAppChain Deployed Contracts: <b>${thousandsNumber(side)}</b><br/>
      `;
      } else {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Deployed Contracts</b>: <b>${thousandsNumber(value)}</b><br/>
      `;
      }
    },
    data: allData,
    series: multi
      ? [
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
        ]
      : [
          {
            name: 'Cumulative Contracts',
            type: 'line',
            data: chain === 'AELF' ? mainData : sideData,
          },
        ],
  });

  return options;
};

export default function Page() {
  const { data, loading, chartRef, chain, multi } = useFetchChartData<IDeployedContractsData>({
    fetchFunc: fetchDailyDeployContract,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || [], chain, multi);
  }, [chain, data?.list, multi]);

  const { download } = useChartDownloadData(data, chartRef, title);

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
