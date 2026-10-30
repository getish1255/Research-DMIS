import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ResearchActivity, ActivityStatus } from '../types';
import {
  Sprout,
  Filter,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const NaturalResourcesDashboard: React.FC = () => {
  const {
    activities,
    centers,
    setSelectedActivity,
    setActiveTab,
    setCenterFilter
  } = useApp();

  // Filter only Natural Resources Directorate activities
  const nrrdActivities = useMemo(() => {
    return activities.filter(a => a.directorateId === 'natural-resources');
  }, [activities]);

  const [selectedCenter, setSelectedCenter] = useState<string>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyDelayed, setOnlyDelayed] = useState<boolean>(false);
  const [startYearFilter, setStartYearFilter] = useState<string>('All');

  // Centers present in NRRD data
  const nrrdCenterIds = useMemo(() => {
    return Array.from(new Set(nrrdActivities.map(a => a.centerId)));
  }, [nrrdActivities]);

  // Teams in NRRD data
  const teams = [
    { id: 'All', name: 'All 4 Teams', code: 'ALL' },
    { id: 'team-sfi', name: 'Soil Fertility Improvement (SFI)', code: 'SFI' },
    { id: 'team-agroforestry', name: 'Agroforestry & Forest Resources', code: 'Agroforestry' },
    { id: 'team-swc', name: 'Soil & Water Conservation (SWC)', code: 'SWC' },
    { id: 'team-srs', name: 'Soil Resource Survey & GIS Mapping (SRS)', code: 'SRS' },
  ];

  // Underperformance reasons extracted
  const delayedActivities = useMemo(() => {
    return nrrdActivities.filter(a => !!a.underPerformanceReason && a.underPerformanceReason.trim().length > 0);
  }, [nrrdActivities]);

  // Metrics
  const metrics = useMemo(() => {
    const total = nrrdActivities.length;
    const ongoing = nrrdActivities.filter(a => a.status === 'Ongoing');
    const newCount = nrrdActivities.filter(a => a.status === 'New');
    const extended = nrrdActivities.filter(a => a.status === 'Extended');
    const discontinued = nrrdActivities.filter(a => a.status === 'Discontinued');

    const avgOverall = total > 0
      ? (nrrdActivities.reduce((s, a) => s + (a.overallPerformancePercent || a.progressPercent || 0), 0) / total).toFixed(1)
      : '0';

    const avgOngoing = ongoing.length > 0
      ? (ongoing.reduce((s, a) => s + (a.overallPerformancePercent || a.progressPercent || 0), 0) / ongoing.length).toFixed(1)
      : '0';

    const avgNew = newCount.length > 0
      ? (newCount.reduce((s, a) => s + (a.overallPerformancePercent || a.progressPercent || 0), 0) / newCount.length).toFixed(1)
      : '0';

    // Team counts
    const sfiCount = nrrdActivities.filter(a => a.teamId === 'team-sfi').length;
    const agroCount = nrrdActivities.filter(a => a.teamId === 'team-agroforestry').length;
    const swcCount = nrrdActivities.filter(a => a.teamId === 'team-swc').length;
    const srsCount = nrrdActivities.filter(a => a.teamId === 'team-srs').length;

    return {
      total,
      ongoingCount: ongoing.length,
      newCount: newCount.length,
      extendedCount: extended.length,
      discontinuedCount: discontinued.length,
      avgOverall,
      avgOngoing,
      avgNew,
      sfiCount,
      agroCount,
      swcCount,
      srsCount,
      delayedCount: delayedActivities.length
    };
  }, [nrrdActivities, delayedActivities]);

  // Filtered list
  const filteredActivities = useMemo(() => {
    return nrrdActivities.filter(act => {
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
        if (!matchTitle && !matchCode && !matchReason) return false;
      }
      return true;
    });
  }, [nrrdActivities, selectedCenter, selectedTeam, selectedStatus, startYearFilter, onlyDelayed, searchQuery]);

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
    link.setAttribute('download', `IQQO_NRRD_2019_Action_Plan_${new Date().toISOString().split('T')[0]}.csv`);
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
            onClick={() => setActiveTab('livestock-research')}
            className="text-stone-600 hover:text-stone-900 transition-colors"
          >
            LRD Action Plan (286 acts)
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
            All Activities
          </button>
        </div>
      </div>

      {/* Institutional Directorate Banner */}
      <div className="bg-emerald-950 text-white rounded-xl p-6 sm:p-7 border border-emerald-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
              <span>Natural Resource Research Directorate (NRRD)</span>
              <span aria-hidden="true">·</span>
              <span>2019 EC Action Plan Performance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              IQQO Funded Natural Resource Research Activities System
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Tracking 328 research activities across 12 research centers by status, starting year,
              year of completion, and quarterly percentage distribution of action plan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export NRRD 2019 CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Core Teams Segmented Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-800/80 text-xs">
          <div
            onClick={() => setSelectedTeam(selectedTeam === 'team-sfi' ? 'All' : 'team-sfi')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedTeam === 'team-sfi'
                ? 'bg-emerald-800 border-emerald-400 text-white'
                : 'bg-emerald-900/40 border-emerald-800 text-emerald-200 hover:bg-emerald-900/80'
            }`}
          >
            <div className="font-mono font-bold text-white text-xs">SFI Team</div>
            <div className="text-[11px] text-emerald-300">Soil Fertility Improvement</div>
            <div className="mt-1 font-mono text-sm font-bold text-white tabular-nums">{metrics.sfiCount} activities</div>
          </div>

          <div
            onClick={() => setSelectedTeam(selectedTeam === 'team-agroforestry' ? 'All' : 'team-agroforestry')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedTeam === 'team-agroforestry'
                ? 'bg-emerald-800 border-emerald-400 text-white'
                : 'bg-emerald-900/40 border-emerald-800 text-emerald-200 hover:bg-emerald-900/80'
            }`}
          >
            <div className="font-mono font-bold text-white text-xs">Agroforestry Team</div>
            <div className="text-[11px] text-emerald-300">Agroforestry & Forests</div>
            <div className="mt-1 font-mono text-sm font-bold text-white tabular-nums">{metrics.agroCount} activities</div>
          </div>

          <div
            onClick={() => setSelectedTeam(selectedTeam === 'team-swc' ? 'All' : 'team-swc')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedTeam === 'team-swc'
                ? 'bg-emerald-800 border-emerald-400 text-white'
                : 'bg-emerald-900/40 border-emerald-800 text-emerald-200 hover:bg-emerald-900/80'
            }`}
          >
            <div className="font-mono font-bold text-white text-xs">SWC Team</div>
            <div className="text-[11px] text-emerald-300">Soil & Water Conservation</div>
            <div className="mt-1 font-mono text-sm font-bold text-white tabular-nums">{metrics.swcCount} activities</div>
          </div>

          <div
            onClick={() => setSelectedTeam(selectedTeam === 'team-srs' ? 'All' : 'team-srs')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedTeam === 'team-srs'
                ? 'bg-emerald-800 border-emerald-400 text-white'
                : 'bg-emerald-900/40 border-emerald-800 text-emerald-200 hover:bg-emerald-900/80'
            }`}
          >
            <div className="font-mono font-bold text-white text-xs">SRS Team</div>
            <div className="text-[11px] text-emerald-300">Soil Resource Survey & GIS</div>
            <div className="mt-1 font-mono text-sm font-bold text-white tabular-nums">{metrics.srsCount} activities</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Total NRRD Activities</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-stone-900">{metrics.total}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Across 12 Centers</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Ongoing Portfolio</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700">{metrics.ongoingCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Avg Perf: {metrics.avgOngoing}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">New 2019 Approvals</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-sky-700">{metrics.newCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Avg Perf: {metrics.avgNew}%</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Extended Projects</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-amber-700">{metrics.extendedCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Residual harvest data</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Average Performance</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-stone-900">{metrics.avgOverall}%</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Institute benchmark: 100%</div>
        </div>

        <div
          onClick={() => setOnlyDelayed(!onlyDelayed)}
          className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
            onlyDelayed ? 'bg-amber-50 border-amber-400' : 'bg-white border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="text-xs text-amber-700 font-medium flex items-center justify-between">
            <span>Implementation Issues</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-amber-800">{metrics.delayedCount}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">
            {onlyDelayed ? 'Showing delayed only' : 'Click to filter constraints'}
          </div>
        </div>
      </div>

      {/* 12 Research Centers Quick Selector Matrix */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Natural Resources Activities Distribution by Center (12 Centers)
          </h3>
          <span className="text-[11px] text-stone-500">Click a center to filter table below</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {nrrdCenterIds.map(cid => {
            const centerObj = centers.find(c => c.id === cid);
            const count = nrrdActivities.filter(a => a.centerId === cid).length;
            const isSelected = selectedCenter === cid;

            return (
              <button
                key={cid}
                onClick={() => setSelectedCenter(isSelected ? 'All' : cid)}
                className={`p-2.5 rounded-md border text-left transition-all ${
                  isSelected
                    ? 'bg-stone-900 border-stone-900 text-white font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold">{centerObj?.shortCode || cid}</span>
                  <span className={`font-mono text-xs tabular-nums ${isSelected ? 'text-emerald-400' : 'text-stone-900 font-bold'}`}>
                    {count}
                  </span>
                </div>
                <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {centerObj?.name.replace(/Agricultural Research Center|Research Center/g, 'ARC')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-3 text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by title, crop, district, or constraint reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-xs"
            />
          </div>

          {/* Reset button */}
          {(selectedCenter !== 'All' || selectedTeam !== 'All' || selectedStatus !== 'All' || startYearFilter !== 'All' || onlyDelayed || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCenter('All');
                setSelectedTeam('All');
                setSelectedStatus('All');
                setStartYearFilter('All');
                setOnlyDelayed(false);
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-900 underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">Center</label>
            <select
              value={selectedCenter}
              onChange={e => setSelectedCenter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs"
            >
              <option value="All">All 12 Centers ({nrrdActivities.length})</option>
              {nrrdCenterIds.map(cid => {
                const c = centers.find(x => x.id === cid);
                return (
                  <option key={cid} value={cid}>{c?.name || cid}</option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">Research Team</label>
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="New">New</option>
              <option value="Extended">Extended</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">Start Year (EC)</label>
            <select
              value={startYearFilter}
              onChange={e => setStartYearFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs font-mono"
            >
              <option value="All">All Start Years</option>
              <option value="2013">2013 EC</option>
              <option value="2014">2014 EC</option>
              <option value="2015">2015 EC</option>
              <option value="2016">2016 EC</option>
              <option value="2017">2017 EC</option>
              <option value="2018">2018 EC</option>
              <option value="2019">2019 EC</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
          <span>
            Displaying <strong className="text-stone-800 font-mono tabular-nums">{filteredActivities.length}</strong> of{' '}
            <strong className="text-stone-800 font-mono tabular-nums">{nrrdActivities.length}</strong> activities
          </span>
          <span className="text-stone-400">Assumption: Performance when completed is 100%</span>
        </div>
      </div>

      {/* Main Authentic Natural Resource Activities Table */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100/90 border-b border-stone-200 text-stone-800 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Center & Team</th>
                <th className="py-2.5 px-3">Title of Activity</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-2 text-center">Start (EC)</th>
                <th className="py-2.5 px-2 text-center">Comp (EC)</th>
                <th className="py-2.5 px-2 text-right">Pre-2019 (%)</th>
                <th className="py-2.5 px-2 text-right">2019 Target</th>
                <th className="py-2.5 px-2 text-right">Q Plan / Perf</th>
                <th className="py-2.5 px-2 text-right">2019 Plan %</th>
                <th className="py-2.5 px-3 text-right">Overall Perf %</th>
                <th className="py-2.5 px-3">Quarter Underperformance Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-stone-400 italic">
                    No Natural Resource research activities match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredActivities.map(act => {
                  const center = centers.find(c => c.id === act.centerId);
                  const team = teams.find(t => t.id === act.teamId);

                  return (
                    <tr
                      key={act.id}
                      onClick={() => setSelectedActivity(act)}
                      className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-bold text-stone-900">{center?.shortCode || act.centerId}</div>
                        <div className="font-mono text-[11px] text-emerald-800 font-semibold">{team?.code || act.teamId}</div>
                      </td>

                      <td className="py-2.5 px-3 max-w-md">
                        <div className="font-medium text-stone-900 line-clamp-2 leading-snug">{act.title}</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">{act.code}</div>
                      </td>

                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                          act.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          act.status === 'New' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                          act.status === 'Extended' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          'bg-stone-100 text-stone-700 border-stone-300'
                        }`}>
                          {act.status}
                        </span>
                      </td>

                      <td className="py-2.5 px-2 text-center font-mono text-stone-600 whitespace-nowrap">
                        {act.yearStartEC || act.startDate}
                      </td>

                      <td className="py-2.5 px-2 text-center font-mono text-stone-600 whitespace-nowrap">
                        {act.yearCompletionEC || act.endDate}
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-stone-600 whitespace-nowrap">
                        {act.performanceBeforeYearPercent || 0}%
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-stone-800 font-semibold whitespace-nowrap">
                        {act.targetCurrentYearPercent || 0}%
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                        <span className="text-emerald-700 font-semibold">{act.quarterPerformance || 0}</span>
                        <span className="text-stone-400 mx-0.5">/</span>
                        <span className="text-stone-600">{act.quarterPlan || 0}</span>
                        <div className="text-[10px] text-stone-400">({act.quarterPerformancePercent || 0}%)</div>
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono tabular-nums font-semibold text-stone-800 whitespace-nowrap">
                        {act.performanceFromYearPlanPercent || 0}%
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        <div className="font-bold text-stone-900 text-xs">
                          {act.overallPerformancePercent || act.progressPercent || 0}%
                        </div>
                        <div className="w-16 bg-stone-100 h-1 rounded-full ml-auto mt-1 overflow-hidden">
                          <div
                            className={`h-full ${
                              (act.overallPerformancePercent || 0) >= 100 ? 'bg-indigo-600' :
                              (act.overallPerformancePercent || 0) >= 50 ? 'bg-emerald-600' :
                              'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, act.overallPerformancePercent || act.progressPercent || 0)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-2.5 px-3 max-w-xs">
                        {act.underPerformanceReason ? (
                          <div className="text-[11px] text-amber-800 bg-amber-50/80 p-1 rounded border border-amber-200 line-clamp-2">
                            {act.underPerformanceReason}
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">On schedule</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
