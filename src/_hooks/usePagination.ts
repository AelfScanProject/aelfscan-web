import { useCallback } from 'react';

export function usePagination({ setCurrentPage, setPageSize, fetchData, setSelectChain, selectChain, pageSize }) {
  const pageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      fetchData(page, pageSize, selectChain);
    },
    [setCurrentPage, pageSize, fetchData, selectChain],
  );

  const pageSizeChange = useCallback(
    (page, size) => {
      setPageSize(size);
      setCurrentPage(page);
      fetchData(page, size, selectChain);
    },
    [setPageSize, setCurrentPage, fetchData, selectChain],
  );

  const chainChange = useCallback(
    (value) => {
      setSelectChain(value);
      setCurrentPage(1);
      fetchData(1, pageSize, value);
    },
    [setSelectChain, setCurrentPage, pageSize, fetchData],
  );

  return {
    pageChange,
    pageSizeChange,
    chainChange,
  };
}
