'use client';
import Highcharts from 'highcharts/highstock';
import { getChartOptions, thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo } from 'react';
import { ChartColors, IStakedData } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { fetchDailyStaked } from '@_api/fetchChart';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { useFetchChartData } from '@_hooks/useFetchChartData';
const title = 'ELF Staked Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    allData.push([item.date, Number(item.totalStaked)]);
    customMap[item.date] = {};
    customMap[item.date].bpStaked = item.bpStaked;
    customMap[item.date].voteStaked = item.voteStaked;
    customMap[item.date].stakingRate = item.rate;
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  const options = getChartOptions({
    title: title,
    legend: false,
    yAxisTitle: 'ELF Staked Amount',
    buttonPositionX: -35,
    tooltipFormatter: function () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that: any = this;
      const point = that.points[0] as any;
      const date = point.x;
      const value = point.y;
      const bpStaked = customMap[date].bpStaked;
      const voteStaked = customMap[date].voteStaked;
      const stakingRate = customMap[date].stakingRate;
      return `
        ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total ELF Staked</b>: <b>${thousandsNumber(value)}</b><br/>BP Staked: <b>${thousandsNumber(bpStaked)}</b><br/>Vote Staked: <b>${thousandsNumber(voteStaked)}</b><br/>Staking Rate: <b>${stakingRate}%</b><br/>
      `;
    },
    minDate,
    maxDate,
    series: [
      {
        name: 'Total Supply',
        type: 'line',
        data: allData,
      },
    ],
  });

  return options;

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
        text: 'ELF Staked Amount',
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
        const bpStaked = customMap[date].bpStaked;
        const voteStaked = customMap[date].voteStaked;
        const stakingRate = customMap[date].stakingRate;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total ELF Staked</b>: <b>${thousandsNumber(value)}</b><br/>BP Staked: <b>${thousandsNumber(bpStaked)}</b><br/>Vote Staked: <b>${thousandsNumber(voteStaked)}</b><br/>Staking Rate: <b>${stakingRate}%</b><br/>
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
  const { data, loading, chartRef } = useFetchChartData<IStakedData>({
    fetchFunc: fetchDailyStaked,
    processData: (res) => res,
  });
  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

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
  const highlightData = [];
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    data && (
      <BaseHightCharts
        ref={chartRef}
        title={title}
        aboutTitle="The ELF Staked chart shows the historical staked amount of ELF. A higher staked amount can make the PoS-based blockchain network more secure."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
