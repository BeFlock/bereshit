import React, { useState } from 'react';
import { Loader2, Folder, FileText, MapPin } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { ProjectService } from '../services/projectService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CreateProjectData } from '../types/project';

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    path: '',
    description: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPath = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Selecione a pasta onde criar o projeto',
      });
      
      if (selected && typeof selected === 'string') {
        setFormData(prev => ({
          ...prev,
          path: selected,
        }));
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      // Fallback para caminho padrão
      const defaultPath = '/Users/user/Documents';
      setFormData(prev => ({
        ...prev,
        path: prev.path || defaultPath,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Nome do projeto é obrigatório');
      return;
    }

    if (!formData.path.trim()) {
      setError('Caminho do projeto é obrigatório');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await ProjectService.createProject({
        name: formData.name.trim(),
        path: formData.path.trim(),
        description: formData.description?.trim() || undefined,
      });

      onSuccess();
    } catch (err) {
      console.log(err);
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]" onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Criar Novo Projeto
          </DialogTitle>
          <DialogDescription>
            Configure seu novo projeto Bereshit. Preencha as informações abaixo para começar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nome do Projeto *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite o nome do projeto"
              required
              disabled={isCreating}
              className="transition-all"
            />
          </div>

          {/* Project Path */}
          <div className="space-y-2">
            <Label htmlFor="path" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localização *
            </Label>
            <div className="flex gap-2">
              <Input
                id="path"
                name="path"
                value={formData.path}
                onChange={handleInputChange}
                placeholder="Digite o caminho onde criar o projeto"
                required
                disabled={isCreating}
                className="flex-1 transition-all"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSelectPath}
                disabled={isCreating}
                className="shrink-0"
              >
                Selecionar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              O projeto será criado em uma pasta com o nome do projeto neste local
            </p>
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descrição opcional do projeto"
              rows={3}
              disabled={isCreating}
              className="transition-all resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="gap-2"
            >
              {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isCreating ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};