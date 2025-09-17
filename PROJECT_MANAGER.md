# Sistema de Gerenciamento de Projetos Bereshit

## Visão Geral

Este sistema implementa um gerenciador completo de projetos para a aplicação Bereshit, permitindo criar, listar e gerenciar projetos que são salvos no sistema operacional local.

## Funcionalidades

### ✅ Implementadas

- **Lista de Projetos**: Exibe todos os projetos criados em uma interface visual moderna
- **Criação de Projetos**: Modal para criar novos projetos com seleção de diretório
- **Persistência**: Salva a lista de projetos em `projects.json` no diretório de dados da aplicação
- **Estrutura de Projeto**: Cria automaticamente a pasta do projeto e arquivo `bereshit.json` com configurações
- **Exclusão**: Remove projetos da lista (não deleta os arquivos físicos)
- **Abertura de Pasta**: Abre a pasta do projeto no explorador de arquivos do SO

### 🏗️ Arquitetura

#### Backend (Rust/Tauri)

- **`BereshitProject`**: Estrutura principal do projeto
- **`ProjectConfig`**: Configurações específicas do projeto Bereshit
- **`ProjectSettings`**: Configurações de usuário (tema, idioma, auto-save)

#### Frontend (React/TypeScript)

- **`ProjectManager`**: Componente principal que gerencia a lista
- **`ProjectCard`**: Card visual para cada projeto
- **`CreateProjectModal`**: Modal para criação de novos projetos
- **`ProjectService`**: Serviço para comunicação com o backend

### 📁 Estrutura de Arquivos Criada

```
projeto-exemplo/
├── bereshit.json          # Configurações do projeto
└── (outros arquivos...)   # Conteúdo futuro do projeto
```

### 🎨 Interface

- Design moderno com gradientes e glassmorphism
- Responsiva para diferentes tamanhos de tela
- Estados de loading e error
- Animações suaves
- Tema escuro/claro compatível

### 💾 Persistência de Dados

Os projetos são salvos em:
- **Windows**: `%APPDATA%/com.bereshit.app/projects.json`
- **macOS**: `~/Library/Application Support/com.bereshit.app/projects.json`
- **Linux**: `~/.local/share/com.bereshit.app/projects.json`

### 🔧 Configuração do Projeto (bereshit.json)

```json
{
  "version": "1.0.0",
  "project_type": "bereshit",
  "settings": {
    "auto_save": true,
    "theme": "dark",
    "language": "pt-BR"
  }
}
```

## Como Usar

1. **Abrir a Aplicação**: O sistema carrega automaticamente na tela principal
2. **Criar Projeto**: Clique em "Novo Projeto" e preencha as informações
3. **Selecionar Local**: Use o botão "Selecionar" para escolher onde criar o projeto
4. **Gerenciar Projetos**: Clique nos cards para abrir a pasta ou use o botão de exclusão

## Tecnologias Utilizadas

- **Tauri 2.0**: Framework para aplicações desktop
- **React 18**: Interface de usuário
- **TypeScript**: Tipagem estática
- **Rust**: Backend e operações de sistema
- **CSS3**: Estilos modernos com gradientes e animações

## Comandos Tauri Implementados

- `get_projects_list()`: Lista todos os projetos
- `create_project(name, path, description)`: Cria um novo projeto
- `delete_project(project_id)`: Remove projeto da lista
- `open_project_folder(project_path)`: Abre pasta no SO

## Próximos Passos Sugeridos

1. **Editor de Configurações**: Interface para editar `bereshit.json`
2. **Templates**: Diferentes tipos de projeto com estruturas pré-definidas
3. **Importação**: Importar projetos existentes
4. **Backup**: Sistema de backup automático dos projetos
5. **Busca e Filtros**: Filtrar projetos por nome, data, etc.
6. **Estatísticas**: Informações sobre uso dos projetos
