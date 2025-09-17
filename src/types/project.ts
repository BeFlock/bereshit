export interface ProjectSettings {
  auto_save: boolean;
  theme: string;
  language: string;
}

export interface ProjectConfig {
  version: string;
  project_type: string;
  settings: ProjectSettings;
}

export interface BereshitProject {
  id: string;
  name: string;
  path: string;
  created_at: string;
  last_modified: string;
  description?: string;
  config: ProjectConfig;
}

export interface CreateProjectData {
  name: string;
  path: string;
  description?: string;
}
