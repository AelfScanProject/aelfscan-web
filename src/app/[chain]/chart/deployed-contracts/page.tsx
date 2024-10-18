'use client';
import Highcharts from 'highcharts/highstock';
import '../index.css';
import { thousandsNumber } from '@_utils/formatter';
import { useEffect, useMemo } from 'react';
import { ChartColors, IDeployedContractsData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyDeployContract } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import dayjs from 'dayjs';
import { useMultiChain } from '@_hooks/useSelectChain';
import { useFetchChartData } from '@_hooks/useFetchChartData';

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
          title: 'View 1 month',
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
        text: 'aelf Cumulative Contracts',
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
        const value = point.y;
        const { total, main, side } = customMap[date];
        if (multi) {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Deployed Contracts</b>: <b>${thousandsNumber(total)}</b><br/>MainChain Deployed Contracts: <b>${thousandsNumber(main)}</b><br/>SideChain Deployed Contracts: <b>${thousandsNumber(side)}</b><br/>
        `;
        } else {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Deployed Contracts</b>: <b>${thousandsNumber(value)}</b><br/>
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
            name: 'Cumulative Contracts',
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
  const { data, loading, chartRef, chain } = useFetchChartData<IDeployedContractsData>({
    fetchFunc: fetchDailyDeployContract,
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
