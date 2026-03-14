import { useEffect } from 'react';

export const useClampPage = (page: number, totalPages: number, setPage: (nextPage: number) => void) => {
  useEffect(() => {
    if (totalPages === 0 && page !== 1) {
      setPage(1);
      return;
    }

    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, setPage, totalPages]);
};
