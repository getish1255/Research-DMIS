import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ResearchActivity, ActivityStatus } from '../types';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Download,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Building2,
  Trash2,
  ChevronRight
} from 'lucide-react';

export const ActivitiesManager: React.FC = () => {
  const {
    activities,
    centers,
    directorates,
    activeRole,
    currentUser,
    searchQuery,
    setSearchQuery,
    centerFilter,
    setCenterFilter,
    directorateFilter,
    setDirectorateFilter,
    statusFilter,
    setStatusFilter,
    setSelectedActivity,
    setIsNewActivityModalOpen,
    updateActivityStatus,
    deleteActivity,
    setActiveTab
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [selectedAgroEcology, setSelectedAgroEcology] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'progress' | 'code' | 'budget' | 'title'>('code');
  const [presentationFilter, setPresentationFilter] = useState<'All' | 'Will be presented' | 'Will not presented' | '2018_Completed'>('All');

  // Filtered & Sorted activities
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = act.title.toLowerCase().includes(q);
        const matchCode = act.code.toLowerCase().includes(q);
        const matchPI = act.principalInvestigator.toLowerCase().includes(q);
        const matchAgro = act.targetAgroEcology.toLowerCase().includes(q);
        const matchReason = act.nonPresentationReason?.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchPI && !matchAgro && !matchReason) return false;
      }

      // Center filter
      if (centerFilter !== 'All' && act.centerId !== centerFilter) return false;

      // Directorate filter
      if (directorateFilter !== 'All' && act.directorateId !== directorateFilter) return false;

      // Status filter
      if (statusFilter !== 'All' && act.status !== statusFilter) return false;

      // Agro ecology filter
      if (selectedAgroEcology !== 'All') {
        if (!act.targetAgroEcology.toLowerCase().includes(selectedAgroEcology.toLowerCase())) {
          return false;
        }
      }

      // 2018 Completed / Presentation Decision filter
      if (presentationFilter === '2018_Completed') {
        if (!act.presentationDecision && act.yearCompletionEC !== '2018' && act.yearCompletionEC !== 2018) return false;
      } else if (presentationFilter === 'Will be presented') {
        if (act.presentationDecision !== 'Will be presented') return false;
      } else if (presentationFilter === 'Will not presented') {
        if (act.presentationDecision !== 'Will not presented') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'progress') return b.progressPercent - a.progressPercent;
      if (sortBy === 'budget') return b.budgetAllocatedETB - a.budgetAllocatedETB;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return a.code.localeCompare(b.code);
    });
  }, [activities, searchQuery, centerFilter, directorateFilter, statusFilter, selectedAgroEcology, sortBy, presentationFilter]);

  const formatETB = (amount: number) => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M ETB`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k ETB`;
    return `${amount.toLocaleString()} ETB`;
  };

  const statusColumns: ActivityStatus[] = ['New', 'Ongoing', 'Extended', 'Completed', 'Discontinued'];

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case 'Ongoing': return 'border-emerald-500 text-emerald-800 bg-emerald-50/70';
      case 'New': return 'border-sky-500 text-sky-800 bg-sky-50/70';
      case 'Extended': return 'border-amber-500 text-amber-800 bg-amber-50/70';
      case 'Completed': return 'border-indigo-500 text-indigo-800 bg-indigo-50/70';
      case 'Discontinued': return 'border-stone-400 text-stone-700 bg-stone-100';
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Activity Code',
      'Title',
      'Center',
      'Directorate',
      'Status',
      'Progress %',
      'Principal Investigator / Initiators',
      'Start Year (EC)',
      'Completion Year (EC)',
      'Presentation Decision',
      'Reason If Not Presented',
      'Allocated ETB',
      'Utilized ETB',
      'Agro-Ecology'
    ];
    const rows = filteredActivities.map(a => [
      `"${a.code}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${centers.find(c => c.id === a.centerId)?.name || a.centerId}"`,
      `"${directorates.find(d => d.id === a.directorateId)?.name || a.directorateId}"`,
      a.status,
      a.progressPercent,
      `"${a.initiators || a.principalInvestigator}"`,
      `"${a.yearStartEC || a.startDate}"`,
      `"${a.yearCompletionEC || a.endDate}"`,
      `"${a.presentationDecision || ''}"`,
      `"${(a.nonPresentationReason || '').replace(/"/g, '""')}"`,
      a.budgetAllocatedETB,
      a.budgetUtilizedETB,
      `"${a.targetAgroEcology}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `iqqo_research_activities_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Filter and Controls Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by code, title, researcher, or crop..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          {/* Action buttons & View mode toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-stone-100 p-0.5 rounded-md border border-stone-200 text-xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  viewMode === 'kanban' ? 'bg-white shadow-xs font-semibold text-stone-900' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Lifecycle Board</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-xs font-semibold text-stone-900' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Data Table</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-medium bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-md flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {activeRole !== 'Viewer' && (
              <button
                onClick={() => setIsNewActivityModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-stone-950 rounded-md flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Activity</span>
              </button>
            )}
          </div>
        </div>

        {/* Multi-facet dropdown selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-stone-100 text-xs">
          {/* Center Selector */}
          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">Center ({centers.length})</label>
            <select
              value={centerFilter}
              onChange={e => setCenterFilter(e.target.value)}
              className="w-full py-1 px-2 bg-stone-50 border border-stone-200 rounded text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="All">All 18 Research Centers</option>
              {centers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Directorate Selector */}
          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">Directorate ({directorates.length})</label>
            <select
              value={directorateFilter}
              onChange={e => setDirectorateFilter(e.target.value)}
              className="w-full py-1 px-2 bg-stone-50 border border-stone-200 rounded text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="All">All Scientific Directorates</option>
              {directorates.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Lifecycle Status Selector */}
          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full py-1 px-2 bg-stone-50 border border-stone-200 rounded text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="All">All Lifecycle Statuses</option>
              <option value="New">New (Approved)</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Extended">Extended</option>
              <option value="Completed">Completed</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>

          {/* 2018 Presentation Decision Filter */}
          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">2018 Presentation</label>
            <select
              value={presentationFilter}
              onChange={e => setPresentationFilter(e.target.value as any)}
              className="w-full py-1 px-2 bg-stone-50 border border-stone-200 rounded text-xs focus:ring-1 focus:ring-emerald-600 font-medium"
            >
              <option value="All">All Presentation Status</option>
              <option value="2018_Completed">All 2018 E.C. Completed (508)</option>
              <option value="Will be presented">✓ Will be presented</option>
              <option value="Will not presented">✗ Will not presented</option>
            </select>
          </div>

          {/* Agro Ecology Selector */}
          <div>
            <label className="block text-[11px] text-stone-500 font-medium mb-1">Agro-Ecology</label>
            <select
              value={selectedAgroEcology}
              onChange={e => setSelectedAgroEcology(e.target.value)}
              className="w-full py-1 px-2 bg-stone-50 border border-stone-200 rounded text-xs focus:ring-1 focus:ring-emerald-600"
            >
              <option value="All">All Agro-Ecologies</option>
              <option value="Highland">Highland</option>
              <option value="Midland">Midland</option>
              <option value="Lowland">Lowland</option>
              <option value="Pastoral">Pastoral / Arid</option>
            </select>
          </div>
        </div>

        {/* Natural Resources Directorate Action Plan Contextual Link */}
        {directorateFilter === 'natural-resources' && (
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <span className="font-bold font-mono text-[11px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                NRRD 2019 EFY
              </span>
              <span>Dedicated quarterly action plan performance distribution available for all 328 activities across 12 centers.</span>
            </div>
            <button
              onClick={() => setActiveTab('natural-resources')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline whitespace-nowrap shrink-0"
            >
              Launch NRRD Performance Matrix →
            </button>
          </div>
        )}

        {/* Livestock Research Directorate Action Plan Contextual Link */}
        {directorateFilter === 'livestock-research' && (
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <span className="font-bold font-mono text-[11px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                LRD 2019 EFY
              </span>
              <span>Dedicated quarterly action plan performance distribution available for all 286 activities across 12 centers.</span>
            </div>
            <button
              onClick={() => setActiveTab('livestock-research')}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline whitespace-nowrap shrink-0"
            >
              Launch LRD Performance Matrix →
            </button>
          </div>
        )}

        {/* Filter results info */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
          <span>
            Showing <strong className="text-stone-800 font-mono tabular-nums">{filteredActivities.length}</strong> of{' '}
            <strong className="text-stone-800 font-mono tabular-nums">{activities.length}</strong> activities
          </span>
          {(centerFilter !== 'All' || directorateFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setCenterFilter('All');
                setDirectorateFilter('All');
                setStatusFilter('All');
                setSelectedAgroEcology('All');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-900 underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
          {statusColumns.map(status => {
            const columnActs = filteredActivities.filter(a => a.status === status);
            return (
              <div
                key={status}
                className="bg-stone-100/90 rounded-lg border border-stone-200 flex flex-col max-h-[85vh]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-stone-200 bg-stone-50 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-800">{status}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded tabular-nums">
                    {columnActs.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[140px]">
                  {columnActs.length === 0 ? (
                    <div className="text-center py-8 text-stone-400 text-xs italic">
                      No activities in {status}
                    </div>
                  ) : (
                    columnActs.map(act => {
                      const center = centers.find(c => c.id === act.centerId);
                      const dir = directorates.find(d => d.id === act.directorateId);

                      return (
                        <div
                          key={act.id}
                          onClick={() => setSelectedActivity(act)}
                          className="bg-white p-3 rounded-md border border-stone-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
                        >
                          {/* Code & Center Tag */}
                          <div className="flex items-start justify-between gap-1 text-[11px]">
                            <span className="font-mono font-bold text-stone-800">{act.code}</span>
                            <span className="text-stone-500 truncate max-w-[100px] text-right">
                              {center?.shortCode || center?.name}
                            </span>
                          </div>

                          {/* 2018 E.C. Presentation Decision Badge if applicable */}
                          {act.presentationDecision && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                act.presentationDecision === 'Will be presented'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {act.presentationDecision === 'Will be presented' ? '✓ Will be presented' : '✗ Will not presented'}
                              </span>
                              <span className="text-[10px] font-mono text-stone-500">2018 E.C.</span>
                            </div>
                          )}

                          {/* Activity Title */}
                          <h4 className="text-xs font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                            {act.title}
                          </h4>

                          {/* Directorate & PI */}
                          <div className="text-[11px] text-stone-500 space-y-0.5">
                            <div className="truncate text-emerald-800 font-medium">{dir?.code || dir?.name}</div>
                            <div className="truncate">PI: {act.principalInvestigator}</div>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1 pt-1 border-t border-stone-100">
                            <div className="flex justify-between text-[11px] text-stone-500 font-mono tabular-nums">
                              <span>Progress</span>
                              <span className="font-semibold text-stone-800">{act.progressPercent}%</span>
                            </div>
                            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  act.status === 'Completed' ? 'bg-indigo-600' :
                                  act.status === 'Extended' ? 'bg-amber-500' :
                                  'bg-emerald-600'
                                }`}
                                style={{ width: `${act.progressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Budget & Milestones Footer */}
                          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 font-mono tabular-nums">
                            <span>{formatETB(act.budgetAllocatedETB)}</span>
                            <span>
                              {act.milestones.filter(m => m.completed).length}/{act.milestones.length} ms
                            </span>
                          </div>

                          {/* Quick Admin/Researcher Status Transition Affordance */}
                          {activeRole !== 'Viewer' && (
                            <div
                              onClick={e => e.stopPropagation()}
                              className="pt-1 border-t border-stone-100 flex items-center justify-between text-[10px]"
                            >
                              <span className="text-stone-400">Move:</span>
                              <select
                                value={act.status}
                                onChange={e => updateActivityStatus(act.id, e.target.value as ActivityStatus)}
                                className="bg-stone-50 border border-stone-200 rounded px-1 py-0.5 text-stone-700 text-[10px]"
                              >
                                {statusColumns.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Data Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Activity Code</th>
                  <th className="py-2.5 px-3">Title & Focus</th>
                  <th className="py-2.5 px-3">Center</th>
                  <th className="py-2.5 px-3">Directorate</th>
                  <th className="py-2.5 px-3">PI</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Progress</th>
                  <th className="py-2.5 px-3 text-right">Budget (ETB)</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-stone-400 italic">
                      No research activities match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map(act => {
                    const center = centers.find(c => c.id === act.centerId);
                    const dir = directorates.find(d => d.id === act.directorateId);

                    return (
                      <tr
                        key={act.id}
                        onClick={() => setSelectedActivity(act)}
                        className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-800 whitespace-nowrap">
                          {act.code}
                        </td>
                        <td className="py-2.5 px-3 max-w-sm">
                          <div className="font-medium text-stone-900 line-clamp-1">{act.title}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span>{act.targetAgroEcology}</span>
                            {act.presentationDecision && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                act.presentationDecision === 'Will be presented'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {act.presentationDecision}
                              </span>
                            )}
                            {act.nonPresentationReason && (
                              <span className="text-[10px] text-amber-800 italic truncate max-w-[180px]" title={act.nonPresentationReason}>
                                · {act.nonPresentationReason}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-stone-700">
                          {center?.name}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-emerald-800 font-medium">
                          {dir?.name}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-stone-700">
                          {act.principalInvestigator}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getStatusColor(act.status)}`}>
                            {act.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                          <div className="font-semibold text-stone-800">{act.progressPercent}%</div>
                          <div className="text-[10px] text-stone-400">
                            {act.milestones.filter(m => m.completed).length}/{act.milestones.length} ms
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                          <div className="font-medium text-stone-800">{formatETB(act.budgetAllocatedETB)}</div>
                          <div className="text-[10px] text-stone-500">{formatETB(act.budgetUtilizedETB)} spent</div>
                        </td>
                        <td
                          className="py-2.5 px-3 text-center whitespace-nowrap"
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedActivity(act)}
                              className="text-emerald-700 hover:text-emerald-900 p-1"
                              title="View Details"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {activeRole === 'Administrator' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete activity ${act.code}?`)) {
                                    deleteActivity(act.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete Activity (Admin Only)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
