import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SessionsTab } from '@/features/Admin/components/SessionsTab';
import { UniversitiesTab } from '@/features/Admin/components/UniversitiesTab';
import Navbar from '@/components/Navbar';


const AdminDashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
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
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
