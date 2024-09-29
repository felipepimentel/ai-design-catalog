// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectList from '@/catalog/ProjectList';
import ProjectViewer from '@/catalog/ProjectViewer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/:projectId" element={<ProjectViewer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
