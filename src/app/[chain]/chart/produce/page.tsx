'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useEffect, useMemo, useRef } from 'react';
const title = 'Block Producers';
import { useParams } from 'next/navigation';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { TChainID } from '@_api/type';
import useBpProduce from '@_hooks/useBpProduce';
let highlightElement;
let centerElement;
import List from './list';

const gbColors = [
  'rgba(144, 171, 240, 0.3)',
  'rgba(110, 175, 160, 0.3)',
  'rgba(117, 165, 220, 0.3)',
  'rgba(154, 208, 225, 0.3)',
  'rgba(117, 175, 176, 0.3)',
  'rgba(120, 163, 221, 0.3)',
  'rgba(140, 172, 209, 0.3)',
  'rgba(146, 153, 223, 0.3)',
  'rgba(224, 178, 135, 0.3)',
  'rgba(203, 136, 136, 0.3)',
  'rgba(134, 167, 232, 0.3)',
  'rgba(118, 164, 217, 0.3)',
  'rgba(128, 180, 191, 0.3)',
  'rgba(126, 154, 225, 0.3)',
  'rgba(113, 129, 185, 0.3)',
  'rgba(102, 139, 148, 0.3)',
  'rgba(183, 152, 134, 0.3)',
  'rgba(147, 140, 220, 0.3)',
  'rgba(212, 183, 138, 0.3)',
  'rgba(209, 168, 168, 0.3)',
  'rgba(175, 205, 233, 0.3)',
];

const drawRoundedColumn = (chart) => {
  if (centerElement) {
    centerElement.destroy();
  }
  const renderer = chart.renderer;
  const centerX = chart.plotLeft + chart.plotWidth / 2;
  const centerY = chart.plotTop + chart.plotHeight / 2;

  // const innerRadius = chart.yAxis[0].toPixels(0);
  const innerRadius = Math.min(chart.plotWidth, chart.plotHeight) * 0.1;
  console.log(innerRadius, 'innerRadius');

  centerElement = renderer
    .circle(centerX, centerY, innerRadius)
    .attr({
      fill: 'rgb(255, 255, 255)',
      zIndex: 10,
    })
    .add();
};

const drawHighlight = (chart: any, highlightIndex: number, totalCategories: number) => {
  if (highlightElement) {
    highlightElement.destroy();
  }
  const plotWidth = chart.plotWidth;
  const plotHeight = chart.plotHeight;
  const radius = Math.min(plotWidth, plotHeight) / 2;

  const anglePerSector = 360 / totalCategories;
  const startAngle = highlightIndex * anglePerSector;
  const endAngle = startAngle + anglePerSector;

  const startRad = (startAngle - 90 - anglePerSector / 2) * (Math.PI / 180);
  const endRad = (endAngle - 90 - anglePerSector / 2) * (Math.PI / 180);

  const outerRadius = radius * 0.9;
  const innerRadius = 0;
  const centerX = chart.plotLeft + chart.plotWidth / 2;
  const centerY = chart.plotTop + chart.plotHeight / 2;

  highlightElement = chart.renderer
    .path([
      ['M', centerX + innerRadius * Math.cos(startRad), centerY + innerRadius * Math.sin(startRad)],
      ['L', centerX + outerRadius * Math.cos(startRad), centerY + outerRadius * Math.sin(startRad)],
      [
        'A',
        outerRadius,
        outerRadius,
        0,
        0,
        1,
        centerX + outerRadius * Math.cos(endRad),
        centerY + outerRadius * Math.sin(endRad),
      ],
      ['L', centerX + innerRadius * Math.cos(endRad), centerY + innerRadius * Math.sin(endRad)],
      [
        'A',
        innerRadius,
        innerRadius,
        0,
        0,
        0,
        centerX + innerRadius * Math.cos(startRad),
        centerY + innerRadius * Math.sin(startRad),
      ],
      ['Z'],
    ])
    .attr({
      fill: gbColors[highlightIndex],
      zIndex: 4,
    })
    .add();
};

const getOption = (list: any[]): Highcharts.Options => {
  const length = list.length;
  const allData: any[] = Array.from({ length }, () => {
    return 83;
  });
  const categories: any[] = [];
  const customMap = {};
  list.forEach((item) => {
    categories.push(item.producerName || item.producerAddress);
    const key = item.producerName || item.producerAddress;
    customMap[key] = {};
    customMap[key].missedCount = item.missedCount;
    customMap[key].blockCount = item.blockCount;
  });

  const highlightIndex = list.findIndex((item) => item.isMinning);
  console.log(highlightIndex, 'highlightIndex');
  const totalCategories = categories.length;
  return {
    chart: {
      polar: true,
      type: 'column',
      events: {
        load: function () {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          drawRoundedColumn(this);
          drawHighlight(this, highlightIndex, totalCategories);
        },
      },
    },
    colors: [
      'rgba(144, 171, 240, 0.8)',
      'rgba(110, 175, 160, 0.8)',
      'rgba(117, 165, 220, 0.8)',
      'rgba(154, 208, 225, 0.8)',
      'rgba(117, 175, 176, 0.8)',
      'rgba(120, 163, 221, 0.8)',
      'rgba(140, 172, 209, 0.8)',
      'rgba(146, 153, 223, 0.8)',
      'rgba(224, 178, 135, 0.8)',
      'rgba(203, 136, 136, 0.8)',
      'rgba(134, 167, 232, 0.8)',
      'rgba(118, 164, 217, 0.8)',
      'rgba(128, 180, 191, 0.8)',
      'rgba(126, 154, 225, 0.8)',
      'rgba(113, 129, 185, 0.8)',
      'rgba(102, 139, 148, 0.8)',
      'rgba(183, 152, 134, 0.8)',
      'rgba(147, 140, 220, 0.8)',
      'rgba(212, 183, 138, 0.8)',
      'rgba(209, 168, 168, 0.8)',
      'rgba(175, 205, 233, 0.8)',
    ],
    title: {
      align: 'left',
      text: title,
      style: {
        color: '#FFF',
      },
    },
    pane: {
      size: '90%',
      center: ['50%', '50%'], // 设置pane位于图表中心
      background: [
        {
          // 设置pane的背景样式
          shape: 'circle',
          borderWidth: 0,
          backgroundColor: 'rgba(255, 255, 255)', // 白色圆圈的颜色和透明度
        },
      ],
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories: categories,
      labels: {
        enabled: false,
        style: {
          fontSize: '12px', // Adjust label font size if needed
        },
        rotation: -20,
      },
      lineWidth: 0,
    },
    yAxis: {
      lineWidth: 0,
      gridLineInterpolation: 'circle',
      min: 0,
      labels: {
        enabled: false,
      },
      max: 100,
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
        const name = point.x;
        const value = customMap[name].blockCount;
        const missedCount = customMap[name].missedCount;
        return `
          <b>BP</b>: <b>${name}</b><br/>Blocks Produced: <b>${thousandsNumber(value)}</b><br/>Blocks Missed: <b>${thousandsNumber(missedCount)}</b><br/>
        `;
      },
    },
    plotOptions: {
      series: {
        shadow: false,
        pointPlacement: 'between',
        stacking: 'normal',
      },
      column: {
        borderRadius: 10,
        pointPadding: 0.05,
        groupPadding: 0.05,
      },
    },
    series: [
      {
        type: 'column',
        name: 'Investment',
        data: allData,
        pointPlacement: 'on',
        colorByPoint: true,
      },
    ],
  };
};
export default function Page() {
  const { chain } = useParams<{ chain: TChainID }>();
  const { loading, produces } = useBpProduce(chain);
  const options = useMemo(() => {
    return getOption(produces || []);
  }, [produces]);

  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    if (produces) {
      const chart = chartRef.current?.chart;
      const highlightIndex = produces.findIndex((item) => item.isMinning);
      if (chart) {
        drawHighlight(chartRef.current.chart, highlightIndex, produces.length);
        drawRoundedColumn(chartRef.current.chart);
      }
    }
  }, [produces]);
  const download = () => {};
  const highlightData = [];
  return loading ? (
    <PageLoadingSkeleton />
  ) : (
    <div>
      <BaseHightCharts
        ref={chartRef}
        title={title}
        hiddenDownload
        aboutTitle="The Block Production chart shows the block distribution of BP, who are obliged to verify transactions and produce blocks. BPs are elected every 7 days."
        highlightData={highlightData}
        options={options}
        download={download}
      />
      <div>
        <List />
      </div>
    </div>
  );
}
