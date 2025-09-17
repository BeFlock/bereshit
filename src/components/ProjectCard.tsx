import React from 'react';
import { Calendar, FolderOpen, Trash2, Settings } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BereshitProject } from '../types/project';

interface ProjectCardProps {
  project: BereshitProject;
  onDelete: () => void;
  onOpen: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onDelete, 
  onOpen 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja remover o projeto "${project.name}" da lista?`)) {
      onDelete();
    }
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-border/50 hover:border-border"
      onClick={onOpen}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        {/* Project Path */}
        <div className="mb-4 p-3 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">LOCALIZAÇÃO</span>
          </div>
          <p className="text-sm font-mono text-foreground/80 break-all">
            {project.path}
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Criado:</span>
            <span className="font-medium">{formatDate(project.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Modificado:</span>
            <span className="font-medium">{formatDate(project.last_modified)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
            v{project.config.version}
          </div>
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
            {project.config.settings.theme}
          </div>
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-accent text-accent-foreground">
            {project.config.settings.language}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};