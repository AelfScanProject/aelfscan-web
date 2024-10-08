'use client';
import Highcharts from 'highcharts/highstock';
import { getChainId, thousandsNumber } from '@_utils/formatter';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartColors, IDailyAddAddressData, IHIGHLIGHTDataItem } from '../type';
import BaseHightCharts from '../_components/charts';
import { exportToCSV } from '@_utils/urlUtils';
import { useParams } from 'next/navigation';
import { fetchUniqueAddresses } from '@_api/fetchChart';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import PageLoadingSkeleton from '@_components/PageLoadingSkeleton';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { useMultiChain } from '@_hooks/useSelectChain';

const title = 'aelf Cumulative Addresses Chart';
const getOption = (list: any[], multi, chain): Highcharts.Options => {
  const allData: any[] = [];
  const mainData: any[] = [];
  const sideData: any[] = [];
  const customMap = {};

  list.forEach((item) => {
    if (multi) {
      allData.push([item.date, item.mergeTotalUniqueAddressees]);
      mainData.push([item.date, item.mainChainTotalUniqueAddressees]);
      sideData.push([item.date, item.sideChainTotalUniqueAddressees]);
      customMap[item.date] = {};
      customMap[item.date].totalCount = item.mergeTotalUniqueAddressees;
      customMap[item.date].mainData = item.mainChainTotalUniqueAddressees;
      customMap[item.date].sideData = item.sideChainTotalUniqueAddressees;
    } else {
      allData.push([item.date, item.addressCount]);
      mainData.push([item.date, item.addressCount]);
      sideData.push([item.date, item.addressCount]);
      customMap[item.date] = {};
      customMap[item.date].totalCount = item.addressCount;
      customMap[item.date].mainData = item.addressCount;
      customMap[item.date].sideData = item.addressCount;
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
        text: 'aelf Cumulative Address Growth',
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
        const { totalCount, mainData, sideData } = customMap[date];

        if (multi) {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Wallet Addresses</b>: <b>${thousandsNumber(totalCount)}</b><br/>MainChain Wallet Addresses: <b>${thousandsNumber(mainData)}</b><br/>SideChain Wallet Addresses: <b>${thousandsNumber(sideData)}</b><br/>
        `;
        } else {
          return `
          ${Highcharts.dateFormat('%A, %B %e, %Y', date)}<br/><b>Total Wallet Addresses</b>: <b>${thousandsNumber(chain === 'AELF' ? mainData : sideData)}</b>
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
            name: 'MainChain Wallet',
            type: 'line',
            data: mainData,
          },
          {
            name: 'MainChain Wallet',
            type: 'line',
            data: sideData,
          },
        ]
      : [
          {
            name: 'Total Wallet',
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
  const [data, setData] = useState<IDailyAddAddressData>();
  const [loading, setLoading] = useState<boolean>(false);
  const fetData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUniqueAddresses({ chainId: getChainId(chain) });
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
    return getOption(data?.list || [], multi, chain);
  }, [data, multi, chain]);

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
    const key = multi ? 'mergeAddressCount' : 'addressCount';
    return data
      ? [
          {
            key: 'Highest',
            hiddenTitle: true,
            text: (
              <span>
                Highest increase of
                <span className="px-1 font-bold">{thousandsNumber(data.highestIncrease[key])}</span>
                addresses was recorded on
                <span className="pl-1">{Highcharts.dateFormat('%A, %B %e, %Y', data.highestIncrease.date)}</span>
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
        aboutTitle="The chart shows the total distinct numbers of address on the aelf blockchain and the increase in the number of address daily"
        highlightData={highlightData}
        options={options}
        download={download}
      />
    )
  );
}
