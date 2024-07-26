'use client';
import Highcharts from 'highcharts/highstock';
import { thousandsNumber } from '@_utils/formatter';
import BaseHightCharts from '../_components/charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IHIGHLIGHTDataItem, ITVLData } from '../type';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { fetchDailyTvl } from '@_api/fetchChart';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
const title = 'TVL Chart';
const getOption = (list: any[]): Highcharts.Options => {
  const allData: any[] = [];
  const BPData: any[] = [];
  const VoteData: any[] = [];
  const Awaken: any[] = [];
  list.forEach((item) => {
    allData.push([item.date, Number(item.tvl)]);
    BPData.push([item.date, Number(item.bpLocked)]);
    VoteData.push([item.date, Number(item.voteLocked)]);
    Awaken.push([item.date, Number(item.awakenLocked)]);
  });

  const minDate = allData[0] && allData[0][0];
  const maxDate = allData[allData.length - 1] && allData[allData.length - 1][0];

  return {
    colors: ChartColors,
    chart: {
      type: 'spline',
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
        // marker: {
        //   symbol: 'circle',
        //   fillColor: '#FFFFFF',
        //   enabled: true,
        //   radius: 2.5,
        //   lineWidth: 1,
        //   lineColor: undefined,
        // },
      },
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
        text: 'TVL',
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
        console.log(that);
        const point = that.points[0] as any;
        const date = point.x;
        const value = point.y;
        const bp = that.points[1]?.y;
        const vote = that.points[2]?.y;
        const awaken = that.points[3]?.y;
        return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>TVL</b>: <b>$${thousandsNumber(value)}</b><br/>BP Locked: <b>$${thousandsNumber(bp)}</b><br/>Vote Locked: <b>$${thousandsNumber(vote)}</b><br/>Awaken: <b>$${thousandsNumber(awaken)}</b><br/>
        `;
      },
    },
    series: [
      {
        name: 'TVL',
        type: 'line',
        data: allData,
      },
      {
        name: 'BP',
        type: 'line',
        data: BPData,
      },
      {
        name: 'Vote',
        type: 'line',
        data: VoteData,
      },
      {
        name: 'Awaken',
        type: 'line',
        data: Awaken,
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
  const [data, setData] = useState<ITVLData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDailyTvl({ chainId: chain });
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
  const options = useMemo(() => {
    return getOption(data?.list || []);
  }, [data]);

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
    return data
      ? [
          {
            key: 'Highest',
            text: (
              <span>
                Highest TVL of
                <span className="px-1 font-bold">${thousandsNumber(data.highest.tvl)}</span>
                were recorded on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highest.date)}</span>
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
        aboutTitle="The TVL chart shows the total value of crypto assets locked in various protocols on aelf, including the aelf protocol itself and DeFi protocols on aelf."
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
