use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::Manager;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BereshitProject {
    id: String,
    name: String,
    path: String,
    created_at: String,
    last_modified: String,
    description: Option<String>,
    config: ProjectConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectConfig {
    version: String,
    project_type: String,
    settings: ProjectSettings,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectSettings {
    auto_save: bool,
    theme: String,
    language: String,
}

impl Default for ProjectConfig {
    fn default() -> Self {
        Self {
            version: "1.0.0".to_string(),
            project_type: "bereshit".to_string(),
            settings: ProjectSettings {
                auto_save: true,
                theme: "dark".to_string(),
                language: "pt-BR".to_string(),
            },
        }
    }
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_projects_list(app: tauri::AppHandle) -> Result<Vec<BereshitProject>, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let projects_file = app_data_dir.join("projects.json");
    
    if !projects_file.exists() {
        return Ok(Vec::new());
    }
    
    let content = fs::read_to_string(&projects_file)
        .map_err(|e| format!("Failed to read projects file: {}", e))?;
    
    let projects: Vec<BereshitProject> = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse projects file: {}", e))?;
    
    Ok(projects)
}

#[tauri::command]
async fn create_project(
    app: tauri::AppHandle,
    name: String,
    path: String,
    description: Option<String>,
) -> Result<BereshitProject, String> {
    let project_path = Path::new(&path).join(&name);
    
    // Create project directory
    fs::create_dir_all(&project_path)
        .map_err(|e| format!("Failed to create project directory: {}", e))?;
    
    // Create project config
    let config = ProjectConfig::default();
    let config_path = project_path.join("bereshit.json");
    let config_content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    
    fs::write(&config_path, config_content)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    
    // Create project object
    let now = chrono::Utc::now().to_rfc3339();
    let project = BereshitProject {
        id: Uuid::new_v4().to_string(),
        name: name.clone(),
        path: project_path.to_string_lossy().to_string(),
        created_at: now.clone(),
        last_modified: now,
        description,
        config,
    };
    
    // Save to projects list
    save_project_to_list(&app, &project).await?;
    
    Ok(project)
}

#[tauri::command]
async fn delete_project(app: tauri::AppHandle, project_id: String) -> Result<(), String> {
    let mut projects = get_projects_list(app.clone()).await?;
    
    if let Some(pos) = projects.iter().position(|p| p.id == project_id) {
        projects.remove(pos);
        save_projects_list(&app, &projects).await?;
        Ok(())
    } else {
        Err("Project not found".to_string())
    }
}

#[tauri::command]
async fn open_project_folder(project_path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(&project_path)
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }
    
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&project_path)
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&project_path)
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }
    
    Ok(())
}

async fn save_project_to_list(app: &tauri::AppHandle, project: &BereshitProject) -> Result<(), String> {
    let mut projects = get_projects_list(app.clone()).await?;
    
    // Update existing or add new
    if let Some(pos) = projects.iter().position(|p| p.id == project.id) {
        projects[pos] = project.clone();
    } else {
        projects.push(project.clone());
    }
    
    save_projects_list(app, &projects).await
}

async fn save_projects_list(app: &tauri::AppHandle, projects: &[BereshitProject]) -> Result<(), String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    // Ensure app data directory exists
    fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    
    let projects_file = app_data_dir.join("projects.json");
    let content = serde_json::to_string_pretty(projects)
        .map_err(|e| format!("Failed to serialize projects: {}", e))?;
    
    fs::write(&projects_file, content)
        .map_err(|e| format!("Failed to write projects file: {}", e))?;
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_projects_list,
            create_project,
            delete_project,
            open_project_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
