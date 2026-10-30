import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ResearchActivity } from '../types';
import {
  Filter,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const LivestockDashboard: React.FC = () => {
  const {
    activities,
    centers,
    setSelectedActivity,
    setActiveTab,
    setCenterFilter
  } = useApp();

  // Filter only Livestock Research Directorate activities
  const lrdActivities = useMemo(() => {
    return activities.filter(a => a.directorateId === 'livestock-research');
  }, [activities]);

  const [selectedCenter, setSelectedCenter] = useState<string>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyDelayed, setOnlyDelayed] = useState<boolean>(false);
  const [startYearFilter, setStartYearFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Centers present in LRD data
  const lrdCenterIds = useMemo(() => {
    return Array.from(new Set(lrdActivities.map(a => a.centerId)));
  }, [lrdActivities]);

  // Teams in LRD data
  const teams = [
    { id: 'All', name: 'All 6 Teams', code: 'ALL', count: lrdActivities.length },
    { id: 'team-dairy-beef', name: 'Dairy & Beef Cattle', code: 'DAIRY/BEEF' },
    { id: 'team-apiculture-sericulture', name: 'Apiculture & Bee Research', code: 'APICULTURE' },
    { id: 'team-animal-feeds', name: 'Animal Feeds & Nutrition', code: 'FEEDS' },
    { id: 'team-small-ruminants', name: 'Small Ruminants (Sheep & Goat)', code: 'SMALL RUM.' },
    { id: 'team-poultry', name: 'Poultry Research', code: 'POULTRY' },
    { id: 'team-fisheries-aquaculture', name: 'Fisheries & Aquaculture', code: 'FISHERIES' },
  ];

  // Activities with documented bottlenecks / underperformance reasons
  const delayedActivities = useMemo(() => {
    return lrdActivities.filter(a => !!a.underPerformanceReason && a.underPerformanceReason.trim().length > 0);
  }, [lrdActivities]);

  // Metrics
  const metrics = useMemo(() => {
    const total = lrdActivities.length;
    const ongoing = lrdActivities.filter(a => a.status === 'Ongoing');
    const newCount = lrdActivities.filter(a => a.status === 'New');
    const extended = lrdActivities.filter(a => a.status === 'Extended');
    const discontinued = lrdActivities.filter(a => a.status === 'Discontinued');

    const avgOverall = total > 0
      ? (lrdActivities.reduce((s, a) => s + (a.overallPerformancePercent || a.progressPercent || 0), 0) / total).toFixed(1)
      : '0';

    const avgOngoing = ongoing.length > 0
      ? (ongoing.reduce((s, a) => s + (a.overallPerformancePercent || a.progressPercent || 0), 0) / ongoing.length).toFixed(1)
      : '0';

    const avgNew = newCount.length > 0
      ? (newCount.reduce((s, a) => s + (a.overallPerformancePercent || a.progressPercent || 0), 0) / newCount.length).toFixed(1)
      : '0';

    // Team activity counts
    const teamCounts: Record<string, number> = {};
    teams.forEach(t => {
      if (t.id !== 'All') {
        teamCounts[t.id] = lrdActivities.filter(a => a.teamId === t.id).length;
      }
    });

    return {
      total,
      ongoingCount: ongoing.length,
      newCount: newCount.length,
      extendedCount: extended.length,
      discontinuedCount: discontinued.length,
      avgOverall,
      avgOngoing,
      avgNew,
      teamCounts,
      delayedCount: delayedActivities.length
    };
  }, [lrdActivities, delayedActivities]);

  // Distinct start years
  const startYears = useMemo(() => {
    const years = new Set<string>();
    lrdActivities.forEach(a => {
      if (a.yearStartEC) years.add(String(a.yearStartEC));
    });
    return Array.from(years).sort();
  }, [lrdActivities]);

  // Filtered list
  const filteredActivities = useMemo(() => {
    return lrdActivities.filter(act => {
      if (selectedCenter !== 'All' && act.centerId !== selectedCenter) return false;
      if (selectedTeam !== 'All' && act.teamId !== selectedTeam) return false;
      if (selectedStatus !== 'All' && act.status !== selectedStatus) return false;
      if (startYearFilter !== 'All' && String(act.yearStartEC) !== startYearFilter) return false;
      if (onlyDelayed && (!act.underPerformanceReason || act.underPerformanceReason.trim().length === 0)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = act.title.toLowerCase().includes(q);
        const matchCode = act.code.toLowerCase().includes(q);
        const matchReason = (act.underPerformanceReason || '').toLowerCase().includes(q);
        const matchPI = act.principalInvestigator.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchReason && !matchPI) return false;
      }
      return true;
    });
  }, [lrdActivities, selectedCenter, selectedTeam, selectedStatus, startYearFilter, onlyDelayed, searchQuery]);

  const handleExportCSV = () => {
    const headers = [
      'Center',
      'Team',
      'Title',
      'Status',
      'Year Start (EC)',
      'Year Comp (EC)',
      'Pre-2019 Perf %',
      'Target 2019 %',
      'Quarter Plan',
      'Quarter Perf',
      'Quarter %',
      'Plan Till Quarter',
      'Perf Till Quarter',
      'Performance from 2019 Plan %',
      'Overall Performance %',
      'Reason for Underperformance'
    ];

    const rows = filteredActivities.map(a => [
      `"${centers.find(c => c.id === a.centerId)?.name || a.centerId}"`,
      `"${teams.find(t => t.id === a.teamId)?.code || a.teamId}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      a.status,
      a.yearStartEC || a.startDate,
      a.yearCompletionEC || a.endDate,
      a.performanceBeforeYearPercent || 0,
      a.targetCurrentYearPercent || 0,
      a.quarterPlan || 0,
      a.quarterPerformance || 0,
      a.quarterPerformancePercent || 0,
      a.planTillQuarter || 0,
      a.performanceTillQuarter || 0,
      a.performanceFromYearPlanPercent || 0,
      a.overallPerformancePercent || a.progressPercent || 0,
      `"${(a.underPerformanceReason || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IQQO_LRD_2019_Livestock_Action_Plan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb / Return Bar */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <button
          onClick={() => setActiveTab('directorates')}
          className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-semibold transition-colors"
        >
          <span>← Back to Directorates & Teams</span>
        </button>
        <div className="flex items-center gap-3 text-stone-500">
          <button
            onClick={() => setActiveTab('natural-resources')}
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            NRRD Action Plan (328 acts)
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveTab('overview')}
            className="hover:text-stone-900 transition-colors"
          >
            HQ Overview
          </button>
          <span>·</span>
          <button
            onClick={() => setActiveTab('activities')}
            className="hover:text-stone-900 transition-colors"
          >
            All Activities Board
          </button>
        </div>
      </div>

      {/* Institutional Directorate Banner */}
      <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-7 border border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded uppercase tracking-wider">
                IQQO 2019 EFY Action Plan
              </span>
              <span className="font-mono text-xs text-amber-400 font-semibold">
                LRD · Livestock Research Process
              </span>
              <span className="text-stone-400 text-xs hidden sm:inline">· 12 Research Centers</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Livestock Research Directorate Action Plan & Performance Portfolio
            </h1>
            <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
              Official institutional tracking of 286 livestock research activities across 12 research centers.
              Monitoring performance of Dairy & Beef Cattle, Apiculture & Honeybees, Animal Feeds & Forage,
              Small Ruminants, Poultry, and Fisheries & Aquaculture.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export LRD Action Plan CSV</span>
            </button>
          </div>
        </div>

        {/* High-Level Directorate KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-[11px] text-stone-400 font-medium">Total Activities</div>
            <div className="text-2xl font-bold font-mono text-white mt-0.5 tabular-nums">
              {metrics.total}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Across 12 Centers</div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-[11px] text-stone-400 font-medium">Ongoing Activities</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
              {metrics.ongoingCount}
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Avg {metrics.avgOngoing}% Overall</div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-[11px] text-stone-400 font-medium">New Approved (2019)</div>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-0.5 tabular-nums">
              {metrics.newCount}
            </div>
            <div className="text-[10px] text-sky-400/80 mt-1">Avg {metrics.avgNew}% Progress</div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-[11px] text-stone-400 font-medium">Overall Performance</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5 tabular-nums">
              {metrics.avgOverall}%
            </div>
            <div className="text-[10px] text-amber-400/80 mt-1">Institution wide</div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-[11px] text-stone-400 font-medium">Specialized Teams</div>
            <div className="text-2xl font-bold font-mono text-white mt-0.5 tabular-nums">
              6
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Feeds, Dairy, Bees, etc.</div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div className="text-[11px] text-stone-400 font-medium">Bottleneck Alerts</div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-0.5 tabular-nums">
              {metrics.delayedCount}
            </div>
            <div className="text-[10px] text-rose-400/80 mt-1">Documented constraints</div>
          </div>
        </div>

        {/* Specialized Teams Quick-Filter Row */}
        <div className="pt-2 border-t border-stone-800">
          <div className="text-[11px] uppercase font-mono tracking-wider text-stone-400 mb-2">
            Research Process Teams (Click to Filter):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {teams.map(team => {
              const count = team.id === 'All' ? lrdActivities.length : (metrics.teamCounts[team.id] || 0);
              const isSelected = selectedTeam === team.id;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team.id)}
                  className={`p-2.5 rounded-lg text-left transition-all border text-xs ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-xs'
                      : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300 border-stone-700/80'
                  }`}
                >
                  <div className="font-mono text-[10px] truncate">{team.code}</div>
                  <div className="text-xs truncate font-semibold mt-0.5">{team.name}</div>
                  <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-stone-900 font-bold' : 'text-stone-400'}`}>
                    {count} activities
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Filter Livestock Portfolio ({filteredActivities.length} matching)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCenter('All');
                setSelectedTeam('All');
                setSelectedStatus('All');
                setStartYearFilter('All');
                setOnlyDelayed(false);
                setSearchQuery('');
              }}
              className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2"
            >
              Reset Filters
            </button>
            <div className="border-l border-stone-200 pl-2 flex items-center gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2 py-1 text-xs font-medium rounded ${viewMode === 'table' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2 py-1 text-xs font-medium rounded ${viewMode === 'cards' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                Cards View
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 text-xs">
          {/* Center Selector */}
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Research Center ({lrdCenterIds.length})
            </label>
            <select
              value={selectedCenter}
              onChange={e => setSelectedCenter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All 12 Centers</option>
              {lrdCenterIds.map(cId => {
                const centerObj = centers.find(c => c.id === cId);
                const count = lrdActivities.filter(a => a.centerId === cId).length;
                return (
                  <option key={cId} value={cId}>
                    {centerObj?.name || cId} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Research Team Selector */}
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Livestock Team
            </label>
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All 6 Research Teams</option>
              {teams.filter(t => t.id !== 'All').map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({lrdActivities.filter(a => a.teamId === t.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Activity Status Selector */}
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Activity Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Ongoing ({lrdActivities.filter(a => a.status === 'Ongoing').length})</option>
              <option value="New">New Approved ({lrdActivities.filter(a => a.status === 'New').length})</option>
              <option value="Extended">Extended ({lrdActivities.filter(a => a.status === 'Extended').length})</option>
              <option value="Discontinued">Discontinued ({lrdActivities.filter(a => a.status === 'Discontinued').length})</option>
            </select>
          </div>

          {/* Year Start EC Selector */}
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Start Year (EC)
            </label>
            <select
              value={startYearFilter}
              onChange={e => setStartYearFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Inception Years</option>
              {startYears.map(yr => (
                <option key={yr} value={yr}>
                  {yr} EC ({lrdActivities.filter(a => String(a.yearStartEC) === yr).length})
                </option>
              ))}
            </select>
          </div>

          {/* Text Search */}
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Search Topic or Code
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Title, PI, code..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bottleneck checkbox quick toggle */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-stone-700">
            <input
              type="checkbox"
              checked={onlyDelayed}
              onChange={e => setOnlyDelayed(e.target.checked)}
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Show only activities with documented bottlenecks/delays ({delayedActivities.length})</span>
            </span>
          </label>

          <span className="text-[11px] text-stone-500 font-mono">
            Showing {filteredActivities.length} of {lrdActivities.length} activities
          </span>
        </div>
      </div>

      {/* Main Content: Table or Cards View */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-stone-200 space-y-3">
          <Layers className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="text-sm font-bold text-stone-700">No matching livestock activities found</h3>
          <p className="text-xs text-stone-500">
            Adjust your filters or search terms to display research trials.
          </p>
          <button
            onClick={() => {
              setSelectedCenter('All');
              setSelectedTeam('All');
              setSelectedStatus('All');
              setStartYearFilter('All');
              setOnlyDelayed(false);
              setSearchQuery('');
            }}
            className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Activity & Details</th>
                  <th className="py-3 px-2">Center</th>
                  <th className="py-3 px-2">Team</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Duration (EC)</th>
                  <th className="py-3 px-2 text-right">Pre-2019 %</th>
                  <th className="py-3 px-2 text-right">Target '19 %</th>
                  <th className="py-3 px-2 text-right">Qtr Plan / Perf</th>
                  <th className="py-3 px-2 text-right">Qtr %</th>
                  <th className="py-3 px-2 text-right">Till Qtr %</th>
                  <th className="py-3 px-3 text-right">Overall %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredActivities.map((act) => {
                  const centerObj = centers.find(c => c.id === act.centerId);
                  const teamObj = teams.find(t => t.id === act.teamId);
                  const hasReason = !!act.underPerformanceReason && act.underPerformanceReason.trim().length > 0;

                  return (
                    <tr
                      key={act.id}
                      onClick={() => setSelectedActivity(act)}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Title & Info */}
                      <td className="py-3 px-3 max-w-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-stone-500 font-bold">
                              {act.code}
                            </span>
                          </div>
                          <div className="font-medium text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2">
                            {act.title}
                          </div>
                          {hasReason && (
                            <div className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3 shrink-0 text-rose-600" />
                              <span className="font-medium line-clamp-1">
                                Constraint: {act.underPerformanceReason}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Center */}
                      <td className="py-3 px-2 whitespace-nowrap text-stone-700 font-medium">
                        {centerObj?.shortCode || centerObj?.name?.split(' ')[0] || act.centerId}
                      </td>

                      {/* Team */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span className="font-mono text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                          {teamObj?.code || act.teamId}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            act.status === 'Ongoing'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : act.status === 'New'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : act.status === 'Extended'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {act.status}
                        </span>
                      </td>

                      {/* Duration EC */}
                      <td className="py-3 px-2 whitespace-nowrap font-mono text-[11px] text-stone-600">
                        {act.yearStartEC || '-'} – {act.yearCompletionEC || '-'}
                      </td>

                      {/* Pre-2019 baseline */}
                      <td className="py-3 px-2 text-right font-mono tabular-nums text-stone-600">
                        {act.performanceBeforeYearPercent !== undefined ? `${act.performanceBeforeYearPercent}%` : '-'}
                      </td>

                      {/* Target 2019 */}
                      <td className="py-3 px-2 text-right font-mono tabular-nums text-stone-800 font-medium">
                        {act.targetCurrentYearPercent !== undefined ? `${act.targetCurrentYearPercent}%` : '-'}
                      </td>

                      {/* Quarter Plan / Performance */}
                      <td className="py-3 px-2 text-right font-mono tabular-nums text-stone-600 whitespace-nowrap">
                        {act.quarterPlan !== undefined ? `${act.quarterPerformance || 0} / ${act.quarterPlan}` : '-'}
                      </td>

                      {/* Quarter % */}
                      <td className="py-3 px-2 text-right font-mono tabular-nums font-semibold">
                        <span className={
                          (act.quarterPerformancePercent || 0) >= 100
                            ? 'text-emerald-700'
                            : (act.quarterPerformancePercent || 0) > 0
                            ? 'text-amber-700'
                            : 'text-stone-400'
                        }>
                          {act.quarterPerformancePercent !== undefined ? `${act.quarterPerformancePercent}%` : '-'}
                        </span>
                      </td>

                      {/* Till Quarter % */}
                      <td className="py-3 px-2 text-right font-mono tabular-nums text-stone-700">
                        {act.performanceFromYearPlanPercent !== undefined ? `${act.performanceFromYearPlanPercent}%` : '-'}
                      </td>

                      {/* Overall % */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono font-bold text-stone-900 tabular-nums">
                            {act.overallPerformancePercent !== undefined ? act.overallPerformancePercent : act.progressPercent}%
                          </span>
                          <div className="w-12 bg-stone-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${Math.min(100, act.overallPerformancePercent || act.progressPercent || 0)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((act) => {
            const centerObj = centers.find(c => c.id === act.centerId);
            const teamObj = teams.find(t => t.id === act.teamId);
            const hasReason = !!act.underPerformanceReason && act.underPerformanceReason.trim().length > 0;

            return (
              <div
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className="bg-white p-4 rounded-lg border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-3 text-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-stone-500 font-bold">
                      {act.code}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        act.status === 'Ongoing'
                          ? 'bg-emerald-50 text-emerald-700'
                          : act.status === 'New'
                          ? 'bg-sky-50 text-sky-700'
                          : act.status === 'Extended'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-stone-900 line-clamp-3 hover:text-amber-800">
                    {act.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
                    <span className="font-medium text-stone-700">{centerObj?.name}</span>
                    <span>·</span>
                    <span className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-600">
                      {teamObj?.code}
                    </span>
                  </div>

                  {hasReason && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2 rounded text-[11px] space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-rose-900">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Documented Constraint:</span>
                      </div>
                      <p className="line-clamp-2">{act.underPerformanceReason}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-center font-mono">
                    <div className="bg-stone-50 p-1 rounded">
                      <div className="text-[9px] text-stone-400 uppercase">Start</div>
                      <div className="font-bold text-stone-700">{act.yearStartEC || '-'} EC</div>
                    </div>
                    <div className="bg-stone-50 p-1 rounded">
                      <div className="text-[9px] text-stone-400 uppercase">Comp.</div>
                      <div className="font-bold text-stone-700">{act.yearCompletionEC || '-'} EC</div>
                    </div>
                    <div className="bg-amber-50 p-1 rounded">
                      <div className="text-[9px] text-amber-700 uppercase">Overall</div>
                      <div className="font-bold text-amber-900">
                        {act.overallPerformancePercent !== undefined ? act.overallPerformancePercent : act.progressPercent}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span>Qtr Plan: {act.quarterPlan || 0}%</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      Qtr Perf: {act.quarterPerformance || 0}% ({act.quarterPerformancePercent || 0}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Center Footprint Matrix for Livestock */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Center Research Distribution across Livestock Domains
            </h3>
            <p className="text-xs text-stone-500">
              Activity density across 12 research centers implementing livestock trials
            </p>
          </div>
          <button
            onClick={() => setActiveTab('centers')}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
          >
            Center Profiles Directory →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {lrdCenterIds.map(cId => {
            const centerObj = centers.find(c => c.id === cId);
            const centerActs = lrdActivities.filter(a => a.centerId === cId);
            const ongoingCount = centerActs.filter(a => a.status === 'Ongoing').length;
            const newCount = centerActs.filter(a => a.status === 'New').length;
            const delayedCount = centerActs.filter(a => !!a.underPerformanceReason && a.underPerformanceReason.trim().length > 0).length;

            return (
              <div
                key={cId}
                onClick={() => {
                  setSelectedCenter(cId);
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedCenter === cId
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-stone-100 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                    {centerObj?.name || cId}
                  </h4>
                  <span className="font-mono text-xs font-bold bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded shrink-0">
                    {centerActs.length}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  <span>{ongoingCount} ongoing</span>
                  <span className="mx-1">·</span>
                  <span>{newCount} new</span>
                </div>
                {delayedCount > 0 && (
                  <div className="mt-2 text-[10px] text-rose-700 font-mono flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{delayedCount} documented constraints</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
