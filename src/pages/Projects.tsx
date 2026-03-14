import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ProjectCard } from '@/features/Projects/components/ProjectCard';
import { useProjects } from '@/features/Projects/hooks/use-projects';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { usePageQueryParam } from '@/hooks/use-page-query-param';
import { useClampPage } from '@/hooks/use-clamp-page';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, setPage } = usePageQueryParam(searchParams, setSearchParams);
  const {
    projects,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    loading,
    error,
    votedIds,
    togglingIds,
    toggleVote,
  } = useProjects(page);
  useClampPage(page, totalPages, setPage);

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
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((project) => (
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

              {totalPages > 0 && (
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Button variant="outline" onClick={() => setPage(page - 1)} disabled={!hasPreviousPage}>
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;
