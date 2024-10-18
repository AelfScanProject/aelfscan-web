'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IDailyPriceDData } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyElfPrice } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useFetchChartData } from '@_hooks/useFetchChartData';

const title = 'ELF Daily Price (USD) Chart';

const formatTooltip = function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const that: any = this as any;
  const { x: date, y: value } = that.points[0];
  return `
    ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>ELF Price</b>: <b>$${thousandsNumber(value)}</b><br/>
  `;
};

const getChartSeries = (list) => list.map((item) => [item.date, Number(item.price)]);

const getOption = (list: any[]): Highcharts.Options => {
  const allData = getChartSeries(list);

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'ELF Price (USD)',
    buttonPositionX: -25,
    tooltipFormatter: formatTooltip,
    minDate: allData[0]?.[0],
    maxDate: allData.at(-1)?.[0],
    series: [{ name: title, type: 'line', data: allData }],
  });

  return options;
};

export default function Page() {
  const { data, loading, chartRef } = useFetchChartData<IDailyPriceDData>({
    fetchFunc: fetchDailyElfPrice,
    processData: (res) => res,
  });

  const options = useMemo(() => getOption(data?.list || []), [data]);
  useEffect(() => {
    if (data) {
      const chart = chartRef.current?.chart;
      if (chart) {
        const minDate = data.list[0]?.date;
        const maxDate = data.list.at(-1)?.date;
        chart.xAxis[0].setExtremes(minDate, maxDate);
      }
    }
  }, [chartRef, data]);

  const download = () => exportToCSV(data?.list || [], title);

  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The ELF Daily Price (USD) chart shows the daily historical price for ELF in USD."
        highlightData={[]}
        options={options}
        download={download}
      />
    )
  );
}
