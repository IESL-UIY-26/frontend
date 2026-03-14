import React from 'react';
import { Link } from 'react-router-dom';
import { useTeamStatus } from '../../context/TeamStatusContext';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { projectsAPI } from '@/features/Projects/api/projects.api';
import type { IProject } from '@/features/Projects/types/projects.types';
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

export function MyTeamView() {
  const { myTeam, teamLoading } = useTeamStatus();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [projects, setProjects] = React.useState<IProject[]>([]);
  const [projectsLoading, setProjectsLoading] = React.useState(false);
  const [projectsError, setProjectsError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
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
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 ">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-uiy-blue/10 mb-4">
              <Users className="w-8 h-8 text-uiy-blue" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900">{myTeam.team_name}</h1>
            <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">{myTeam.university.name}</span>
            </div>
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
