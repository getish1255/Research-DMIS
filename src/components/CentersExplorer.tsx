import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResearchCenter } from '../types';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Compass,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const CentersExplorer: React.FC = () => {
  const {
    centers,
    activities,
    setSelectedActivity,
    setCenterFilter,
    setActiveTab,
    drilldownCenterId,
    setDrilldownCenterId
  } = useApp();

  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedAgro, setSelectedAgro] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const uniqueZones = Array.from(new Set(centers.map(c => c.zone))).sort();
  const agroEcologies = ['All', 'Highland', 'Midland', 'Lowland', 'Pastoral / Arid', 'Headquarters'];

  const filteredCenters = centers.filter(center => {
    if (selectedZone !== 'All' && center.zone !== selectedZone) return false;
    if (selectedAgro !== 'All' && center.agroEcology !== selectedAgro) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = center.name.toLowerCase().includes(q);
      const matchMandate = center.mandate.toLowerCase().includes(q);
      const matchCommodity = center.focalCommodities.some(c => c.toLowerCase().includes(q));
      if (!matchName && !matchMandate && !matchCommodity) return false;
    }
    return true;
  });

  const activeCenter = centers.find(c => c.id === drilldownCenterId) || null;
  const centerActivities = activeCenter ? activities.filter(a => a.centerId === activeCenter.id) : [];

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              18 Research Centers of Oromia Agricultural Research Institute
            </h2>
            <p className="text-xs text-stone-500">
              Decentralized scientific infrastructure across diverse agro-ecological zones
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search centers, mandates, crops..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-500 font-medium">Agro-Ecology:</span>
          {agroEcologies.map(ae => (
            <button
              key={ae}
              onClick={() => setSelectedAgro(ae)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedAgro === ae
                  ? 'bg-stone-900 text-white font-medium'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {ae}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-stone-500 font-medium">Zone:</span>
            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs"
            >
              <option value="All">All Zones ({uniqueZones.length})</option>
              {uniqueZones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Center Drill-Down Banner */}
      {activeCenter && (
        <div className="bg-emerald-950 text-emerald-100 rounded-lg p-5 border border-emerald-800 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase">
                <span>{activeCenter.shortCode}</span>
                <span aria-hidden="true">·</span>
                <span>{activeCenter.agroEcology}</span>
                <span aria-hidden="true">·</span>
                <span>Est. {activeCenter.establishedYear}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{activeCenter.name}</h3>
              <p className="text-xs text-emerald-200/90 mt-1 max-w-3xl leading-relaxed">
                {activeCenter.mandate}
              </p>
            </div>
            <button
              onClick={() => setDrilldownCenterId(null)}
              className="text-xs text-emerald-400 hover:text-white underline"
            >
              Close Center Focus
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-emerald-900/50 p-3 rounded-md border border-emerald-800">
            <div>
              <span className="text-emerald-400 block text-[11px]">Location</span>
              <span className="font-semibold text-white">{activeCenter.location} ({activeCenter.zone})</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[11px]">Director / Lead</span>
              <span className="font-semibold text-white">{activeCenter.director}</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[11px]">Staff Strength</span>
              <span className="font-semibold text-white">{activeCenter.activeStaffCount} Researchers & Staff</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[11px]">Active Research Activities</span>
              <span className="font-semibold text-white font-mono tabular-nums">{centerActivities.length} trials logged</span>
            </div>
          </div>

          {/* Activities at this center */}
          <div className="space-y-2 pt-2 border-t border-emerald-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Trials & Experiments at {activeCenter.shortCode}:</span>
              <button
                onClick={() => {
                  setCenterFilter(activeCenter.id);
                  setActiveTab('activities');
                }}
                className="text-xs text-emerald-300 hover:text-white underline"
              >
                Open in Activities Board →
              </button>
            </div>

            {centerActivities.length === 0 ? (
              <div className="text-xs text-emerald-300/70 italic py-2">
                No active trials currently logged for this station.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {centerActivities.map(act => (
                  <div
                    key={act.id}
                    onClick={() => setSelectedActivity(act)}
                    className="p-3 bg-emerald-900/40 hover:bg-emerald-900/80 rounded border border-emerald-800/70 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-300 font-bold">{act.code}</span>
                      <span className="font-mono">{act.status} ({act.progressPercent}%)</span>
                    </div>
                    <div className="text-xs font-semibold text-white line-clamp-1">{act.title}</div>
                    <div className="text-[11px] text-emerald-300/80">PI: {act.principalInvestigator}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCenters.map(center => {
          const acts = activities.filter(a => a.centerId === center.id);
          const activeTrials = acts.filter(a => a.status === 'Ongoing' || a.status === 'Extended').length;

          return (
            <div
              key={center.id}
              className="bg-white rounded-lg border border-stone-200 p-5 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xs transition-all space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {center.shortCode}
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">
                    Est. {center.establishedYear}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-900 leading-snug">{center.name}</h3>
                  <div className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{center.location}, {center.zone}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {center.mandate}
                </p>

                {/* Focal commodities */}
                <div className="pt-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-1">
                    Focal Commodities & Disciplines:
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] text-stone-600">
                    {center.focalCommodities.map((f, i) => (
                      <span key={i} className="bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom stats and action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="text-stone-500">
                  <strong className="text-stone-800 font-mono tabular-nums">{acts.length}</strong> activities ({activeTrials} active)
                </div>
                <button
                  onClick={() => setDrilldownCenterId(center.id)}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold"
                >
                  <span>Focus Center</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
