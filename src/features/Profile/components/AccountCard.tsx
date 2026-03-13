import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountCardProps {
  onSignOut: () => void;
}

export const AccountCard = ({ onSignOut }: AccountCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={onSignOut} className="inline-flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </CardContent>
    </Card>
  );
};
