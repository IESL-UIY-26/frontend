import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { SessionCard } from '@/features/Sessions/components/SessionCard';
import { useSessions } from '@/features/Sessions/hooks/use-sessions';

const Sessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sessions, loading, error, registeredIds, togglingIds, toggleRegistration } = useSessions();

  const handleNotLoggedIn = () => {
    toast.info('You must be logged in to register for a session.');
    void navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900">Available Sessions</h1>
            <p className="text-gray-500 mt-2">Browse all upcoming public sessions</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-uiy-blue" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8 text-center text-red-600">{error}</CardContent>
            </Card>
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">No available sessions right now.</CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isLoggedIn={!!user}
                  registered={registeredIds.has(session.id)}
                  toggling={togglingIds.has(session.id)}
                  onToggle={
                    user
                      ? () => toggleRegistration(session.id, registeredIds.has(session.id))
                      : handleNotLoggedIn
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sessions;
