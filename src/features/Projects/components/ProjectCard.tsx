import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FolderOpen } from 'lucide-react';
import type { IPublicProject } from '../types/projects.types';

interface ProjectCardProps {
  project: IPublicProject;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-uiy-blue" />
            {project.title}
          </CardTitle>
          <Badge variant="secondary">Team: {project.team?.team_name ?? 'TBA'}</Badge>
        </div>
        <p className="text-sm text-gray-500">University: {project.team?.university?.name ?? 'TBA'}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {project.description && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Summary:</span> {project.description}
          </p>
        )}
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
  );
};
