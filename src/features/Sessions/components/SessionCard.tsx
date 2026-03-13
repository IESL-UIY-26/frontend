import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, CheckCircle2, Clock3, ExternalLink, Loader2, User2 } from 'lucide-react';
import type { IAvailableSession } from '../types/sessions.types';

interface SessionCardProps {
  session: IAvailableSession;
  isLoggedIn: boolean;
  registered?: boolean;
  toggling?: boolean;
  onToggle?: () => void;
}

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatTime = (isoTime: string) =>
  new Date(isoTime).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const SessionCard = ({ session, isLoggedIn, registered = false, toggling = false, onToggle }: SessionCardProps) => {
  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg">{session.title}</CardTitle>
          <Badge variant="secondary">{session.duration_minutes} min</Badge>
        </div>
        {session.description && <p className="text-sm text-gray-700">{session.description}</p>}
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div className="grid gap-2 text-sm text-gray-600">
          <p className="inline-flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-uiy-blue" />
            {formatDate(session.session_date)}
          </p>
          <p className="inline-flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-uiy-blue" />
            {formatTime(session.session_time)}
          </p>
          {session.host_name && (
            <p className="inline-flex items-center gap-2">
              <User2 className="w-4 h-4 text-uiy-blue" />
              {session.host_name}
            </p>
          )}
        </div>

        {/* Zoom link is only visible to registered participants */}
        {isLoggedIn && registered && session.zoom_link && (
          <a
            href={session.zoom_link}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-uiy-blue inline-flex items-center gap-1 hover:underline"
          >
            Join Session <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          size="sm"
          variant={isLoggedIn && registered ? 'outline' : 'default'}
          className={isLoggedIn && registered ? 'w-full' : 'w-full bg-uiy-blue hover:bg-uiy-darkblue'}
          disabled={toggling}
          onClick={onToggle}
        >
          {toggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isLoggedIn && registered ? (
            <><CheckCircle2 className="w-4 h-4 mr-1.5 text-green-600" />Registered &mdash; Cancel</>
          ) : (
            'Register'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
