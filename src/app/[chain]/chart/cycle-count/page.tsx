'use client';
import Highcharts, { AlignValue } from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IAelfDailyCycleCountData, IHIGHLIGHTDataItem } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { useEffectOnce } from 'react-use';
import { fetchCycleCount } from '@_api/fetchChart';
import { message } from 'antd';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';

const title = 'aelf Daily Cycle Count Chart';

const formatTooltip = (customMap) =>
  function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const point = this.points[0];
    const date = point.x;
    const value = point.y;
    const { missedCycle, missedBlockCount } = customMap[date];
    return `
    ${Highcharts.dateFormat('%A, %B %e, %Y', date)}
    <br/><b>Cycle Count</b>: <b>${thousandsNumber(value)}</b>
    <br/>Missed Block Count: <b>${thousandsNumber(missedBlockCount)}</b>
    <br/>Missed Cycle: <b>${thousandsNumber(missedCycle)}</b>
    <br/>
  `;
  };

const getChartOption = (list): Highcharts.Options => {
  const allData = list.map((item) => [item.date, item.cycleCount]);
  const customMap = list.reduce((acc, item) => {
    acc[item.date] = { missedBlockCount: item.missedBlockCount, missedCycle: item.missedCycle };
    return acc;
  }, {});

  return {
    legend: { enabled: false },
    colors: ChartColors,
    chart: { type: 'line' },
    rangeSelector: {
      enabled: true,
      buttonPosition: { align: 'left' as AlignValue, x: -30 },
      selected: 3,
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
    yAxis: { title: { text: 'Daily Cycle Count' } },
    credits: { enabled: false },
    tooltip: { shared: true, formatter: formatTooltip(customMap) },
    series: [{ name: 'Active Addresses', type: 'line', data: allData }],
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
  const [data, setData] = useState<IAelfDailyCycleCountData>();
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCycleCount({ chainId: chain });
      setData(res);
    } catch (error) {
      message.error(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, [chain]);

  useEffectOnce(() => {
    fetchData();
  });

  const options = useMemo(() => getChartOption(data?.list || []), [data]);

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

  const highlightData = useMemo<IHIGHLIGHTDataItem[]>(
    () =>
      data
        ? [
            {
              key: 'Highest',
              text: (
                <span>
                  Highest missed cycle of
                  <span className="px-1 font-bold">{thousandsNumber(data.highestMissedCycle.missedCycle)}</span>
                  was on
                  <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highestMissedCycle.date)}</span>
                </span>
              ),
            },
          ]
        : [],
    [data],
  );

  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The aelf daily cycle count chart shows the daily cycle count and missed cycle of the aelf network. The aelf network has one cycle every 8 seconds"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
