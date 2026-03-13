import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { AccountCard } from '@/features/Profile/components/AccountCard';
import { ProfileDetailsCard } from '@/features/Profile/components/ProfileDetailsCard';
import { RegisteredSessionsCard } from '@/features/Profile/components/RegisteredSessionsCard';
import { useMyProfile } from '@/features/Profile/hooks/use-my-profile';

const MyProfile = () => {
  const {
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
  } = useMyProfile();

  if (loading) {
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

          <ProfileDetailsCard
            profile={profile}
            form={form}
            onFormChange={setForm}
            onSave={() => void saveProfile()}
            isSaving={isSaving}
          />

          <RegisteredSessionsCard
            registrations={myRegistrations}
            togglingIds={togglingIds}
            onCancelRegistration={(sessionId) => void cancelRegistration(sessionId)}
          />

          <AccountCard onSignOut={() => void signOut()} />
        </div>
      </div>
    </>
  );
};

export default MyProfile;
