import { useState, useCallback, useEffect } from 'react';
import { universitiesAPI } from '../api/universities.api';
import type { IUniversity } from '../types/universities.types';
import type { CreateUniversityDto, UpdateUniversityDto } from '../dtos/universities.dto';
import { AppToast } from '@/utils/toast-utils';

export function useUniversities() {
  const [universities, setUniversities] = useState<IUniversity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    try {
      setUniversities(await universitiesAPI.getUniversities());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch universities';
      AppToast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUniversities(); }, [fetchUniversities]);

  const createUniversity = useCallback(async (data: CreateUniversityDto) => {
    try {
      await universitiesAPI.createUniversity(data);
      AppToast.success('University added');
      void fetchUniversities();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create university';
      AppToast.error(msg);
      throw err;
    }
  }, [fetchUniversities]);

  const updateUniversity = useCallback(async (id: string, data: UpdateUniversityDto) => {
    try {
      await universitiesAPI.updateUniversity(id, data);
      AppToast.success('University updated');
      void fetchUniversities();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update university';
      AppToast.error(msg);
      throw err;
    }
  }, [fetchUniversities]);

  const deleteUniversity = useCallback(async (id: string) => {
    try {
      await universitiesAPI.deleteUniversity(id);
      AppToast.success('University deleted');
      void fetchUniversities();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete university';
      AppToast.error(msg);
      throw err;
    }
  }, [fetchUniversities]);

  return { universities, loading, refetch: fetchUniversities, createUniversity, updateUniversity, deleteUniversity };
}
