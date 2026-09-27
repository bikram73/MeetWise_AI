import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { WorkspacePage } from './components/WorkspacePage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');

  const handleNavigateSection = (sectionId?: string) => {
    setCurrentView('landing');
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'landing' ? (
        <LandingPage onOpenWorkspace={() => setCurrentView('workspace')} />
      ) : (
        <WorkspacePage
          onBackToLanding={() => setCurrentView('landing')}
          onNavigateSection={handleNavigateSection}
        />
      )}
    </div>
  );
}

