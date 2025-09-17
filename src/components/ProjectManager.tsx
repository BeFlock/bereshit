import React, { useState, useEffect } from 'react';
import { Plus, FolderOpen, Loader2 } from 'lucide-react';
import { ProjectService } from '../services/projectService';
import { CreateProjectModal } from './CreateProjectModal';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import type { BereshitProject } from '../types/project';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<BereshitProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projectsList = await ProjectService.getProjectsList();
      setProjects(projectsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
      console.error('Error loading projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    await loadProjects();
    setIsCreateModalOpen(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir projeto');
      console.error('Error deleting project:', err);
    }
  };

  const handleOpenProject = async (projectPath: string) => {
    try {
      await ProjectService.openProjectFolder(projectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao abrir pasta do projeto');
      console.error('Error opening project folder:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando projetos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Meus Projetos Bereshit
            </h1>
            <p className="text-muted-foreground">
              Gerencie e organize seus projetos Bereshit
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-destructive text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-destructive hover:text-destructive"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 text-center">
            <div className="rounded-full bg-muted p-6">
              <FolderOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Nenhum projeto encontrado
              </h2>
              <p className="text-muted-foreground max-w-md">
                Crie seu primeiro projeto Bereshit para começar a organizar seus trabalhos
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
              size="lg"
            >
              <Plus className="h-4 w-4" />
              Criar Primeiro Projeto
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={() => handleDeleteProject(project.id)}
                onOpen={() => handleOpenProject(project.path)}
              />
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {isCreateModalOpen && (
          <CreateProjectModal
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateProject}
          />
        )}
      </div>
    </div>
  );
};