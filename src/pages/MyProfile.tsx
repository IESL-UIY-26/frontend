import { useCallback, useEffect, useState } from 'react';
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
import type { IMyProfile, IMySessionRegistration, IUpdateMyProfilePayload } from '@/features/Profile/types/profile.types';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const [profile, setProfile] = useState<IMyProfile | null>(null);
  const [myRegistrations, setMyRegistrations] = useState<IMySessionRegistration[]>([]);

  const [form, setForm] = useState<IUpdateMyProfilePayload>({
    full_name: '',
    contact_number: '',
    gender: '',
    address: '',
    date_of_birth: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, registrationsData] = await Promise.all([
        profileAPI.getMyProfile(),
        profileAPI.getMyRegistrations(),
      ]);

      setProfile(profileData);
      setMyRegistrations(registrationsData);

      setForm({
        full_name: profileData.full_name ?? '',
        contact_number: profileData.contact_number ?? '',
        gender: profileData.gender ?? '',
        address: profileData.address ?? '',
        date_of_birth: profileData.date_of_birth ? profileData.date_of_birth.split('T')[0] : '',
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login?returnTo=/my-profile', { replace: true });
      return;
    }
    void loadData();
  }, [authLoading, user, navigate, loadData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: IUpdateMyProfilePayload = {
        full_name: form.full_name?.trim() || undefined,
        contact_number: form.contact_number?.trim() || null,
        gender: form.gender?.trim() || null,
        address: form.address?.trim() || null,
        date_of_birth: form.date_of_birth || null,
      };
      const updated = await profileAPI.updateMyProfile(payload);
      setProfile(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const cancelRegistration = async (sessionId: string) => {
    if (togglingIds.has(sessionId)) return;

    setTogglingIds((prev) => new Set(prev).add(sessionId));
    try {
      await profileAPI.unregisterFromSession(sessionId);
      toast.success('Registration cancelled');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  if (authLoading || loading) {
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
                <Button className="bg-uiy-blue hover:bg-uiy-darkblue" onClick={() => void handleSave()} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
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
