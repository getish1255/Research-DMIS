import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Printer, Download, RefreshCw, FileText, CheckCircle2, Building2 } from 'lucide-react';

export const InstitutionalReports: React.FC = () => {
  const {
    activities,
    centers,
    directorates,
    resetAllData
  } = useApp();

  const reportData = useMemo(() => {
    const total = activities.length;
    const ongoing = activities.filter(a => a.status === 'Ongoing').length;
    const completed = activities.filter(a => a.status === 'Completed').length;
    const extended = activities.filter(a => a.status === 'Extended').length;
    const discontinued = activities.filter(a => a.status === 'Discontinued').length;

    const totalAllocated = activities.reduce((s, a) => s + (a.budgetAllocatedETB || 0), 0);
    const totalSpent = activities.reduce((s, a) => s + (a.budgetUtilizedETB || 0), 0);

    const totalMilestones = activities.reduce((s, a) => s + a.milestones.length, 0);
    const completedMilestones = activities.reduce((s, a) => s + a.milestones.filter(m => m.completed).length, 0);

    const deliverables = activities.flatMap(a => a.deliverables || []);
    const varietyReleases = deliverables.filter(d => d.type === 'Variety Release');
    const journalPapers = deliverables.filter(d => d.type === 'Journal Publication');

    return {
      total,
      ongoing,
      completed,
      extended,
      discontinued,
      totalAllocated,
      totalSpent,
      totalMilestones,
      completedMilestones,
      varietyReleasesCount: varietyReleases.length,
      journalPapersCount: journalPapers.length,
    };
  }, [activities]);

  const formatETB = (amount: number) => {
    return `${amount.toLocaleString()} ETB`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-sm font-bold text-stone-900">Institutional Performance Dossier</h2>
          <p className="text-xs text-stone-500">Official executive report for IQQO Directorate General and regional partners</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive Dossier</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset portfolio activities back to realistic factory defaults?')) {
                resetAllData();
              }
            }}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Printable Institutional Dossier Sheet */}
      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-xs space-y-6 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Institutional Formal Header */}
        <div className="border-b-2 border-stone-900 pb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Inistiitiyuutii Qorannoo Qonnaa Oromiyaa (IQQO)
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-0.5">
              OROMIA AGRICULTURAL RESEARCH INSTITUTE
            </h1>
            <div className="text-xs text-stone-600 mt-1">
              Annual Scientific Portfolio Review & Research Activities Tracking Report
            </div>
          </div>
          <div className="text-right text-xs font-mono text-stone-600 shrink-0 space-y-0.5">
            <div>Report Date: {new Date().toISOString().split('T')[0]}</div>
            <div>Reference: IQQO/HQ/RRC/2026-Q1</div>
            <div>Ref & Contact: <a href="mailto:boqolo@iqqo.gov.et" className="text-emerald-700 underline font-semibold">boqolo@iqqo.gov.et</a></div>
            <div className="text-[11px] text-stone-500">Developer: <span className="font-semibold text-stone-800">Getachew Haile</span></div>
            <div>Addis Ababa / Finfinne</div>
          </div>
        </div>

        {/* Executive Summary Metrics Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            01. Institutional High-Level Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs">
            <div>
              <span className="text-stone-500 block text-[11px]">Total Activities Registered</span>
              <span className="text-lg font-bold font-mono text-stone-900">{reportData.total}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Active Ongoing Trials</span>
              <span className="text-lg font-bold font-mono text-emerald-700">{reportData.ongoing}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Completed / Released</span>
              <span className="text-lg font-bold font-mono text-indigo-700">{reportData.completed}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px]">Extended Timeline</span>
              <span className="text-lg font-bold font-mono text-amber-700">{reportData.extended}</span>
            </div>
          </div>
        </div>

        {/* Budget Execution Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            02. Financial Allocation & Execution (ETB)
          </h3>
          <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-stone-100 p-2.5 font-semibold text-stone-800">
              <div>Total Approved Allocation</div>
              <div>Cumulative Expenditure</div>
              <div>Financial Execution Rate</div>
            </div>
            <div className="grid grid-cols-3 p-3 font-mono tabular-nums bg-white border-t border-stone-200 text-xs">
              <div className="font-bold text-stone-900">{formatETB(reportData.totalAllocated)}</div>
              <div className="text-emerald-800">{formatETB(reportData.totalSpent)}</div>
              <div className="font-bold text-stone-800">
                {Math.round((reportData.totalSpent / (reportData.totalAllocated || 1)) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Directorate Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            03. Directorate Activities & Outputs
          </h3>
          <table className="w-full text-left text-xs border border-stone-200">
            <thead className="bg-stone-100 border-b border-stone-200 font-semibold text-stone-800">
              <tr>
                <th className="py-2 px-3">Directorate</th>
                <th className="py-2 px-3 text-center">Activities</th>
                <th className="py-2 px-3 text-right">Allocated Budget (ETB)</th>
                <th className="py-2 px-3 text-right">Avg Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {directorates.map(d => {
                const acts = activities.filter(a => a.directorateId === d.id);
                const alloc = acts.reduce((s, a) => s + (a.budgetAllocatedETB || 0), 0);
                const avgProg = acts.length > 0 ? Math.round(acts.reduce((s, a) => s + a.progressPercent, 0) / acts.length) : 0;

                return (
                  <tr key={d.id}>
                    <td className="py-2 px-3 font-medium text-stone-800">{d.name}</td>
                    <td className="py-2 px-3 text-center font-mono tabular-nums">{acts.length}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">{formatETB(alloc)}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold">{avgProg}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Centers Operational Rollup */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            04. 18 Research Centers Operational Matrix
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {centers.map(c => {
              const acts = activities.filter(a => a.centerId === c.id);
              return (
                <div key={c.id} className="p-2 border border-stone-200 rounded bg-stone-50/50">
                  <div className="font-bold text-stone-800 truncate">{c.shortCode} - {c.name}</div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                    {acts.length} trials ({c.agroEcology})
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formal Institutional Sign-off */}
        <div className="pt-8 border-t-2 border-stone-900 grid grid-cols-2 gap-8 text-xs text-stone-700">
          <div>
            <div className="font-bold text-stone-900">Institutional Executive Directorate</div>
            <div className="text-stone-500">Oromia Agricultural Research Institute (IQQO)</div>
            <div className="mt-8 border-b border-stone-400 w-48" />
            <div className="text-[10px] text-stone-400 mt-1">Signature & Official Stamp</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-stone-900">Research Directorate Council</div>
            <div className="text-stone-500">Quality Assurance & Coordination</div>
            <div className="mt-8 border-b border-stone-400 w-48 ml-auto" />
            <div className="text-[10px] text-stone-400 mt-1">Institutional Clearance Date</div>
          </div>
        </div>

        {/* System Administration & Contact Attribution Footnote */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] text-stone-500 font-mono">
          <div>Developer: <span className="font-semibold text-stone-800">Getachew Haile</span></div>
          <div>Reference & Official Inquiries: <a href="mailto:boqolo@iqqo.gov.et" className="text-emerald-700 underline font-semibold">boqolo@iqqo.gov.et</a></div>
          <div>IQQO Automated Research Portfolio System</div>
        </div>
      </div>
    </div>
  );
};
