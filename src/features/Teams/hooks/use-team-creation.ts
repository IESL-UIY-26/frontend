import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { IUniversity } from '@/features/Admin/types/universities.types';
import type { IUserSearchResult } from '../types/teams.types';
import { teamsAPI } from '../api/teams.api';
import { usersAPI } from '../api/users.api';
import { useTeamStatus } from '../context/TeamStatusContext';
import api from '@/utils/api-client';

export const useTeamCreation = () => {
  const navigate = useNavigate();
  const { refreshMyTeam } = useTeamStatus();
  const [universities, setUniversities] = useState<IUniversity[]>([]);
  const [universitiesLoading, setUniversitiesLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IUserSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // Fetch universities for dropdowns
  useEffect(() => {
    api
      .get<IUniversity[]>('/api/universities')
      .then((res) => setUniversities(res.data))
      .catch(() => toast.error('Failed to load universities'))
      .finally(() => setUniversitiesLoading(false));
  }, []);

  // Debounced user search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await usersAPI.search(value);
        setSearchResults(results);
      } catch {
        toast.error('User search failed');
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const submitTeam = useCallback(
    async (formValues: Parameters<typeof teamsAPI.createTeam>[0]) => {
      setSubmitting(true);
      try {
        await teamsAPI.createTeam(formValues);
        await refreshMyTeam();
        toast.success('Team created successfully! 🎉');
        navigate('/my-team');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create team';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [navigate, refreshMyTeam]
  );

  return {
    universities,
    universitiesLoading,
    searchQuery,
    searchResults,
    searchLoading,
    submitting,
    handleSearchChange,
    clearSearch,
    submitTeam,
  };
};
