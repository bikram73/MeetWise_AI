import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { WorkspacePage } from './components/WorkspacePage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {currentView === 'landing' ? (
        <LandingPage onOpenWorkspace={() => setCurrentView('workspace')} />
      ) : (
        <WorkspacePage onBackToLanding={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

