import { useCallback } from 'react';
import type { SetURLSearchParams } from 'react-router-dom';

export const usePageQueryParam = (
  searchParams: URLSearchParams,
  setSearchParams: SetURLSearchParams,
  paramName = 'page'
) => {
  const pageParam = Number.parseInt(searchParams.get(paramName) ?? '1', 10);
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const setPage = useCallback(
    (nextPage: number) => {
      const normalized = nextPage < 1 ? 1 : nextPage;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(paramName, String(normalized));
        return next;
      });
    },
    [paramName, setSearchParams]
  );

  return {
    page,
    setPage,
  };
};
