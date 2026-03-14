import React from 'react';
import { Link } from 'react-router-dom';
import { useTeamStatus } from '../../context/TeamStatusContext';
import { teamsAPI } from '../../api/teams.api';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { projectsAPI } from '@/features/Projects/api/projects.api';
import type { IUniversity } from '@/features/Admin/types/universities.types';
import type { IProject } from '@/features/Projects/types/projects.types';
import api from '@/utils/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  GraduationCap,
  Mail,
  Phone,
  User,
  Crown,
  Loader2,
  AlertCircle,
  FolderOpen,
  Pencil,
  Plus,
  ExternalLink,
  ImageOff,
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

type MemberDraft = {
  iesl_id: string;
  department: string;
  university_id_image: string;
};

export function MyTeamView() {
  const { myTeam, teamLoading, refreshMyTeam } = useTeamStatus();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [universities, setUniversities] = React.useState<IUniversity[]>([]);
  const [universitiesLoading, setUniversitiesLoading] = React.useState(false);

  const [projects, setProjects] = React.useState<IProject[]>([]);
  const [projectsLoading, setProjectsLoading] = React.useState(false);
  const [projectsError, setProjectsError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [savingTeam, setSavingTeam] = React.useState(false);
  const [teamNameDraft, setTeamNameDraft] = React.useState('');
  const [universityIdDraft, setUniversityIdDraft] = React.useState('');
  const [supervisorDraft, setSupervisorDraft] = React.useState({
    supervisor_name: '',
    supervisor_email: '',
    supervisor_contact_number: '',
  });
  const [hasCoSupervisorDraft, setHasCoSupervisorDraft] = React.useState(false);
  const [coSupervisorDraft, setCoSupervisorDraft] = React.useState({
    supervisor_name: '',
    supervisor_email: '',
    supervisor_contact_number: '',
  });
  const [memberDrafts, setMemberDrafts] = React.useState<Record<string, MemberDraft>>({});
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);
  const [projectImageUploading, setProjectImageUploading] = React.useState(false);
  const [projectImageFileId, setProjectImageFileId] = React.useState<string | undefined>(undefined);
  const [projectForm, setProjectForm] = React.useState({
    title: '',
    description: '',
    image_url: '',
    youtube_link: '',
    pdf: '',
    github_url: '',
  });

  const isLeader = !!(
    user &&
    myTeam?.members.some((m) => m.user_id === user.id && m.role === 'LEADER')
  );

  const hasProject = projects.length > 0;

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      image_url: '',
      youtube_link: '',
      pdf: '',
      github_url: '',
    });
    setProjectImageFileId(undefined);
    setEditingProjectId(null);
  };

  const loadProjects = React.useCallback(async () => {
    if (!myTeam?.id || !user) return;

    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const data = await projectsAPI.getTeamProjects(myTeam.id);
      setProjects(data);
    } catch (err) {
      setProjectsError(err instanceof Error ? err.message : 'Failed to load team projects');
    } finally {
      setProjectsLoading(false);
    }
  }, [myTeam?.id, user]);

  React.useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  React.useEffect(() => {
    setTeamNameDraft(myTeam?.team_name ?? '');
    setUniversityIdDraft(myTeam?.university_id ?? '');
    setSupervisorDraft({
      supervisor_name: myTeam?.supervisor?.supervisor_name ?? '',
      supervisor_email: myTeam?.supervisor?.supervisor_email ?? '',
      supervisor_contact_number: myTeam?.supervisor?.supervisor_contact_number ?? '',
    });
    setHasCoSupervisorDraft(!!myTeam?.coSupervisor);
    setCoSupervisorDraft({
      supervisor_name: myTeam?.coSupervisor?.supervisor_name ?? '',
      supervisor_email: myTeam?.coSupervisor?.supervisor_email ?? '',
      supervisor_contact_number: myTeam?.coSupervisor?.supervisor_contact_number ?? '',
    });

    const mappedDrafts: Record<string, MemberDraft> = {};
    myTeam?.members.forEach((member) => {
      mappedDrafts[member.id] = {
        iesl_id: member.iesl_id ? String(member.iesl_id) : '',
        department: member.department ?? '',
        university_id_image: member.university_id_image ?? '',
      };
    });
    setMemberDrafts(mappedDrafts);
  }, [myTeam]);

  React.useEffect(() => {
    setUniversitiesLoading(true);
    api
      .get<IUniversity[]>('/api/universities')
      .then((res) => setUniversities(res.data))
      .catch(() => {
        toast({
          title: 'Failed to load universities',
          description: 'Please try again later.',
        });
      })
      .finally(() => setUniversitiesLoading(false));
  }, [toast]);

  const updateMemberDraft = (memberId: string, field: keyof MemberDraft, value: string) => {
    setMemberDrafts((prev) => ({
      ...prev,
      [memberId]: {
        iesl_id: prev[memberId]?.iesl_id ?? '',
        department: prev[memberId]?.department ?? '',
        university_id_image: prev[memberId]?.university_id_image ?? '',
        [field]: value,
      },
    }));
  };

  const saveTeamDetails = async () => {
    if (!isLeader || !myTeam) return;

    if (!teamNameDraft.trim()) {
      toast({ title: 'Team name is required' });
      return;
    }

    if (!universityIdDraft) {
      toast({ title: 'Please select a university' });
      return;
    }

    if (
      !supervisorDraft.supervisor_name.trim() ||
      !supervisorDraft.supervisor_email.trim() ||
      !supervisorDraft.supervisor_contact_number.trim()
    ) {
      toast({ title: 'Supervisor name, email and contact are required' });
      return;
    }

    if (
      hasCoSupervisorDraft &&
      (!coSupervisorDraft.supervisor_name.trim() ||
        !coSupervisorDraft.supervisor_email.trim() ||
        !coSupervisorDraft.supervisor_contact_number.trim())
    ) {
      toast({ title: 'Co-supervisor name, email and contact are required' });
      return;
    }

    for (const member of myTeam.members) {
      const draft = memberDrafts[member.id];
      if (!draft?.iesl_id.trim() || !draft.department.trim() || !draft.university_id_image.trim()) {
        toast({ title: `All member fields are required for ${member.user.full_name}` });
        return;
      }
      const parsed = Number(draft.iesl_id);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        toast({ title: `IESL ID must be a positive integer for ${member.user.full_name}` });
        return;
      }
    }

    setSavingTeam(true);
    try {
      await teamsAPI.updateMyTeam({
        team_name: teamNameDraft.trim(),
        university_id: universityIdDraft,
        supervisor: {
          supervisor_name: supervisorDraft.supervisor_name.trim(),
          supervisor_email: supervisorDraft.supervisor_email.trim(),
          supervisor_contact_number: supervisorDraft.supervisor_contact_number.trim(),
          supervisor_university_id: universityIdDraft,
        },
        co_supervisor: hasCoSupervisorDraft
          ? {
              supervisor_name: coSupervisorDraft.supervisor_name.trim(),
              supervisor_email: coSupervisorDraft.supervisor_email.trim(),
              supervisor_contact_number: coSupervisorDraft.supervisor_contact_number.trim(),
              supervisor_university_id: universityIdDraft,
            }
          : null,
        members: myTeam.members.map((member) => {
          const draft = memberDrafts[member.id];
          return {
            user_id: member.user_id,
            role: member.role,
            iesl_id: Number(draft.iesl_id),
            department: draft.department.trim(),
            university_id_image: draft.university_id_image.trim(),
          };
        }),
      });
      await refreshMyTeam();
      toast({ title: 'Team details updated successfully' });
    } catch (err) {
      toast({
        title: 'Failed to update team details',
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setSavingTeam(false);
    }
  };

  const toPayload = () => {
    const payload = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim() || undefined,
      image_url: projectForm.image_url.trim() || undefined,
      youtube_link: projectForm.youtube_link.trim() || undefined,
      pdf: projectForm.pdf.trim() || undefined,
      github_url: projectForm.github_url.trim() || undefined,
    };
    return payload;
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myTeam?.id || !isLeader) return;

    const payload = toPayload();
    if (!payload.title) {
      toast({
        title: 'Project title is required',
      });
      return;
    }

    if (!editingProjectId && hasProject) {
      toast({
        title: 'A team can only have one project',
        description: 'Edit the existing project instead of creating a new one.',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingProjectId) {
        await projectsAPI.updateProject(editingProjectId, payload);
        toast({ title: 'Project updated successfully' });
      } else {
        await projectsAPI.createProject(myTeam.id, payload);
        toast({ title: 'Project created successfully' });
      }
      resetProjectForm();
      await loadProjects();
    } catch (err) {
      toast({
        title: 'Project request failed',
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (project: IProject) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title ?? '',
      description: project.description ?? '',
      image_url: project.image_url ?? '',
      youtube_link: project.youtube_link ?? '',
      pdf: project.pdf ?? '',
      github_url: project.github_url ?? '',
    });
    setProjectImageFileId(undefined);
  };

  const showInitialLoading = (authLoading && !user) || (teamLoading && !myTeam);

  if (showInitialLoading) {
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
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 ">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-uiy-blue/10 mb-4">
              <Users className="w-8 h-8 text-uiy-blue" />
            </div>
            {isLeader ? (
              <div className="space-y-3 max-w-xl">
                <p className="text-xs font-medium text-gray-600">Team Name</p>
                <Input
                  value={teamNameDraft}
                  onChange={(e) => setTeamNameDraft(e.target.value)}
                  placeholder="Team name (e.g. Innovators 2026)"
                  disabled={savingTeam}
                />
                <p className="text-xs font-medium text-gray-600">University</p>
                <select
                  value={universityIdDraft}
                  onChange={(e) => setUniversityIdDraft(e.target.value)}
                  disabled={savingTeam || universitiesLoading}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select university</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <h1 className="text-3xl font-display font-bold text-gray-900">{myTeam.team_name}</h1>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">{myTeam.university.name}</span>
                </div>
              </>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Registered {new Date(myTeam.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

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
                  {isLeader ? (
                    <div className="flex-1 grid sm:grid-cols-2 gap-3">
                      <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={leader.user.full_name} />
                      <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={leader.user.email} />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">IESL Member ID</p>
                        <Input
                          type="number"
                          value={memberDrafts[leader.id]?.iesl_id ?? ''}
                          onChange={(e) => updateMemberDraft(leader.id, 'iesl_id', e.target.value)}
                          placeholder="Leader IESL Member ID (e.g. 12345)"
                          disabled={savingTeam}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">Department</p>
                        <Input
                          value={memberDrafts[leader.id]?.department ?? ''}
                          onChange={(e) => updateMemberDraft(leader.id, 'department', e.target.value)}
                          placeholder="Leader department (e.g. Electrical Engineering)"
                          disabled={savingTeam}
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <p className="text-xs font-medium text-gray-600">University ID Image URL</p>
                        <Input
                          value={memberDrafts[leader.id]?.university_id_image ?? ''}
                          onChange={(e) =>
                            updateMemberDraft(leader.id, 'university_id_image', e.target.value)
                          }
                          placeholder="Leader university ID image URL (https://...)"
                          disabled={savingTeam}
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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
                      {isLeader ? (
                        <div className="flex-1 grid sm:grid-cols-2 gap-3">
                          <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={member.user.full_name} />
                          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={member.user.email} />
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">IESL Member ID</p>
                            <Input
                              type="number"
                              value={memberDrafts[member.id]?.iesl_id ?? ''}
                              onChange={(e) => updateMemberDraft(member.id, 'iesl_id', e.target.value)}
                              placeholder="Member IESL Member ID (e.g. 67890)"
                              disabled={savingTeam}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Department</p>
                            <Input
                              value={memberDrafts[member.id]?.department ?? ''}
                              onChange={(e) => updateMemberDraft(member.id, 'department', e.target.value)}
                              placeholder="Member department (e.g. Computer Engineering)"
                              disabled={savingTeam}
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <p className="text-xs font-medium text-gray-600">University ID Image URL</p>
                            <Input
                              value={memberDrafts[member.id]?.university_id_image ?? ''}
                              onChange={(e) =>
                                updateMemberDraft(member.id, 'university_id_image', e.target.value)
                              }
                              placeholder="Member university ID image URL (https://...)"
                              disabled={savingTeam}
                            />
                          </div>
                        </div>
                      ) : (
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
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          )}

          {myTeam.supervisor && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-uiy-blue" />
                  Supervisor
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLeader ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <p className="text-xs font-medium text-gray-600 sm:col-span-1">Supervisor Name</p>
                    <p className="text-xs font-medium text-gray-600 sm:col-span-1">Supervisor Email</p>
                    <Input
                      value={supervisorDraft.supervisor_name}
                      onChange={(e) =>
                        setSupervisorDraft((prev) => ({ ...prev, supervisor_name: e.target.value }))
                      }
                      placeholder="Supervisor full name (e.g. Dr. Jane Smith)"
                      disabled={savingTeam}
                    />
                    <Input
                      value={supervisorDraft.supervisor_email}
                      onChange={(e) =>
                        setSupervisorDraft((prev) => ({ ...prev, supervisor_email: e.target.value }))
                      }
                      placeholder="Supervisor email (e.g. supervisor@university.edu)"
                      type="email"
                      disabled={savingTeam}
                    />
                    <p className="text-xs font-medium text-gray-600 sm:col-span-2">Supervisor Contact Number</p>
                    <Input
                      value={supervisorDraft.supervisor_contact_number}
                      onChange={(e) =>
                        setSupervisorDraft((prev) => ({ ...prev, supervisor_contact_number: e.target.value }))
                      }
                      placeholder="Supervisor contact number (e.g. +94 77 123 4567)"
                      disabled={savingTeam}
                    />
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={myTeam.supervisor.supervisor_name} />
                    <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={myTeam.supervisor.supervisor_email} />
                    <InfoRow icon={<Phone className="w-4 h-4" />} label="Contact" value={myTeam.supervisor.supervisor_contact_number} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {(myTeam.coSupervisor || isLeader) && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  Co-Supervisor
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLeader ? (
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setHasCoSupervisorDraft((v) => !v)}
                      disabled={savingTeam}
                    >
                      {hasCoSupervisorDraft ? 'Remove Co-Supervisor' : 'Add Co-Supervisor'}
                    </Button>

                    {hasCoSupervisorDraft && (
                      <div className="grid sm:grid-cols-2 gap-3">
                        <p className="text-xs font-medium text-gray-600 sm:col-span-1">Co-Supervisor Name</p>
                        <p className="text-xs font-medium text-gray-600 sm:col-span-1">Co-Supervisor Email</p>
                        <Input
                          value={coSupervisorDraft.supervisor_name}
                          onChange={(e) =>
                            setCoSupervisorDraft((prev) => ({ ...prev, supervisor_name: e.target.value }))
                          }
                          placeholder="Co-supervisor full name (e.g. Dr. John Doe)"
                          disabled={savingTeam}
                        />
                        <Input
                          value={coSupervisorDraft.supervisor_email}
                          onChange={(e) =>
                            setCoSupervisorDraft((prev) => ({ ...prev, supervisor_email: e.target.value }))
                          }
                          placeholder="Co-supervisor email (e.g. cosupervisor@university.edu)"
                          type="email"
                          disabled={savingTeam}
                        />
                        <p className="text-xs font-medium text-gray-600 sm:col-span-2">Co-Supervisor Contact Number</p>
                        <Input
                          value={coSupervisorDraft.supervisor_contact_number}
                          onChange={(e) =>
                            setCoSupervisorDraft((prev) => ({ ...prev, supervisor_contact_number: e.target.value }))
                          }
                          placeholder="Co-supervisor contact number (e.g. +94 71 234 5678)"
                          disabled={savingTeam}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  myTeam.coSupervisor && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={myTeam.coSupervisor.supervisor_name} />
                      <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={myTeam.coSupervisor.supervisor_email} />
                      <InfoRow icon={<Phone className="w-4 h-4" />} label="Contact" value={myTeam.coSupervisor.supervisor_contact_number} />
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {isLeader && (
            <div className="flex items-center justify-end">
              <Button
                type="button"
                onClick={saveTeamDetails}
                disabled={savingTeam}
                className="bg-uiy-blue hover:bg-uiy-darkblue"
              >
                {savingTeam ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}

          <Card className="shadow-sm lg:sticky lg:top-28">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-uiy-blue" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectsLoading ? (
                <div className="py-6 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-uiy-blue" />
                </div>
              ) : projectsError ? (
                <p className="text-sm text-red-600">{projectsError}</p>
              ) : projects.length === 0 ? (
                <p className="text-sm text-gray-500">No project uploaded yet.</p>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-3 bg-white space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-gray-900 text-sm">{project.title}</p>
                        {isLeader && (
                          <Button size="sm" onClick={() => startEdit(projects[0])}>
                            Edit project
                          </Button>
                        )}
                      </div>

                      <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={`${project.title} preview`}
                            className="h-64 w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-64 w-full flex flex-col items-center justify-center gap-2 text-gray-500 bg-gradient-to-b from-gray-50 to-gray-100">
                            <ImageOff className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-medium">No image available</span>
                          </div>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-xs text-gray-600">{project.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noreferrer" className="text-xs text-uiy-blue inline-flex items-center gap-1 hover:underline">
                            GitHub <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.youtube_link && (
                          <a href={project.youtube_link} target="_blank" rel="noreferrer" className="text-xs text-uiy-blue inline-flex items-center gap-1 hover:underline">
                            YouTube <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.pdf && (
                          <a href={project.pdf} target="_blank" rel="noreferrer" className="text-xs text-uiy-blue inline-flex items-center gap-1 hover:underline">
                            PDF <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isLeader && (
                <>
                  {(!hasProject || editingProjectId) ? (
                    <form onSubmit={submitProject} className="space-y-3 border rounded-lg p-3 bg-gray-50">
                      <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        {editingProjectId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingProjectId ? 'Edit Project' : 'Add Project'}
                      </p>
                      <Input
                        placeholder="Project title"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                      <Textarea
                        placeholder="Project description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                      />
                      <Input
                        placeholder="GitHub URL"
                        value={projectForm.github_url}
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, github_url: e.target.value }))}
                      />
                      <Input
                        placeholder="YouTube URL"
                        value={projectForm.youtube_link}
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, youtube_link: e.target.value }))}
                      />
                      <Input
                        placeholder="PDF URL"
                        value={projectForm.pdf}
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, pdf: e.target.value }))}
                      />
                      <Input
                        placeholder="Image URL"
                        value={projectForm.image_url}
                        readOnly
                        className="hidden"
                      />

                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Project image</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <input
                            id="project-image-file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f || !myTeam?.id) return;

                              setProjectImageUploading(true);
                              try {
                                const res = await projectsAPI.uploadProjectImage(myTeam.id, f);

                                if (res?.url) {
                                  if (projectImageFileId && projectImageFileId !== res.fileId) {
                                    try {
                                      await projectsAPI.deleteUploadedFile(projectImageFileId);
                                    } catch {
                                      // best effort cleanup of previous temp image
                                    }
                                  }

                                  setProjectForm((prev) => ({ ...prev, image_url: res.url }));
                                  setProjectImageFileId(res.fileId);
                                }
                              } catch (err) {
                                toast({
                                  title: 'Project image upload failed',
                                  description: err instanceof Error ? err.message : 'Please try again',
                                });
                              } finally {
                                setProjectImageUploading(false);
                                e.currentTarget.value = '';
                              }
                            }}
                          />

                          <label
                            htmlFor="project-image-file"
                            className="inline-flex cursor-pointer items-center rounded-md bg-uiy-blue/10 px-3 py-2 text-xs font-medium text-uiy-blue"
                          >
                            {projectImageUploading ? 'Uploading...' : 'Upload image'}
                          </label>

                          {projectForm.image_url && (
                            <div className="relative">
                              <img
                                src={projectForm.image_url}
                                alt="project preview"
                                className="w-40 h-28 rounded-lg border border-gray-200 object-cover shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    if (projectImageFileId) {
                                      await projectsAPI.deleteUploadedFile(projectImageFileId);
                                    }
                                  } catch (err) {
                                    toast({
                                      title: 'Image delete failed',
                                      description: err instanceof Error ? err.message : 'Please try again',
                                    });
                                  } finally {
                                    setProjectForm((prev) => ({ ...prev, image_url: '' }));
                                    setProjectImageFileId(undefined);
                                  }
                                }}
                                className="absolute right-1 top-1 rounded-md border border-red-200 bg-white/95 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={submitting} className="whitespace-nowrap">
                          {submitting ? 'Saving...' : editingProjectId ? 'Update' : 'Create'}
                        </Button>
                        {editingProjectId && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={resetProjectForm}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  ) : (
                    <div></div>
                  )}
                </>
              )}


            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
