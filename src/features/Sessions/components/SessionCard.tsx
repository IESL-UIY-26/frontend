import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CheckCircle2, ExternalLink, Loader2, MapPin } from 'lucide-react';
import type { IAvailableSession } from '../types/sessions.types';

interface SessionCardProps {
  session: IAvailableSession;
  isLoggedIn: boolean;
  registered?: boolean;
  toggling?: boolean;
  onToggle?: () => void;
  canGiveFeedback?: boolean;
  onFeedbackClick?: () => void;
}

const formatDate = (isoDate: string) => {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate; // return raw if not a valid Date
    const day = date.getDate();
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    return `${day}${suffix} ${month}`;
  } catch (e) {
    return isoDate;
  }
};

const formatTime = (isoTime: string) => {
  try {
    if (!isoTime) return '';
    // If it's already a formatted string like "7:00 P.M.", return it
    if (!isoTime.includes('T')) return isoTime;
    return new Date(isoTime).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return isoTime;
  }
};

export const SessionCard = ({
  session,
  isLoggedIn,
  registered = false,
  toggling = false,
  onToggle,
  canGiveFeedback = false,
  onFeedbackClick,
}: SessionCardProps) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white h-full flex flex-col">
      {/* Flyer Image Section */}
      <div className="w-full bg-slate-900 flex justify-center h-48 sm:h-56">
        <img
          src={session.image_url || "/images/flyer.jpeg"}
          alt={session.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-center mb-4">
          {session.host_name && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-uiy-blue mb-1">
              {session.host_name}
            </p>
          )}
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            {session.title}
          </h1>
          {session.description && (
            <p className="mt-1.5 text-xs text-gray-600">
              {session.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col space-y-4">
          <div className="flex flex-col items-center gap-1.5 text-xs text-gray-700 w-full">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-uiy-blue shrink-0" />
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                {formatDate(session.session_date)}
              </span>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                {formatTime(session.session_time)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-uiy-blue shrink-0" />
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                {session.location ? session.location : (session.zoom_link && session.zoom_link !== 'null' ? 'Via Zoom' : 'Physical')}
              </span>
            </div>
          </div>

          <div className="text-center flex flex-col items-center gap-2">
            <Button
              size="sm"
              variant={isLoggedIn && registered ? 'outline' : 'default'}
              className={isLoggedIn && registered ? 'w-full max-w-[200px] h-8 text-xs rounded-full' : 'inline-flex items-center justify-center gap-2 rounded-full bg-uiy-blue px-4 py-1.5 h-8 text-xs font-semibold text-white shadow-md transition hover:bg-uiy-darkblue'}
              disabled={toggling || session.is_past}
              onClick={onToggle}
            >
              {toggling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : session.is_past ? (
                <>Event Ended</>
              ) : isLoggedIn && registered ? (
                <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600" />Registered &mdash; Cancel</>
              ) : (
                <>Register now <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </Button>

            {canGiveFeedback && (
              <Button size="sm" variant="secondary" className="w-full max-w-[200px] h-8 text-xs rounded-full" onClick={onFeedbackClick}>
                Feedback
              </Button>
            )}
            
            {isLoggedIn && registered && session.zoom_link && session.zoom_link !== 'null' && (
              <a
                href={session.zoom_link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-uiy-blue inline-flex items-center gap-1 hover:underline mt-1"
              >
                Join Session Link <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

