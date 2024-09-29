// src/projectsConfig.ts
import React from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

const projects: Project[] = [];

// Importa todos os App.tsx de cada projeto usando a importação dinâmica do Vite
function importAllProjects() {
  const context = import.meta.glob('./projects/*/App.tsx');
  for (const path in context) {
    const id = path.split('/')[2];
    projects.push({
      id: id,
      name: id.replace('project-', '').replace('-', ' ').toUpperCase(),
      description: `This is the ${id} project.`,
      component: React.lazy(() => context[path]() as Promise<{ default: React.ComponentType<React.ComponentProps<any>> }>),
    });
  }
}

importAllProjects();

export default projects;
