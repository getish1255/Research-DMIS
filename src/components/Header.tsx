import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Shield, Microscope, Eye, Plus, Sparkles, Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeRole,
    setActiveRole,
    currentUser,
    setIsNewActivityModalOpen,
    activities
  } = useApp();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveRole(e.target.value as UserRole);
  };

  const navItems = [
    { id: 'overview', label: 'HQ Overview' },
    { id: 'activities', label: 'Activities & Lifecycle' },
    { id: 'centers', label: '18 Research Centers' },
    { id: 'directorates', label: 'Directorates & Teams' },
    { id: 'schema', label: 'Database Schema & ERD' },
    { id: 'reports', label: 'Institutional Reports' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 text-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element brand zone */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-sm bg-emerald-600 flex items-center justify-center font-black text-stone-900 text-base shadow-inner">
                Q
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  IQQO Research Activity System
                </span>
                <span className="block text-[11px] text-stone-400 font-mono tracking-wider">
                  OROMIA AGRICULTURAL RESEARCH INSTITUTE
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-stone-800 text-emerald-400 shadow-sm border border-stone-700/60'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Privilege Level Selector */}
            <div className="flex items-center gap-1.5 bg-stone-800/90 border border-stone-700 rounded-md px-2.5 py-1 text-xs">
              <span className="text-stone-400 flex items-center gap-1">
                {activeRole === 'Administrator' && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                {activeRole === 'Researcher' && <Microscope className="w-3.5 h-3.5 text-emerald-400" />}
                {activeRole === 'Viewer' && <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="hidden sm:inline text-stone-400">Role:</span>
              </span>
              <select
                value={activeRole}
                onChange={handleRoleChange}
                aria-label="Active privilege level"
                className="bg-transparent text-stone-100 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="Administrator" className="bg-stone-900 text-white">Administrator (HQ Coordination)</option>
                <option value="Researcher" className="bg-stone-900 text-white">Researcher (Principal Investigator)</option>
                <option value="Viewer" className="bg-stone-900 text-white">Viewer (Stakeholder / Public)</option>
              </select>
            </div>

            {/* Quick Action: New Research Activity (only Admin or Researcher) */}
            {activeRole !== 'Viewer' && (
              <button
                onClick={() => setIsNewActivityModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold px-3 py-1.5 rounded-md text-xs transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Activity</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-800 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-stone-800 text-emerald-400 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Context Bar with clean unboxed text indicators */}
      <div className="bg-stone-950/80 border-t border-stone-800/80 px-4 py-1.5 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-200">{currentUser.name}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400">{currentUser.title}</span>
            {currentUser.email !== 'boqolo@iqqo.gov.et' && (
              <>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="font-mono text-stone-400 text-[11px]">{currentUser.email}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="text-stone-400">
              Developer: <span className="text-stone-200 font-semibold">Getachew Haile</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span className="text-stone-400">
              Ref & Contact: <a href="mailto:boqolo@iqqo.gov.et" className="text-emerald-400 hover:underline font-mono">boqolo@iqqo.gov.et</a>
            </span>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span className="font-mono text-stone-300 tabular-nums font-semibold">
              {activities.length} Total Registered Activities
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
