'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IHIGHLIGHTDataItem, IHoldersAccountData } from '../type';
import { fetchDailyHolder } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'ELF Holders';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const count = item.mergeCount;
    const mainCount = item.mainCount;
    const sideCount = item.sideCount;

    allData.push([date, count]);
    mainData.push([date, mainCount]);
    sideData.push([date, sideCount]);

    customMap[date] = {
      total: count,
      main: mainCount,
      side: sideCount,
    };
  });
  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: 'ELF Holders',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      return `
      ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total ELF Holders</b>: <b>${thousandsNumber(total)}</b><br/>aelf MainChain ELF Holders: <b>${thousandsNumber(main)}</b><br/>aelf dAppChain ELF Holders: <b>${thousandsNumber(side)}</b><br/>
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
  const { data, loading, chartRef } = useFetchChartData<IHoldersAccountData>({
    fetchFunc: fetchDailyHolder,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    mergeCount: 'Total ELF Holders',
    mainCount: 'aelf MainChain ELF Holders',
    sideCount: 'aelf dAppChain ELF Holders',
  });

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = 'mergeCount';
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest holders of
                <span className="px-1 font-bold">{thousandsNumber(data.highest[key])}</span>
                account were recorded on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highest.date)}</span>
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
        aboutTitle="The ELF Holders chart shows the trend of total accounts holding ELF on aelf."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
