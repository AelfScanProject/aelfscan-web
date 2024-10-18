import { useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { message } from 'antd';
import { useEffectOnce } from 'react-use';
import { HighchartsReactRefObject } from 'highcharts-react-official';
import { getChainId } from '@_utils/formatter';

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
  chain: string;
  chartRef: React.RefObject<HighchartsReactRefObject>;
} {
  const { chain } = useParams<{ chain: string }>();
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState<boolean>(false);
  const chartRef = useRef<HighchartsReactRefObject>(null);

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

  return { data, loading, chartRef, chain };
}
