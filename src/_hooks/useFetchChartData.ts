import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { getChainId } from '@_utils/formatter';
import { useMultiChain } from './useSelectChain';
import { exportToCSV } from '@_utils/urlUtils';

export function useFetchChartData<DataType>({
  fetchFunc,
  processData,
}: {
  fetchFunc: (params: { chainId: string }) => Promise<DataType>;
  processData: (response: DataType) => DataType;
  onSuccess?: (data: DataType) => void;
}): {
  data: DataType | undefined;
  loading: boolean;
  multi: boolean;
  chain: string;
  chartRef: React.RefObject<HighchartsReactRefObject>;
} {
  const { chain } = useParams<{ chain: string }>();
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState<boolean>(false);
  const chartRef = useRef<HighchartsReactRefObject>(null);
  const multi = useMultiChain();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchFunc({ chainId: getChainId(chain) });
      const processedData = processData(res);
      setData(processedData);
    } catch (error) {
      message.error(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, [chain, fetchFunc, processData]);

  useEffectOnce(() => {
    fetchData();
  });

  return { data, loading, chartRef, chain, multi };
}

export function useChartDownloadData(data: any, chartRef, title) {
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

  return { download };
}