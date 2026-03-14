import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { sessionsAPI } from '@/features/Sessions/api/sessions.api';
import { SessionCard } from '@/features/Sessions/components/SessionCard';
import { useSessions } from '@/features/Sessions/hooks/use-sessions';
import { useState } from 'react';
import { usePageQueryParam } from '@/hooks/use-page-query-param';
import { useClampPage } from '@/hooks/use-clamp-page';

const Sessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, setPage } = usePageQueryParam(searchParams, setSearchParams);
  const { sessions, totalPages, hasPreviousPage, hasNextPage, loading, error, registeredIds, togglingIds, toggleRegistration } =
    useSessions(page);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    sessionId: string | null;
    title: string;
    rating: string;
    comment: string;
    hasExisting: boolean;
    checkingExisting: boolean;
    submitting: boolean;
    deleting: boolean;
  }>({
    open: false,
    sessionId: null,
    title: '',
    rating: '5',
    comment: '',
    hasExisting: false,
    checkingExisting: false,
    submitting: false,
    deleting: false,
  });

  const handleNotLoggedIn = (sessionId: string) => {
    toast.info('You must be logged in to register for a session.');
    const params = new URLSearchParams({
      returnTo: '/sessions',
      registerSessionId: sessionId,
    });
    void navigate(`/login?${params.toString()}`);
  };

  const openFeedbackDialog = async (sessionId: string, title: string) => {
    setFeedbackDialog((prev) => ({
      ...prev,
      open: true,
      sessionId,
      title,
      rating: '5',
      comment: '',
      hasExisting: false,
      checkingExisting: true,
      submitting: false,
      deleting: false,
    }));

    try {
      const existing = await sessionsAPI.getMyFeedback(sessionId);
      setFeedbackDialog((prev) => ({
        ...prev,
        rating: existing ? String(existing.rating) : '5',
        comment: existing?.comment ?? '',
        hasExisting: !!existing,
      }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load feedback');
    } finally {
      setFeedbackDialog((prev) => ({ ...prev, checkingExisting: false }));
    }
  };

  const submitFeedback = async () => {
    if (!feedbackDialog.sessionId) return;
    setFeedbackDialog((prev) => ({ ...prev, submitting: true }));
    try {
      const rating = Number(feedbackDialog.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        toast.error('Rating must be between 1 and 5');
        return;
      }

      const payload = {
        rating,
        comment: feedbackDialog.comment.trim() || undefined,
      };

      if (feedbackDialog.hasExisting) {
        await sessionsAPI.updateFeedback(feedbackDialog.sessionId, payload);
        toast.success('Feedback updated');
      } else {
        await sessionsAPI.createFeedback(feedbackDialog.sessionId, payload);
        toast.success('Feedback submitted');
      }

      setFeedbackDialog((prev) => ({ ...prev, open: false }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setFeedbackDialog((prev) => ({ ...prev, submitting: false }));
    }
  };

  const deleteFeedback = async () => {
    if (!feedbackDialog.sessionId || !feedbackDialog.hasExisting) return;
    setFeedbackDialog((prev) => ({ ...prev, deleting: true }));
    try {
      await sessionsAPI.deleteFeedback(feedbackDialog.sessionId);
      toast.success('Feedback deleted');
      setFeedbackDialog((prev) => ({ ...prev, open: false }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete feedback');
    } finally {
      setFeedbackDialog((prev) => ({ ...prev, deleting: false }));
    }
  };

  useEffect(() => {
    if (!user) return;
    if (loading) return;

    const pendingSessionId = searchParams.get('registerSessionId');
    if (!pendingSessionId) return;

    const clearIntent = () => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('registerSessionId');
      nextParams.delete('returnTo');
      setSearchParams(nextParams, { replace: true });
    };

    if (registeredIds.has(pendingSessionId)) {
      clearIntent();
      return;
    }

    void (async () => {
      await toggleRegistration(pendingSessionId, false);
      clearIntent();
    })();
  }, [user, loading, searchParams, setSearchParams, registeredIds, toggleRegistration]);
  useClampPage(page, totalPages, setPage, !loading && !error);

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
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isLoggedIn={!!user}
                    registered={registeredIds.has(session.id)}
                    toggling={togglingIds.has(session.id)}
                    canGiveFeedback={!!user && registeredIds.has(session.id)}
                    onFeedbackClick={() => void openFeedbackDialog(session.id, session.title)}
                    onToggle={
                      user
                        ? () => toggleRegistration(session.id, registeredIds.has(session.id))
                        : () => handleNotLoggedIn(session.id)
                    }
                  />
                ))}
              </div>

              {totalPages > 0 && (
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Button variant="outline" onClick={() => setPage(page - 1)} disabled={!hasPreviousPage}>
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog
        open={feedbackDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setFeedbackDialog((prev) => ({
              ...prev,
              open: false,
              sessionId: null,
              title: '',
              rating: '5',
              comment: '',
              hasExisting: false,
              checkingExisting: false,
              submitting: false,
              deleting: false,
            }));
            return;
          }
          setFeedbackDialog((prev) => ({ ...prev, open }));
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{feedbackDialog.hasExisting ? 'Edit Feedback' : 'Give Feedback'}</DialogTitle>
          </DialogHeader>

          {feedbackDialog.checkingExisting ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-uiy-blue" />
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{feedbackDialog.title}</p>
                <div className="space-y-1.5">
                  <Label>Rating (1-5)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={feedbackDialog.rating}
                    onChange={(e) => setFeedbackDialog((prev) => ({ ...prev, rating: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Comment</Label>
                  <Textarea
                    rows={4}
                    value={feedbackDialog.comment}
                    onChange={(e) => setFeedbackDialog((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your feedback"
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                {feedbackDialog.hasExisting && (
                  <Button variant="destructive" onClick={() => void deleteFeedback()} disabled={feedbackDialog.deleting}>
                    {feedbackDialog.deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Delete
                  </Button>
                )}
                <Button variant="outline" onClick={() => setFeedbackDialog((prev) => ({ ...prev, open: false }))}>Cancel</Button>
                <Button className="bg-uiy-blue hover:bg-uiy-darkblue" onClick={() => void submitFeedback()} disabled={feedbackDialog.submitting}>
                  {feedbackDialog.submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {feedbackDialog.hasExisting ? 'Update' : 'Submit'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sessions;
