import { fetchSearchFilters } from '@_api/fetchSearch';
import { TSearchValidator } from '@_components/Search/type';
import { useCallback, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';

const useSearchFilter = () => {
  const [options, setOptions] = useState<TSearchValidator>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchSearchFilters();
      setOptions(res?.filterTypes);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffectOnce(() => {
    fetchData();
  });

  return useMemo(() => {
    return {
      options,
      loading,
    };
  }, [loading, options]);
};

export default useSearchFilter;
