import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ExperimentRunner from './pages/ExperimentRunner';
import { ViewProvider, useViewContext } from './contexts/ViewContext';
import './App.css';

function AppInner() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isWatching } = useViewContext();

  return (
    <div className="app-layout">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
      {!isWatching && <Sidebar open={sidebarOpen} />}
      <main
        className={`app-main ${
          isWatching ? 'no-sidebar' : sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
        }`}
      >
        <Routes>
          <Route path="/run/:conditionId" element={<ExperimentRunner />} />
          <Route path="*" element={<Navigate to="/run/control" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ViewProvider>
      <AppInner />
    </ViewProvider>
  );
}
