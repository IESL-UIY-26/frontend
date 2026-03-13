import { CalendarDays, Clock3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IMySessionRegistration } from '../types/profile.types';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

interface RegisteredSessionsCardProps {
  registrations: IMySessionRegistration[];
  togglingIds: Set<string>;
  onCancelRegistration: (sessionId: string) => void;
}

export const RegisteredSessionsCard = ({ registrations, togglingIds, onCancelRegistration }: RegisteredSessionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Registered Sessions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {registrations.length === 0 ? (
          <p className="text-sm text-gray-500">You have not registered for any sessions yet.</p>
        ) : (
          registrations.map((reg) => (
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
                onClick={() => onCancelRegistration(reg.session_id)}
              >
                {togglingIds.has(reg.session_id) ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel Registration'}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
