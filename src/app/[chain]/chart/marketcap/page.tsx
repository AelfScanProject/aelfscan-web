'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber, unitConverter } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useMemo } from 'react';
import { IMarkerCap } from '../type';
import { fetchDailyMarketCap } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useChartDownloadData, useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'aelf Market Cap Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.totalMarketCap)]);
    customMap[item.date] = {};
    customMap[item.date].fdv = item.fdv;
    customMap[item.date].price = item.price;
  });

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'ELF Market Cap (USD)',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const value = point.y;
      const fdv = customMap[date].fdv;
      const price = customMap[date].price;
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>ELF Market Cap</b>: <b>${unitConverter(value)}</b><br/>FDV: <b>${unitConverter(fdv)}</b><br/>ELF Price(USD): <b>${thousandsNumber(price)}</b><br/>
      `;
    },
    data: allData,
    series: [
      {
        name: 'Total Supply',
        type: 'line',
        data: allData,
      },
    ],
  });

  return options;
};
export default function Page() {
  const { data, loading, chartRef } = useFetchChartData<IMarkerCap>({
    fetchFunc: fetchDailyMarketCap,
    processData: (res) => res,
  });
  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

  const { download } = useChartDownloadData(data, chartRef, title);

  const highlightData = [];
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The ELF Market Capitalization chart shows the historical breakdown of ELF daily market capitalization and average price"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
