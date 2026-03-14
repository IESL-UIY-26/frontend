import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FolderOpen, ImageOff, Loader2, ThumbsUp } from 'lucide-react';
import type { IPublicProject } from '../types/projects.types';

interface ProjectCardProps {
  project: IPublicProject;
  canVote: boolean;
  voted: boolean;
  voting: boolean;
  onVoteToggle: () => void;
}

export const ProjectCard = ({ project, canVote, voted, voting, onVoteToggle }: ProjectCardProps) => {
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
              <ImageOff className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-medium">No image available</span>
            </div>
          )}
        </div>
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
        <div className="pt-1 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600 inline-flex items-center gap-1">
            <ThumbsUp className="w-4 h-4 text-uiy-blue" />
            Votes: {project.vote_count}
          </p>
          <Button
            size="sm"
            variant={voted ? 'secondary' : 'default'}
            className={!voted ? 'bg-uiy-blue hover:bg-uiy-darkblue' : ''}
            disabled={voting}
            onClick={onVoteToggle}
          >
            {voting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {!canVote ? 'Login to Vote' : voted ? 'Remove Vote' : 'Vote'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
