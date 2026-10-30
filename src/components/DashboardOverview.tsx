import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityStatus } from '../types';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Coins,
  ArrowUpRight,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    activities,
    centers,
    directorates,
    setActiveTab,
    setCenterFilter,
    setDirectorateFilter,
    setStatusFilter,
    setSelectedActivity,
    setDrilldownCenterId,
    setDrilldownDirectorateId
  } = useApp();

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = activities.length;
    const ongoing = activities.filter(a => a.status === 'Ongoing').length;
    const completed = activities.filter(a => a.status === 'Completed').length;
    const extended = activities.filter(a => a.status === 'Extended').length;
    const newCount = activities.filter(a => a.status === 'New').length;
    const discontinued = activities.filter(a => a.status === 'Discontinued').length;

    const totalAllocated = activities.reduce((sum, a) => sum + (a.budgetAllocatedETB || 0), 0);
    const totalUtilized = activities.reduce((sum, a) => sum + (a.budgetUtilizedETB || 0), 0);
    const avgProgress = total > 0 ? Math.round(activities.reduce((sum, a) => sum + a.progressPercent, 0) / total) : 0;

    const totalMilestones = activities.reduce((sum, a) => sum + a.milestones.length, 0);
    const completedMilestones = activities.reduce(
      (sum, a) => sum + a.milestones.filter(m => m.completed).length,
      0
    );

    return {
      total,
      ongoing,
      completed,
      extended,
      newCount,
      discontinued,
      totalAllocated,
      totalUtilized,
      avgProgress,
      totalMilestones,
      completedMilestones,
      burnRatePercent: totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0
    };
  }, [activities]);

  // Center Distribution calculation
  const centerStats = useMemo(() => {
    return centers.map(center => {
      const centerActs = activities.filter(a => a.centerId === center.id);
      const activeCount = centerActs.filter(a => a.status === 'Ongoing' || a.status === 'Extended').length;
      const completedCount = centerActs.filter(a => a.status === 'Completed').length;
      return {
        center,
        total: centerActs.length,
        activeCount,
        completedCount,
      };
    }).sort((a, b) => b.total - a.total);
  }, [centers, activities]);

  // Directorate Distribution calculation
  const directorateStats = useMemo(() => {
    return directorates.map(dir => {
      const dirActs = activities.filter(a => a.directorateId === dir.id);
      const totalBudget = dirActs.reduce((s, a) => s + (a.budgetAllocatedETB || 0), 0);
      return {
        directorate: dir,
        count: dirActs.length,
        totalBudget,
      };
    }).sort((a, b) => b.count - a.count);
  }, [directorates, activities]);

  // 2018 E.C. Completed Activities Analytics
  const completed2018Stats = useMemo(() => {
    const completed2018Acts = activities.filter(a => a.presentationDecision || a.yearCompletionEC === '2018' || a.yearCompletionEC === 2018);
    const willBePresented = completed2018Acts.filter(a => a.presentationDecision === 'Will be presented').length;
    const willNotPresented = completed2018Acts.filter(a => a.presentationDecision === 'Will not presented').length;
    return {
      total: completed2018Acts.length,
      willBePresented,
      willNotPresented,
    };
  }, [activities]);

  const formatETB = (amount: number) => {
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M ETB`;
    }
    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(0)}k ETB`;
    }
    return `${amount.toLocaleString()} ETB`;
  };

  const statusConfigs: { status: ActivityStatus; label: string; count: number; colorClass: string; barColor: string }[] = [
    { status: 'Ongoing', label: 'Ongoing Trials', count: metrics.ongoing, colorClass: 'text-emerald-700 dark:text-emerald-400', barColor: 'bg-emerald-600' },
    { status: 'New', label: 'New Approved', count: metrics.newCount, colorClass: 'text-sky-700 dark:text-sky-400', barColor: 'bg-sky-500' },
    { status: 'Extended', label: 'Extended Lifecycle', count: metrics.extended, colorClass: 'text-amber-700 dark:text-amber-400', barColor: 'bg-amber-500' },
    { status: 'Completed', label: 'Completed Releases', count: metrics.completed, colorClass: 'text-indigo-700 dark:text-indigo-400', barColor: 'bg-indigo-600' },
    { status: 'Discontinued', label: 'Discontinued', count: metrics.discontinued, colorClass: 'text-stone-500', barColor: 'bg-stone-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Visual Banner with authentic IQQO Agricultural Trial Photo */}
      <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/iqqo_research_trials_1791379386907.jpg"
            alt="IQQO Agricultural Research Field Trials"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-900/40" />
        </div>

        <div className="relative p-6 sm:p-8 max-w-4xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Institutional Research Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
            Oromia Agricultural Research Institute Portfolio
          </h1>
          <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
            Real-time tracking of research activities across 18 centers and 10 scientific directorates.
            Monitoring project lifecycles from preliminary proposals to variety registration and field technology dissemination.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300">
            <span className="font-mono tabular-nums text-emerald-400 font-semibold">18 Research Centers</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="font-mono tabular-nums text-emerald-400 font-semibold">10 Scientific Directorates</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="font-mono tabular-nums text-white">Fiscal Year 2024–2026</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <button
              onClick={() => {
                setActiveTab('activities');
                setStatusFilter('All');
                setCenterFilter('All');
              }}
              className="text-emerald-300 hover:text-white underline underline-offset-4 font-medium transition-colors"
            >
              Browse All Activities →
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Tabular numerals, single-elevation, unboxed metadata) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Total Activities</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-stone-900">
            {metrics.total}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">Across 18 Centers</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Ongoing Trials</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {metrics.ongoing}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">Active in field & lab</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Completed / Released</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-indigo-700">
            {metrics.completed}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">Outputs delivered</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Extended Projects</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-amber-700">
            {metrics.extended}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">Authorized timeline</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Total Approved Budget</div>
          <div className="mt-1 text-lg font-bold font-mono tabular-nums text-stone-900">
            {formatETB(metrics.totalAllocated)}
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            {metrics.burnRatePercent}% Utilized ({formatETB(metrics.totalUtilized)})
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Average Progress</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {metrics.avgProgress}%
          </div>
          <div className="mt-1 text-[11px] text-stone-500">
            {metrics.completedMilestones}/{metrics.totalMilestones} Milestones done
          </div>
        </div>
      </div>

      {/* Lifecycle Pipeline & Budget Utilization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Pipeline Analysis */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Activity Lifecycle Distribution</h2>
              <p className="text-xs text-stone-500">Current progress state across portfolio</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('activities');
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Kanban View →
            </button>
          </div>

          <div className="space-y-3">
            {statusConfigs.map(item => {
              const percent = metrics.total > 0 ? Math.round((item.count / metrics.total) * 100) : 0;
              return (
                <div
                  key={item.status}
                  onClick={() => {
                    setStatusFilter(item.status);
                    setActiveTab('activities');
                  }}
                  className="cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-stone-700 group-hover:text-emerald-700 transition-colors">
                      {item.label}
                    </span>
                    <span className="font-mono tabular-nums text-stone-500">
                      {item.count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.barColor} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 flex justify-between">
            <span>Milestone Completion Velocity:</span>
            <span className="font-mono font-medium text-stone-800">
              {Math.round((metrics.completedMilestones / (metrics.totalMilestones || 1)) * 100)}% achieved
            </span>
          </div>
        </div>

        {/* Budget Allocation vs Expenditure Burn */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Financial Utilization by Directorate</h2>
              <p className="text-xs text-stone-500">Allocated budget vs operational execution (ETB)</p>
            </div>
            <div className="text-xs font-mono tabular-nums text-stone-500">
              Total: {formatETB(metrics.totalAllocated)}
            </div>
          </div>

          <div className="space-y-2.5">
            {directorateStats.slice(0, 5).map(({ directorate, count, totalBudget }) => {
              const dirActs = activities.filter(a => a.directorateId === directorate.id);
              const dirSpent = dirActs.reduce((s, a) => s + (a.budgetUtilizedETB || 0), 0);
              const burnPercent = totalBudget > 0 ? Math.min(100, Math.round((dirSpent / totalBudget) * 100)) : 0;

              return (
                <div key={directorate.id} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-800">{directorate.name}</span>
                      <span className="text-stone-400 font-mono text-[11px]">{count} acts</span>
                    </div>
                    <div className="text-right font-mono tabular-nums text-stone-600">
                      <span className="text-emerald-700 font-medium">{formatETB(dirSpent)}</span>
                      <span className="text-stone-400 mx-1">/</span>
                      <span>{formatETB(totalBudget)}</span>
                      <span className="ml-1 text-stone-500 text-[11px]">({burnPercent}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${burnPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('natural-resources')}
                className="text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                NRRD Action Plan (328 acts) →
              </button>
              <button
                onClick={() => setActiveTab('livestock-research')}
                className="text-amber-800 hover:text-amber-950 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
              >
                LRD Action Plan (286 acts) →
              </button>
            </div>
            <button
              onClick={() => setActiveTab('directorates')}
              className="text-stone-600 hover:text-stone-900 font-medium"
            >
              View All 10 Directorates →
            </button>
          </div>
        </div>
      </div>

      {/* 2018 E.C. Completed Research Activities Portfolio Card */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-850 rounded-xl border border-stone-800 text-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-600 text-stone-950 font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider">
                Official Completed Portfolio (2018 E.C.)
              </span>
              <span className="text-xs font-mono text-stone-400">
                Oromia Agricultural Research Institute
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Completed Research Activities Across All 18 Centers & HQ
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Consolidated dataset of {completed2018Stats.total} completed scientific trials across Crop, Crop Protection, Coffee & Tea, Livestock, Natural Resources, SEAE, Agricultural Engineering, and Food Science.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400 pt-1">
              <span>Developer: <span className="text-stone-200 font-semibold">Getachew Haile</span></span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span>Ref & Contact: <a href="mailto:boqolo@iqqo.gov.et" className="text-emerald-400 underline font-mono">boqolo@iqqo.gov.et</a></span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="bg-stone-800/90 border border-stone-700/80 rounded-lg p-3 text-center min-w-[120px]">
              <div className="text-[11px] text-stone-400">Will be presented</div>
              <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                {completed2018Stats.willBePresented}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-medium">Cleared for RRC</div>
            </div>

            <div className="bg-stone-800/90 border border-stone-700/80 rounded-lg p-3 text-center min-w-[120px]">
              <div className="text-[11px] text-stone-400">Will not presented</div>
              <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                {completed2018Stats.willNotPresented}
              </div>
              <div className="text-[10px] text-amber-400/80 font-medium">Breeding / Lab Phase</div>
            </div>

            <button
              onClick={() => {
                setActiveTab('activities');
                setStatusFilter('Completed');
              }}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              <span>Explore 2018 Completed ({completed2018Stats.total}) →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center Portfolio Matrix (18 Centers Overview) */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Regional Research Centers Portfolio (18 Centers)</h2>
            <p className="text-xs text-stone-500">Distribution of active research trials and institutional outputs</p>
          </div>
          <button
            onClick={() => setActiveTab('centers')}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
          >
            Explore All Center Profiles →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {centerStats.slice(0, 9).map(({ center, total, activeCount, completedCount }) => (
            <div
              key={center.id}
              onClick={() => {
                setDrilldownCenterId(center.id);
                setCenterFilter(center.id);
                setActiveTab('activities');
              }}
              className="p-3 rounded-md border border-stone-100 hover:border-emerald-300 hover:bg-stone-50/50 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-800 line-clamp-1">{center.name}</h3>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    <span>{center.zone}</span>
                    <span aria-hidden="true" className="mx-1">·</span>
                    <span>{center.agroEcology}</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {total}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100 pt-1.5">
                <span>{activeCount} active trials</span>
                <span>{completedCount} completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Impact Ongoing Activities Spotlight */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Featured Research Activities in Progress</h2>
            <p className="text-xs text-stone-500">Recent field experiments with high agricultural impact</p>
          </div>
          <button
            onClick={() => {
              setActiveTab('activities');
              setStatusFilter('Ongoing');
            }}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
          >
            Filter All Ongoing ({metrics.ongoing}) →
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {activities.slice(0, 5).map(act => {
            const center = centers.find(c => c.id === act.centerId);
            const dir = directorates.find(d => d.id === act.directorateId);

            return (
              <div
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-stone-50/60 p-2 rounded transition-colors cursor-pointer"
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-stone-700">{act.code}</span>
                    <span aria-hidden="true" className="text-stone-400">·</span>
                    <span className="text-stone-500">{center?.name}</span>
                    <span aria-hidden="true" className="text-stone-400">·</span>
                    <span className="text-emerald-700 font-medium">{dir?.name}</span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 hover:text-emerald-700 transition-colors">
                    {act.title}
                  </h3>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2">
                    <span>PI: {act.principalInvestigator}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Budget: {formatETB(act.budgetAllocatedETB)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Target: {act.targetAgroEcology}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-stone-800 tabular-nums">
                      {act.progressPercent}%
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {act.status}
                    </div>
                  </div>
                  <div className="w-16 bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        act.status === 'Completed' ? 'bg-indigo-600' :
                        act.status === 'Extended' ? 'bg-amber-500' :
                        'bg-emerald-600'
                      }`}
                      style={{ width: `${act.progressPercent}%` }}
                    />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
