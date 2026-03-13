import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { profileAPI } from '../api/profile.api';
import { ProfileQueryKeys } from '../enums/profile.enums';
import type { IMyProfileForm, IUpdateMyProfilePayload } from '../types/profile.types';

const initialForm: IMyProfileForm = {
  full_name: '',
  contact_number: '',
  gender: '',
  address: '',
  date_of_birth: '',
};

export const useMyProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const queryClient = useQueryClient();

  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<IMyProfileForm>(initialForm);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: [ProfileQueryKeys.MY_PROFILE, user?.id],
    queryFn: () => profileAPI.getMyProfile(),
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: myRegistrations = [],
    isLoading: registrationsLoading,
    error: registrationsError,
  } = useQuery({
    queryKey: [ProfileQueryKeys.MY_REGISTRATIONS, user?.id],
    queryFn: () => profileAPI.getMyRegistrations(),
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: IUpdateMyProfilePayload) => profileAPI.updateMyProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData([ProfileQueryKeys.MY_PROFILE, user?.id], updated);
      toast.success('Profile updated');
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    },
  });

  const cancelRegistrationMutation = useMutation({
    mutationFn: (sessionId: string) => profileAPI.unregisterFromSession(sessionId),
    onSuccess: () => {
      toast.success('Registration cancelled');
      void queryClient.invalidateQueries({ queryKey: [ProfileQueryKeys.MY_REGISTRATIONS, user?.id] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    },
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login?returnTo=/my-profile', { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? '',
      contact_number: profile.contact_number ?? '',
      gender: profile.gender ?? '',
      address: profile.address ?? '',
      date_of_birth: profile.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
    });
  }, [profile]);

  useEffect(() => {
    if (profileError) {
      toast.error(profileError instanceof Error ? profileError.message : 'Failed to load profile');
    }
  }, [profileError]);

  useEffect(() => {
    if (registrationsError) {
      toast.error(registrationsError instanceof Error ? registrationsError.message : 'Failed to load sessions');
    }
  }, [registrationsError]);

  const saveProfile = async () => {
    const payload: IUpdateMyProfilePayload = {
      full_name: form.full_name.trim() || undefined,
      contact_number: form.contact_number.trim() || null,
      gender: form.gender.trim() || null,
      address: form.address.trim() || null,
      date_of_birth: form.date_of_birth || null,
    };

    await updateProfileMutation.mutateAsync(payload);
  };

  const cancelRegistration = async (sessionId: string) => {
    if (togglingIds.has(sessionId)) return;

    setTogglingIds((prev) => new Set(prev).add(sessionId));
    try {
      await cancelRegistrationMutation.mutateAsync(sessionId);
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  const loading = authLoading || profileLoading || registrationsLoading;
  const isSaving = updateProfileMutation.isPending;

  return {
    user,
    profile,
    form,
    setForm,
    myRegistrations,
    togglingIds,
    loading,
    isSaving,
    saveProfile,
    cancelRegistration,
    signOut,
  };
};
