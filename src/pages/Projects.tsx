import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ProjectCard } from '@/features/Projects/components/ProjectCard';
import { useProjects } from '@/features/Projects/hooks/use-projects';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projects, loading, error, votedIds, togglingIds, toggleVote } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project) => {
      const fields = [project.title, project.description, project.team?.team_name, project.team?.university?.name];
      return fields.some((field) => field?.toLowerCase().includes(query));
    });
  }, [projects, searchQuery]);

  const handleRequireLogin = () => {
    toast.info('You must be logged in to vote for a project.');
    const params = new URLSearchParams({ returnTo: '/projects' });
    void navigate(`/login?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900">All Available Projects</h1>
            <p className="text-gray-500 mt-2">Browse all projects submitted by teams</p>
          </div>

          <div className="max-w-xl mx-auto">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by project title, summary, team, or university"
              className="bg-white"
              aria-label="Search projects"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-uiy-blue" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8 text-center text-red-600">{error}</CardContent>
            </Card>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">No projects available yet.</CardContent>
            </Card>
          ) : filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">No projects match your search.</CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  canVote={!!user}
                  voted={votedIds.has(project.id)}
                  voting={togglingIds.has(project.id)}
                  onVoteToggle={user ? () => void toggleVote(project.id) : handleRequireLogin}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;
