import { Loader2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { IMyProfile, IMyProfileForm } from '../types/profile.types';

interface ProfileDetailsCardProps {
  profile: IMyProfile | null;
  form: IMyProfileForm;
  onFormChange: (next: IMyProfileForm) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const ProfileDetailsCard = ({ profile, form, onFormChange, onSave, isSaving }: ProfileDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="w-5 h-5 text-uiy-blue" /> Profile Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={form.full_name} onChange={(e) => onFormChange({ ...form, full_name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={profile?.email ?? ''} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Contact Number</Label>
            <Input value={form.contact_number} onChange={(e) => onFormChange({ ...form, contact_number: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Date of Birth</Label>
            <Input type="date" value={form.date_of_birth} onChange={(e) => onFormChange({ ...form, date_of_birth: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Input value={form.gender} onChange={(e) => onFormChange({ ...form, gender: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => onFormChange({ ...form, address: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-uiy-blue hover:bg-uiy-darkblue" onClick={onSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
