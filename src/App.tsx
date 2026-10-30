import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ActivitiesManager } from './components/ActivitiesManager';
import { CentersExplorer } from './components/CentersExplorer';
import { DirectoratesExplorer } from './components/DirectoratesExplorer';
import { DatabaseSchemaViewer } from './components/DatabaseSchemaViewer';
import { InstitutionalReports } from './components/InstitutionalReports';
import { NaturalResourcesDashboard } from './components/NaturalResourcesDashboard';
import { LivestockDashboard } from './components/LivestockDashboard';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { NewActivityModal } from './components/NewActivityModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activeTab === 'overview' && <DashboardOverview />}
      {activeTab === 'natural-resources' && <NaturalResourcesDashboard />}
      {activeTab === 'livestock-research' && <LivestockDashboard />}
      {activeTab === 'activities' && <ActivitiesManager />}
      {activeTab === 'centers' && <CentersExplorer />}
      {activeTab === 'directorates' && <DirectoratesExplorer />}
      {activeTab === 'schema' && <DatabaseSchemaViewer />}
      {activeTab === 'reports' && <InstitutionalReports />}

      {/* Global Interactive Modals */}
      <ActivityDetailModal />
      <NewActivityModal />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Clean Institutional Footer with Developer and Contact Attribution */}
        <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-xs text-stone-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span className="font-semibold text-stone-800">
                Oromia Agricultural Research Institute (IQQO)
              </span>
              <span aria-hidden="true" className="hidden sm:inline text-stone-300">·</span>
              <span>Research Directorate Management Portal</span>
              <span aria-hidden="true" className="hidden sm:inline text-stone-300">·</span>
              <span className="font-mono text-[11px] text-stone-600">18 Centers · 10 Directorates</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">Developer:</span>
                <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  Getachew Haile
                </span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">Reference & Contact:</span>
                <a
                  href="mailto:boqolo@iqqo.gov.et"
                  className="font-mono text-emerald-700 hover:text-emerald-900 font-semibold underline underline-offset-2"
                >
                  boqolo@iqqo.gov.et
                </a>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <a
                href="https://iqqo.gov.et/en/content/research-directorate"
                target="_blank"
                rel="noreferrer"
                className="text-stone-600 hover:text-emerald-800 underline underline-offset-2"
              >
                iqqo.gov.et Official Portal
              </a>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
