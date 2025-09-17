import { invoke } from '@tauri-apps/api/core';
import type { BereshitProject, CreateProjectData } from '../types/project';

export class ProjectService {
  static async getProjectsList(): Promise<BereshitProject[]> {
    try {
      return await invoke('get_projects_list');
    } catch (error) {
      console.error('Error getting projects list:', error);
      throw error;
    }
  }

  static async createProject(data: CreateProjectData): Promise<BereshitProject> {
    try {
      return await invoke('create_project', {
        name: data.name,
        path: data.path,
        description: data.description || null,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    try {
      await invoke('delete_project', { projectId });
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  static async openProjectFolder(projectPath: string): Promise<void> {
    try {
      await invoke('open_project_folder', { projectPath });
    } catch (error) {
      console.error('Error opening project folder:', error);
      throw error;
    }
  }
}
