'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, ISupplyGrowthData } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { message } from 'antd';
import { fetchDailySupplyGrowth } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'ELF Circulating Supply Growth Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.totalSupply)]);
    customMap[item.date] = {};
    customMap[item.date].reward = item.reward;
    customMap[item.date].burnt = item.mainChainBurnt;
    customMap[item.date].sideChainBurnt = item.sideChainBurnt;
    customMap[item.date].organizationUnlock = item.organizationUnlock;
    customMap[item.date].totalUnReceived = item.totalUnReceived;
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  return {
    legend: {
      enabled: false,
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
        x: -35,
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
        text: 'ELF Total Supply',
      },
      labels: {
        formatter: function () {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const num = Number(this.value);
          if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
          } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
          } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
          } else {
            return num.toString();
          }
        },
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
        const reward = customMap[date].reward;
        const burnt = customMap[date].burnt;
        const sideChainBurnt = customMap[date].sideChainBurnt;
        const organizationUnlock = customMap[date].organizationUnlock;
        const totalUnReceived = customMap[date].totalUnReceived;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>ELF Circulating Supply</b>: <b>${thousandsNumber(value)}</b><br/>+ Daily ELF rewards: <b>${thousandsNumber(reward)}</b><br/>+ Organization Unlock: <b>${thousandsNumber(organizationUnlock)}</b><br/>- MainChain burnt: <b>${thousandsNumber(burnt)}</b><br/>- SideChain burnt: <b>${thousandsNumber(sideChainBurnt)}</b><br/>- Unreceived: <b>${thousandsNumber(totalUnReceived)}</b><br/>
        `;
      },
    },
    series: [
      {
        name: 'Total Supply',
        type: 'line',
        data: allData,
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
  const { data, loading, chartRef } = useFetchChartData<ISupplyGrowthData>({
    fetchFunc: fetchDailySupplyGrowth,
    processData: (res) => res,
  });

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
    if (data) {
      exportToCSV(data?.list || [], title);
    } else {
      message.error('No data available to download.');
    }
  };

  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

  const highlightData = [];

  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The ELF Circulating Supply Growth Chart shows a breakdown of daily block reward and burnt fees to arrive at the total daily ELF supply."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
