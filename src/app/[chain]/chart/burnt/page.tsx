'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IDailyBurntData, IHIGHLIGHTDataItem } from '../type';
const title = 'Daily ELF Burnt Chart';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyTotalBurnt } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    const date = item.date;
    const burntValue = multi ? Number(item.mergeBurnt) : Number(item.burnt);
    const mainBurnt = multi ? Number(item.mainChainBurnt) : burntValue;
    const sideBurnt = multi ? Number(item.sideChainBurnt) : burntValue;

    allData.push([date, burntValue]);
    mainData.push([date, mainBurnt]);
    sideData.push([date, sideBurnt]);

    customMap[date] = {
      total: burntValue,
      main: mainBurnt,
      side: sideBurnt,
    };
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  const options = getChartOptions({
    title: title,
    legend: multi,
    yAxisTitle: 'Daily ELF Burnt',
    buttonPositionX: -25,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const { total, main, side } = customMap[date];
      if (multi) {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Daily ELF Burnt</b>: <b>${thousandsNumber(total)}</b><br/>MainChain Daily ELF Burnt: <b>${thousandsNumber(main)}</b><br/>SideChain Daily ELF Burnt: <b>${thousandsNumber(side)}</b><br/>
      `;
      } else {
        return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Daily ELF Burnt</b>: <b>${thousandsNumber(chain === 'AELF' ? main : side)}</b><br/>
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
            name: title,
            type: 'line',
            data: chain === 'AELF' ? mainData : sideData,
          },
        ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef, chain } = useFetchChartData<IDailyBurntData>({
    fetchFunc: fetchDailyTotalBurnt,
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
    const key = multi ? 'mergeBurnt' : 'burnt';
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
            hidden: multi,
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
  }, [data, multi]);
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
