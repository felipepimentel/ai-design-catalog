// src/catalog/ProjectList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import projects from '@/projectsConfig';

const ProjectList: React.FC = () => {
  return (
    <div className="project-list grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {projects.map((project) => (
        <div key={project.id} className="project-card border p-4 rounded shadow">
          <h2 className="text-xl font-bold">{project.name}</h2>
          <p>{project.description}</p>
          <Link to={`/projects/${project.id}`} className="text-blue-500 hover:underline mt-2 block">
            View Project
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
