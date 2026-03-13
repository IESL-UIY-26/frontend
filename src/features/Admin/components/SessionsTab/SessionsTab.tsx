import React, { useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSessions } from '../../hooks/use-sessions';
import type { ISession } from '../../types/sessions.types';
import { fmtDate, fmtTime } from '../../utils/session-utils';

type SessionForm = {
  title: string;
  description: string;
  zoom_link: string;
  session_date: string;
  session_time: string;
  duration_minutes: string;
  host_name: string;
};

const emptyForm: SessionForm = {
  title: '',
  description: '',
  zoom_link: '',
  session_date: '',
  session_time: '',
  duration_minutes: '60',
  host_name: '',
};

export function SessionsTab() {
  const { sessions, loading, createSession, updateSession, deleteSession } = useSessions();
  const minSessionDate = new Date().toISOString().split('T')[0];
  const [dialog, setDialog] = useState<{ open: boolean; editing: ISession | null }>({
    open: false,
    editing: null,
  });
  const [form, setForm] = useState<SessionForm>(emptyForm);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openAdd = () => {
    setForm(emptyForm);
    setDialog({ open: true, editing: null });
  };

  const openEdit = (s: ISession) => {
    setForm({
      title: s.title,
      description: s.description ?? '',
      zoom_link: s.zoom_link ?? '',
      session_date: s.session_date.split('T')[0]!,
      session_time: fmtTime(s.session_time),
      duration_minutes: String(s.duration_minutes),
      host_name: s.host_name ?? '',
    });
    setDialog({ open: true, editing: s });
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      description: form.description || undefined,
      zoom_link: form.zoom_link || undefined,
      session_date: form.session_date,
      session_time: form.session_time,
      duration_minutes: parseInt(form.duration_minutes, 10),
      host_name: form.host_name || undefined,
    };
    try {
      if (dialog.editing) {
        await updateSession(dialog.editing.id, payload);
      } else {
        await createSession(payload);
      }
      setDialog({ open: false, editing: null });
    } catch {
      // error already toasted by the hook
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteSession(deleting);
    setDeleting(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-uiy-dark">Sessions</h2>
        <Button onClick={openAdd} className="bg-uiy-blue hover:bg-uiy-darkblue">
          <Plus className="h-4 w-4 mr-1" /> Add Session
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-uiy-blue" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No sessions yet.</p>
      ) : (
        <div className="rounded-md border bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Zoom</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell>{fmtDate(s.session_date)}</TableCell>
                  <TableCell>{fmtTime(s.session_time)}</TableCell>
                  <TableCell>{s.duration_minutes} min</TableCell>
                  <TableCell>{s.host_name ?? '—'}</TableCell>
                  <TableCell>
                    {s.zoom_link ? (
                      <a
                        href={s.zoom_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-uiy-blue hover:underline flex items-center gap-1 text-sm"
                      >
                        <ExternalLink className="h-3 w-3" /> Link
                      </a>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(s)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleting(s.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => setDialog((p) => ({ ...p, open: o }))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialog.editing ? 'Edit Session' : 'Add Session'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Session title"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief description…"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  min={dialog.editing ? undefined : minSessionDate}
                  value={form.session_date}
                  onChange={(e) => setForm((p) => ({ ...p, session_date: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={form.session_time}
                  onChange={(e) => setForm((p) => ({ ...p, session_time: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Duration (min) *</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.duration_minutes}
                  onChange={(e) => setForm((p) => ({ ...p, duration_minutes: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Host Name</Label>
                <Input
                  value={form.host_name}
                  onChange={(e) => setForm((p) => ({ ...p, host_name: e.target.value }))}
                  placeholder="Speaker / Host"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Zoom Link</Label>
              <Input
                value={form.zoom_link}
                onChange={(e) => setForm((p) => ({ ...p, zoom_link: e.target.value }))}
                placeholder="https://zoom.us/j/…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ open: false, editing: null })}>
              Cancel
            </Button>
            <Button className="bg-uiy-blue hover:bg-uiy-darkblue" onClick={() => void handleSave()}>
              {dialog.editing ? 'Save Changes' : 'Create Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => void handleDelete()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
