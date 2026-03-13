import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, UserRound, CalendarDays, Clock3, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { profileAPI } from '@/features/Profile/api/profile.api';
import type { IUpdateMyProfilePayload } from '@/features/Profile/types/profile.types';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const queryClient = useQueryClient();

  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const [form, setForm] = useState<IUpdateMyProfilePayload>({
    full_name: '',
    contact_number: '',
    gender: '',
    address: '',
    date_of_birth: '',
  });

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['my-profile', user?.id],
    queryFn: () => profileAPI.getMyProfile(),
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: myRegistrations = [],
    isLoading: registrationsLoading,
    error: registrationsError,
  } = useQuery({
    queryKey: ['my-registrations', user?.id],
    queryFn: () => profileAPI.getMyRegistrations(),
    enabled: !!user && !authLoading,
    staleTime: 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: IUpdateMyProfilePayload) => profileAPI.updateMyProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['my-profile', user?.id], updated);
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
      void queryClient.invalidateQueries({ queryKey: ['my-registrations', user?.id] });
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

  const handleSave = async () => {
    const payload: IUpdateMyProfilePayload = {
      full_name: form.full_name?.trim() || undefined,
      contact_number: form.contact_number?.trim() || null,
      gender: form.gender?.trim() || null,
      address: form.address?.trim() || null,
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

  if (authLoading || profileLoading || registrationsLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-28 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-uiy-blue" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-2">View and update profile details, manage session registrations</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserRound className="w-5 h-5 text-uiy-blue" /> Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input value={form.full_name ?? ''} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={profile?.email ?? ''} disabled />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Number</Label>
                  <Input value={form.contact_number ?? ''} onChange={(e) => setForm((p) => ({ ...p, contact_number: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Date of Birth</Label>
                  <Input type="date" value={form.date_of_birth ?? ''} onChange={(e) => setForm((p) => ({ ...p, date_of_birth: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Input value={form.gender ?? ''} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Address</Label>
                  <Input value={form.address ?? ''} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-uiy-blue hover:bg-uiy-darkblue" onClick={() => void handleSave()} disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Registered Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myRegistrations.length === 0 ? (
                <p className="text-sm text-gray-500">You have not registered for any sessions yet.</p>
              ) : (
                myRegistrations.map((reg) => (
                  <div key={reg.id} className="rounded-md border p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{reg.session.title}</p>
                      <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-uiy-blue" /> {formatDate(reg.session.session_date)}
                        <Clock3 className="w-4 h-4 text-uiy-blue ml-2" /> {formatTime(reg.session.session_time)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      disabled={togglingIds.has(reg.session_id)}
                      onClick={() => void cancelRegistration(reg.session_id)}
                    >
                      {togglingIds.has(reg.session_id) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel Registration'}
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => void signOut()}
                className="inline-flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
