import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export default function useSelectChain() {
  const { chain } = useParams();
  const [selectChain, setSelectChain] = useState(chain);

  const chainChange = useCallback((value: string) => {
    setSelectChain(value);
  }, []);

  return {
    selectChain: useMemo(() => selectChain, [selectChain]),
    chainChange,
  };
}
