'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IDailyPriceDData } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchDailyElfPrice } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';

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

  return {
    legend: { enabled: false },
    colors: ChartColors,
    chart: { type: 'line' },
    rangeSelector: {
      enabled: true,
      selected: 3,
      buttonPosition: { align: 'left', x: -25 },
      buttons: [
        { type: 'month', count: 1, text: '1m', title: 'View 1 months' },
        { type: 'month', count: 6, text: '6m', title: 'View 6 months' },
        { type: 'year', count: 1, text: '1y', title: 'View 1 year' },
        { type: 'all', text: 'All', title: 'View all' },
      ],
    },
    navigator: { enabled: false },
    title: { text: title, align: 'left' },
    subtitle: { text: 'Click and drag in the plot area to zoom in', align: 'left' },
    xAxis: { type: 'datetime', min: allData[0]?.[0], max: allData.at(-1)?.[0], startOnTick: false, endOnTick: false },
    yAxis: { title: { text: 'ELF Price (USD)' } },
    credits: { enabled: false },
    tooltip: { shared: true, formatter: formatTooltip },
    series: [{ name: title, type: 'line', data: allData }],
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['viewFullscreen', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG'],
        },
      },
    },
  };
};

export default function Page() {
  const { chain } = useParams<{ chain: string }>();
  const [data, setData] = useState<IDailyPriceDData>();
  const [loading, setLoading] = useState(false);

  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyElfPrice({ chainId: chain });
      setData(res);
    } catch (error) {
      message.error(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, [chain]);

  useEffectOnce(() => {
    fetData();
  });

  const options = useMemo(() => getOption(data?.list || []), [data]);

  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    if (data) {
      const chart = chartRef.current?.chart;
      if (chart) {
        const minDate = data.list[0]?.date;
        const maxDate = data.list.at(-1)?.date;
        chart.xAxis[0].setExtremes(minDate, maxDate);
      }
    }
  }, [data]);

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
