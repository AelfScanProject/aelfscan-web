'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IDailyBurntData, IHIGHLIGHTDataItem } from '../type';
const title = 'Daily ELF Burnt Chart';
import { fetchDailyTotalBurnt } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const burntValue = Number(item.mergeBurnt);
    const mainBurnt = Number(item.mainChainBurnt);
    const sideBurnt = Number(item.sideChainBurnt);

    allData.push([date, burntValue]);
    mainData.push([date, mainBurnt]);
    sideData.push([date, sideBurnt]);

    customMap[date] = {
      total: burntValue,
      main: mainBurnt,
      side: sideBurnt,
    };
  });

  const options = getChartOptions({
    title: title,
    legend: true,
    yAxisTitle: 'Daily ELF Burnt',
    buttonPositionX: -25,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Daily ELF Burnt</b>: <b>${thousandsNumber(total)}</b><br/>aelf MainChain Daily ELF Burnt: <b>${thousandsNumber(main)}</b><br/>aelf dAppChain Daily ELF Burnt: <b>${thousandsNumber(side)}</b><br/>
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
  const { data, loading, chartRef } = useFetchChartData<IDailyBurntData>({
    fetchFunc: fetchDailyTotalBurnt,
    processData: (res) => res,
  });

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data?.list]);

  const { download } = useChartDownloadData(data, chartRef, title, {
    mergeBurnt: 'Total Daily ELF Burnt',
    mainChainBurnt: 'aelf MainChain Daily ELF Burnt',
    sideChainBurnt: 'aelf dAppChain Daily ELF Burnt',
  });

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(() => {
    const key = 'mergeBurnt';
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest amount of ELF burnt
                <span className="px-1 font-bold">{thousandsNumber(data.highest[key])}</span>
                ELF on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highest?.date)}</span>
              </span>
            ),
          },
          {
            key: 'Lowest',
            hidden: true,
            text: (
              <span>
                Lowest amount of ELF burnt
                <span className="px-1 font-bold">{thousandsNumber(data.lowest[key])}</span>
                ELF on {Highcharts.dateFormat('%A, %B %e, %Y', data.lowest?.date)}
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
        aboutTitle="The chart shows the daily amount of ELF burnt"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
