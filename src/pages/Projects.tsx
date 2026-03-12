import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { projectsAPI } from '@/features/Projects/api/projects.api';
import type { IPublicProject } from '@/features/Projects/types/projects.types';
import { ApiError } from '@/utils/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FolderOpen, ExternalLink } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState<IPublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectsAPI.getPublicProjects();
        setProjects(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404 && err.path === '/api/public/projects') {
          setError('Public projects service is not available right now (endpoint not found). Please contact admin or try again later.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load projects');
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

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
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-uiy-blue" />
                        {project.title}
                      </CardTitle>
                      <Badge variant="secondary">{project.team?.team_name ?? 'Team'}</Badge>
                    </div>
                    {project.team?.university?.name && (
                      <p className="text-sm text-gray-500">{project.team.university.name}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.description && <p className="text-sm text-gray-700">{project.description}</p>}
                    <div className="flex flex-wrap gap-2">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="text-sm text-uiy-blue inline-flex items-center gap-1 hover:underline">
                          GitHub <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {project.youtube_link && (
                        <a href={project.youtube_link} target="_blank" rel="noreferrer" className="text-sm text-uiy-blue inline-flex items-center gap-1 hover:underline">
                          YouTube <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {project.pdf && (
                        <a href={project.pdf} target="_blank" rel="noreferrer" className="text-sm text-uiy-blue inline-flex items-center gap-1 hover:underline">
                          PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;
