import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Directorate } from '../types';
import {
  Compass,
  Users,
  Layers,
  ArrowRight,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const DirectoratesExplorer: React.FC = () => {
  const {
    directorates,
    activities,
    setDirectorateFilter,
    setActiveTab,
    setSelectedActivity
  } = useApp();

  const [selectedDirId, setSelectedDirId] = useState<string>(directorates[0]?.id || 'crop-research');

  const selectedDirectorate = directorates.find(d => d.id === selectedDirId) || directorates[0];
  const dirActivities = activities.filter(a => a.directorateId === selectedDirectorate.id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-lg border border-stone-200">
        <h2 className="text-base font-bold text-stone-900">
          Scientific Directorates & Research Teams
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Organizational structure of research processes governing technology generation across Oromia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Directorate Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-400 px-1">
            10 Research Directorates
          </div>
          <div className="space-y-1.5">
            {directorates.map(dir => {
              const count = activities.filter(a => a.directorateId === dir.id).length;
              const isSelected = selectedDirId === dir.id;

              return (
                <button
                  key={dir.id}
                  onClick={() => setSelectedDirId(dir.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white shadow-xs font-semibold'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-emerald-600 text-stone-900 font-bold' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {dir.code}
                      </span>
                      <span className="font-semibold">{dir.name}</span>
                    </div>
                    <div className={`text-[11px] mt-1 ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                      {dir.teams.length} specialized teams
                    </div>
                  </div>
                  <span className={`font-mono tabular-nums text-xs font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-stone-800 text-emerald-400' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Directorate Deep Dive Content */}
        <div className="lg:col-span-8 space-y-5">
          {selectedDirectorate && (
            <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-6">
              {/* Directorate Overview Header */}
              <div className="space-y-2 border-b border-stone-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                    {selectedDirectorate.code} · Research Process
                  </div>
                  <div className="text-xs text-stone-500">
                    Director: <strong className="text-stone-800">{selectedDirectorate.director}</strong>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-stone-900">
                  {selectedDirectorate.name}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedDirectorate.description}
                </p>

                {selectedDirectorate.id === 'natural-resources' && (
                  <div className="mt-3 bg-emerald-950 text-white p-4 rounded-lg border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded">
                          IQQO 2019 EFY ACTION PLAN
                        </span>
                        <span className="text-[11px] text-emerald-300">12 Centers · 328 Activities</span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        Natural Resource Research Directorate Action Plan & Performance Distribution
                      </div>
                      <p className="text-xs text-emerald-200/90 leading-snug">
                        Full dataset tracking quarterly percentages, baseline milestones, SFI, Agroforestry, SWC, and SRS teams.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('natural-resources')}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-md text-xs whitespace-nowrap transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
                    >
                      <span>Open NRRD Action Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {selectedDirectorate.id === 'livestock-research' && (
                  <div className="mt-3 bg-stone-900 text-white p-4 rounded-lg border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded">
                          IQQO 2019 EFY ACTION PLAN
                        </span>
                        <span className="text-[11px] text-amber-300">12 Centers · 286 Activities · 6 Teams</span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        Livestock Research Directorate Action Plan & Performance Portfolio
                      </div>
                      <p className="text-xs text-stone-300 leading-snug">
                        Comprehensive dataset tracking Dairy & Beef, Apiculture, Animal Feeds & Forage, Small Ruminants, Poultry, and Aquaculture.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('livestock-research')}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-md text-xs whitespace-nowrap transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
                    >
                      <span>Open LRD Action Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Research Teams under this Directorate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Specialized Research Teams ({selectedDirectorate.teams.length})
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedDirectorate.teams.map(team => (
                    <div
                      key={team.id}
                      className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/60 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h5 className="text-xs font-bold text-stone-900">{team.name}</h5>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Lead Scientist: <span className="text-stone-700 font-medium">{team.leadScientist}</span>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-stone-200/60">
                        <div className="text-[10px] uppercase font-mono text-stone-400">Core Focus Lines:</div>
                        <ul className="text-[11px] text-stone-600 space-y-0.5 list-disc list-inside">
                          {team.focusAreas.map((fa, i) => (
                            <li key={i} className="line-clamp-1">{fa}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Research Activities conducted under this Directorate */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Current Portfolio Activities ({dirActivities.length})
                  </h4>
                  <button
                    onClick={() => {
                      setDirectorateFilter(selectedDirectorate.id);
                      setActiveTab('activities');
                    }}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
                  >
                    Manage in Activities Board →
                  </button>
                </div>

                {dirActivities.length === 0 ? (
                  <div className="text-xs text-stone-400 italic py-4 text-center">
                    No research activities currently recorded under this directorate.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                    {dirActivities.map(act => (
                      <div
                        key={act.id}
                        onClick={() => setSelectedActivity(act)}
                        className="p-3 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-800">{act.code}</span>
                            <span className="text-stone-400">·</span>
                            <span className="text-emerald-700 font-medium">{act.status}</span>
                          </div>
                          <div className="font-medium text-stone-900 line-clamp-1">{act.title}</div>
                          <div className="text-[11px] text-stone-500">
                            PI: {act.principalInvestigator} · Target: {act.targetAgroEcology}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-stone-800 tabular-nums">{act.progressPercent}%</div>
                          <div className="text-[10px] text-stone-400">FY {act.fiscalYear}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
