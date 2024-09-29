// src/catalog/ProjectViewer.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import projects from '@/projectsConfig';

const ProjectViewer: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return <div>Project not found.</div>;
  }

  const ProjectComponent = project.component;

  return (
    <div>
      <React.Suspense fallback={<div>Loading Project...</div>}>
        <ProjectComponent />
      </React.Suspense>
    </div>
  );
};

export default ProjectViewer;
