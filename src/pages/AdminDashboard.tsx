import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { SessionsTab } from '@/features/Admin/components/SessionsTab';
import { UniversitiesTab } from '@/features/Admin/components/UniversitiesTab';


const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-uiy-darkblue text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src="/images/logo-light.png" alt="UIY 2026" className="h-10 w-auto" />
          <span className="text-lg font-bold">Admin Dashboard</span>
        </div>
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => void signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="sessions">
          <TabsList className="mb-6">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="universities">Universities</TabsTrigger>
          </TabsList>
          <TabsContent value="sessions">
            <SessionsTab />
          </TabsContent>
          <TabsContent value="universities">
            <UniversitiesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
