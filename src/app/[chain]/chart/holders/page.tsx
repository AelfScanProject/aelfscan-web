'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { IHIGHLIGHTDataItem, IHoldersAccountData } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyHolder } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'ELF Holders';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const count = multi ? item.mergeCount : item.count;
    const mainCount = multi ? item.mainCount : count;
    const sideCount = multi ? item.sideCount : count;

    allData.push([date, count]);
    mainData.push([date, mainCount]);
    sideData.push([date, sideCount]);

    customMap[date] = {
      total: count,
      main: mainCount,
      side: sideCount,
    };
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  const options = getChartOptions({
    title: title,
    legend: multi,
    yAxisTitle: 'ELF Holders',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      if (multi) {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total ELF Holders</b>: <b>${thousandsNumber(total)}</b><br/>MainChain ELF Holders: <b>${thousandsNumber(main)}</b><br/>SideChain ELF Holders: <b>${thousandsNumber(side)}</b><br/>
      `;
      } else {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>ELF Holders</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>
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
            name: 'Total Tx Fee',
            type: 'line',
            data: chain === 'AELF' ? mainData : sideData,
          },
        ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef, chain } = useFetchChartData<IHoldersAccountData>({
    fetchFunc: fetchDailyHolder,
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
    const key = multi ? 'mergeCount' : 'count';
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
  }, [data, multi]);
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
