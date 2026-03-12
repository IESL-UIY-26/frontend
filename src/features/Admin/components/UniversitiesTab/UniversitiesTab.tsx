import React, { useState } from 'react';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useUniversities } from '../../hooks/use-universities';
import type { IUniversity } from '../../types/universities.types';

export function UniversitiesTab() {
  const { universities, loading, createUniversity, updateUniversity, deleteUniversity } = useUniversities();
  const [dialog, setDialog] = useState<{ open: boolean; editing: IUniversity | null }>({
    open: false,
    editing: null,
  });
  const [name, setName] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const openAdd = () => {
    setName('');
    setDialog({ open: true, editing: null });
  };

  const openEdit = (u: IUniversity) => {
    setName(u.name);
    setDialog({ open: true, editing: u });
  };

  const handleSave = async () => {
    try {
      if (dialog.editing) {
        await updateUniversity(dialog.editing.id, { name });
      } else {
        await createUniversity({ name });
      }
      setDialog({ open: false, editing: null });
    } catch {
      // error already toasted by the hook
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteUniversity(deleting);
    setDeleting(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-uiy-dark">Universities</h2>
        <Button onClick={openAdd} className="bg-uiy-blue hover:bg-uiy-darkblue">
          <Plus className="h-4 w-4 mr-1" /> Add University
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-uiy-blue" />
        </div>
      ) : universities.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No universities yet.</p>
      ) : (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleting(u.id)}
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{dialog.editing ? 'Edit University' : 'Add University'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="University name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ open: false, editing: null })}>
              Cancel
            </Button>
            <Button className="bg-uiy-blue hover:bg-uiy-darkblue" onClick={() => void handleSave()}>
              {dialog.editing ? 'Save Changes' : 'Add University'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete University?</AlertDialogTitle>
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
