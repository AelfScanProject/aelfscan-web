import { fetchSearchFilters } from '@_api/fetchSearch';
import { TSearchValidator } from '@_components/Search/type';
import { useCallback, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useAppDispatch } from '@_store';
import { setHomeFilters } from '@_store/features/chainIdSlice';

const useSearchFilter = () => {
  const [options, setOptions] = useState<TSearchValidator>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchSearchFilters();
      console.log(res, 'filterres');
      setOptions(res?.filterTypes);
      dispatch(setHomeFilters(res?.filterTypes || []));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);
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
