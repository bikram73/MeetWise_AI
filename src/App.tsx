import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { WorkspacePage } from './components/WorkspacePage';
import { HistoryPage } from './components/HistoryPage';
import { HistoryItem } from './utils/historyStorage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace' | 'history'>('landing');
  const [loadedHistoryItem, setLoadedHistoryItem] = useState<HistoryItem | null>(null);

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

  const handleOpenWorkspaceWithHistory = (item: HistoryItem) => {
    setLoadedHistoryItem(item);
    setCurrentView('workspace');
  };

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'landing' ? (
        <LandingPage
          onOpenWorkspace={() => {
            setLoadedHistoryItem(null);
            setCurrentView('workspace');
          }}
          onOpenHistory={() => setCurrentView('history')}
        />
      ) : currentView === 'history' ? (
        <HistoryPage
          onOpenWorkspaceWithItem={handleOpenWorkspaceWithHistory}
          onNavigateLanding={() => setCurrentView('landing')}
          onNavigateWorkspace={() => {
            setLoadedHistoryItem(null);
            setCurrentView('workspace');
          }}
        />
      ) : (
        <WorkspacePage
          initialHistoryItem={loadedHistoryItem}
          onBackToLanding={() => setCurrentView('landing')}
          onOpenHistory={() => setCurrentView('history')}
          onNavigateSection={handleNavigateSection}
        />
      )}
    </div>
  );
}
