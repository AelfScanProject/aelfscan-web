'use client';
import Highcharts from 'highcharts/highstock';
import { getChainId, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IDailyBurntData, IHIGHLIGHTDataItem } from '../type';
const title = 'Daily ELF Burnt Chart';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchDailyTotalBurnt } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { useMultiChain } from '@_hooks/useSelectChain';
const getOption = (list: any[], chain, multi): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    if (multi) {
      allData.push([item.date, Number(item.mergeBurnt)]);
      mainData.push([item.date, Number(item.mainChainBurnt)]);
      sideData.push([item.date, Number(item.sideChainBurnt)]);
      customMap[item.date] = {};
      customMap[item.date].total = Number(item.mergeBurnt);
      customMap[item.date].main = Number(item.mainChainBurnt);
      customMap[item.date].side = Number(item.sideChainBurnt);
    } else {
      allData.push([item.date, Number(item.burnt)]);
      mainData.push([item.date, Number(item.burnt)]);
      sideData.push([item.date, Number(item.burnt)]);
      customMap[item.date] = {};
      customMap[item.date].total = Number(item.burnt);
      customMap[item.date].main = Number(item.burnt);
      customMap[item.date].side = Number(item.burnt);
    }
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  return {
    legend: {
      enabled: multi,
    },
    colors: ChartColors,
    chart: {
      type: 'line',
    },
    rangeSelector: {
      enabled: true,
      selected: 3,
      buttonPosition: {
        align: 'left',
        x: -25,
      },
      buttons: [
        {
          type: 'month',
          count: 1,
          text: '1m',
          title: 'View 1 months',
        },
        {
          type: 'month',
          count: 6,
          text: '6m',
          title: 'View 6 months',
        },
        {
          type: 'year',
          count: 1,
          text: '1y',
          title: 'View 1 year',
        },
        {
          type: 'all',
          text: 'All',
          title: 'View all',
        },
      ],
    },
    navigator: {
      enabled: false,
    },
    title: {
      text: title,
      align: 'left',
    },
    subtitle: {
      text: 'Click and drag in the plot area to zoom in',
      align: 'left',
    },
    xAxis: {
      type: 'datetime',
      min: minDate,
      max: maxDate,
      startOnTick: false,
      endOnTick: false,
    },
    yAxis: {
      title: {
        text: 'Daily ELF Burnt',
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      formatter: function () {
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
    },
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
  const [data, setData] = useState<IDailyBurntData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyTotalBurnt({ chainId: getChainId(chain) });
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

  const multi = useMultiChain();
  const options = useMemo(() => {
    return getOption(data?.list || [], chain, multi);
  }, [chain, data?.list, multi]);

  const chartRef = useRef<HighchartsReactRefObject>(null);
  useEffect(() => {
    if (data) {
      const chart = chartRef.current?.chart;
      if (chart) {
        const minDate = data.list[0]?.date;
        const maxDate = data.list[data.list.length - 1]?.date;
        chart.xAxis[0].setExtremes(minDate, maxDate);
      }
    }
  }, [data]);

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
