import { fetchAccountDetail } from '@_api/fetchContact';
import { IPortfolio } from '@_types/commonDetail';
import { getAddress } from '@_utils/formatter';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export default function useRefreshDetail(defaultData: IPortfolio) {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<IPortfolio>(defaultData);

  const { address } = useParams<{
    address: string;
  }>();

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAccountDetail({
        chainId: '',
        address: getAddress(address),
      });
      setData(res.portfolio);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  return useMemo(
    () => ({
      data,
      loading,
      refreshData,
    }),
    [data, loading, refreshData],
  );
}
