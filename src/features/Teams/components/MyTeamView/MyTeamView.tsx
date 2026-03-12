import React from 'react';
import { Link } from 'react-router-dom';
import { useTeamStatus } from '../../context/TeamStatusContext';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  GraduationCap,
  Mail,
  Phone,
  User,
  Crown,
  Loader2,
  AlertCircle,
} from 'lucide-react';

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-uiy-blue flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export function MyTeamView() {
  const { myTeam, teamLoading } = useTeamStatus();
  const { user, loading: authLoading } = useAuth();

  if (authLoading || teamLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-uiy-blue" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-700">You need to sign in</h2>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (!myTeam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <Users className="w-12 h-12 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-700">You haven't joined a team yet</h2>
        <p className="text-gray-500 max-w-sm">Create your team to participate in UIY 2026.</p>
        <Link to="/create-team" className="btn-primary inline-flex items-center gap-2">
          Create Team
        </Link>
      </div>
    );
  }

  const leader = myTeam.members.find((m) => m.role === 'LEADER');
  const regularMembers = myTeam.members.filter((m) => m.role === 'MEMBER');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-uiy-blue/10 mb-4">
            <Users className="w-8 h-8 text-uiy-blue" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">{myTeam.team_name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">{myTeam.university.name}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Registered {new Date(myTeam.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Team Leader */}
        {leader && (
          <Card className="shadow-sm border-uiy-blue/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                Team Leader
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-uiy-blue flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {leader.user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 grid sm:grid-cols-2 gap-2">
                  <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={leader.user.full_name} />
                  <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={leader.user.email} />
                  {leader.department && (
                    <InfoRow icon={<GraduationCap className="w-4 h-4" />} label="Department" value={leader.department} />
                  )}
                  {leader.iesl_id && (
                    <InfoRow icon={<User className="w-4 h-4" />} label="IESL ID" value={String(leader.iesl_id)} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Members */}
        {regularMembers.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-uiy-blue" />
                Team Members
                <Badge variant="secondary" className="ml-auto text-xs">{regularMembers.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {regularMembers.map((member, idx) => (
                <React.Fragment key={member.id}>
                  {idx > 0 && <Separator />}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                      {member.user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 grid sm:grid-cols-2 gap-2">
                      <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={member.user.full_name} />
                      <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={member.user.email} />
                      {member.department && (
                        <InfoRow icon={<GraduationCap className="w-4 h-4" />} label="Department" value={member.department} />
                      )}
                      {member.iesl_id && (
                        <InfoRow icon={<User className="w-4 h-4" />} label="IESL ID" value={String(member.iesl_id)} />
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Supervisor */}
        {myTeam.supervisor && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-uiy-blue" />
                Supervisor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={myTeam.supervisor.supervisor_name} />
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={myTeam.supervisor.supervisor_email} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Contact" value={myTeam.supervisor.supervisor_contact_number} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Co-Supervisor */}
        {myTeam.coSupervisor && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                Co-Supervisor
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={myTeam.coSupervisor.supervisor_name} />
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={myTeam.coSupervisor.supervisor_email} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Contact" value={myTeam.coSupervisor.supervisor_contact_number} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
