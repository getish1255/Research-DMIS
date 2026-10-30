import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityStatus } from '../types';
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Building2,
  User,
  Plus,
  Coins,
  ShieldCheck,
  Check,
  ChevronDown
} from 'lucide-react';

export const ActivityDetailModal: React.FC = () => {
  const {
    selectedActivity,
    setSelectedActivity,
    centers,
    directorates,
    activeRole,
    currentUser,
    toggleMilestone,
    updateActivity,
    updateActivityStatus,
    requestExtension,
    approveExtension
  } = useApp();

  const [extensionMonths, setExtensionMonths] = useState<number>(6);
  const [extensionJustification, setExtensionJustification] = useState<string>('');
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [adminReviewNotes, setAdminReviewNotes] = useState<string>('');

  if (!selectedActivity) return null;

  const center = centers.find(c => c.id === selectedActivity.centerId);
  const directorate = directorates.find(d => d.id === selectedActivity.directorateId);

  const formatETB = (amount: number) => {
    return `${amount.toLocaleString()} ETB`;
  };

  const handleStatusChange = (newStatus: ActivityStatus) => {
    updateActivityStatus(selectedActivity.id, newStatus);
  };

  const handleExtensionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extensionJustification.trim()) return;
    requestExtension(selectedActivity.id, Number(extensionMonths), extensionJustification);
    setExtensionJustification('');
    setShowExtensionForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/70 flex items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {selectedActivity.code}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-600 font-medium">{center?.name}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-emerald-700 font-medium">{directorate?.name}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="font-mono text-stone-500">FY {selectedActivity.fiscalYear}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
              {selectedActivity.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Selector for Admins or Researchers */}
            {activeRole !== 'Viewer' ? (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-stone-500">Status:</span>
                <select
                  value={selectedActivity.status}
                  onChange={e => handleStatusChange(e.target.value as ActivityStatus)}
                  className="bg-white border border-stone-300 font-semibold rounded px-2 py-1 text-stone-800 text-xs focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="New">New (Approved)</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Extended">Extended</option>
                  <option value="Completed">Completed</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
              </div>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 text-stone-800 border border-stone-200">
                {selectedActivity.status}
              </span>
            )}

            <button
              onClick={() => setSelectedActivity(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-lg border border-stone-200">
            <div>
              <div className="text-[11px] text-stone-500">Overall Progress</div>
              <div className="text-base font-bold font-mono tabular-nums text-emerald-800">
                {selectedActivity.overallPerformancePercent || selectedActivity.progressPercent}%
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-1 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full"
                  style={{ width: `${selectedActivity.overallPerformancePercent || selectedActivity.progressPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-[11px] text-stone-500">Approved Budget</div>
              <div className="text-base font-bold font-mono tabular-nums text-stone-900">
                {formatETB(selectedActivity.budgetAllocatedETB)}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                Utilized: {formatETB(selectedActivity.budgetUtilizedETB)}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-stone-500">Duration Period</div>
              <div className="text-xs font-mono font-medium text-stone-800">
                {selectedActivity.yearStartEC ? `${selectedActivity.yearStartEC} EC` : selectedActivity.startDate}
              </div>
              <div className="text-[10px] text-stone-500">
                to {selectedActivity.yearCompletionEC ? `${selectedActivity.yearCompletionEC} EC` : selectedActivity.endDate}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-stone-500">Principal Investigator</div>
              <div className="text-xs font-semibold text-stone-900">{selectedActivity.principalInvestigator}</div>
              <div className="text-[10px] text-stone-500 font-mono">{selectedActivity.piEmail}</div>
            </div>
          </div>

          {/* Directorate 2019 Action Plan Breakdown (If available for NRRD or LRD) */}
          {(selectedActivity.yearStartEC !== undefined || selectedActivity.targetCurrentYearPercent !== undefined) && (
            <div className={`border rounded-lg p-4 space-y-3 ${
              selectedActivity.directorateId === 'livestock-research'
                ? 'border-amber-200 bg-amber-50/40'
                : 'border-emerald-200 bg-emerald-50/40'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 ${
                selectedActivity.directorateId === 'livestock-research'
                  ? 'border-amber-200/60'
                  : 'border-emerald-200/60'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    selectedActivity.directorateId === 'livestock-research'
                      ? 'text-amber-900 bg-amber-200'
                      : 'text-emerald-800 bg-emerald-100'
                  }`}>
                    {selectedActivity.directorateId === 'livestock-research'
                      ? 'LRD 2019 EFY Action Plan Metrics'
                      : 'NRRD 2019 Action Plan Metrics'}
                  </span>
                  <span className="text-xs text-stone-500">Ethiopian Calendar (EC) Tracking</span>
                </div>
                <div className={`text-xs font-mono font-bold ${
                  selectedActivity.directorateId === 'livestock-research'
                    ? 'text-amber-900'
                    : 'text-emerald-900'
                }`}>
                  Overall Performance: {selectedActivity.overallPerformancePercent || selectedActivity.progressPercent}%
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded border border-emerald-100">
                  <div className="text-[11px] text-stone-500">Pre-2019 Cumulative</div>
                  <div className="font-mono text-base font-bold text-stone-900">
                    {selectedActivity.performanceBeforeYearPercent || 0}%
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-emerald-100">
                  <div className="text-[11px] text-stone-500">2019 FY Target</div>
                  <div className="font-mono text-base font-bold text-stone-900">
                    {selectedActivity.targetCurrentYearPercent || 0}%
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-emerald-100">
                  <div className="text-[11px] text-stone-500">Quarter Plan vs Actual</div>
                  <div className="font-mono text-base font-bold text-emerald-800">
                    {selectedActivity.quarterPerformance || 0} / {selectedActivity.quarterPlan || 0}
                    <span className="text-xs font-normal text-stone-500 ml-1">
                      ({selectedActivity.quarterPerformancePercent || 0}%)
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded border border-emerald-100">
                  <div className="text-[11px] text-stone-500">From 2019 Plan</div>
                  <div className="font-mono text-base font-bold text-stone-900">
                    {selectedActivity.performanceFromYearPlanPercent || 0}%
                  </div>
                </div>
              </div>

              {selectedActivity.underPerformanceReason && (
                <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <span>Quarter Implementation Constraint / Reason for Underperformance:</span>
                  </div>
                  <p className="leading-relaxed text-amber-950 font-medium">
                    {selectedActivity.underPerformanceReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2018 E.C. Completed Activity Presentation Decision & Non-Presentation Justification */}
          {selectedActivity.presentationDecision && (
            <div className={`border rounded-lg p-4 space-y-3 ${
              selectedActivity.presentationDecision === 'Will be presented'
                ? 'border-emerald-300 bg-emerald-50/60'
                : 'border-amber-300 bg-amber-50/60'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold shadow-xs ${
                    selectedActivity.presentationDecision === 'Will be presented'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-amber-700 text-white'
                  }`}>
                    {selectedActivity.presentationDecision === 'Will be presented' ? '✓ Will be presented' : '✗ Will not presented'}
                  </span>
                  <span className="text-xs font-bold text-stone-800">
                    Oromia Agricultural Research Institute · Completed Research Activity (2018 E.C.)
                  </span>
                </div>
                <div className="text-xs font-mono font-medium text-stone-600">
                  Completion Year: {selectedActivity.yearCompletionEC || '2018'} E.C.
                </div>
              </div>

              {selectedActivity.nonPresentationReason && (
                <div className="bg-white p-3 rounded-md border border-amber-200 text-xs space-y-1 shadow-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Reason for completed but not presented:</span>
                  </div>
                  <p className="text-stone-800 leading-relaxed font-medium pl-5.5">
                    {selectedActivity.nonPresentationReason}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-white/80 p-2.5 rounded border border-stone-200/80">
                  <span className="text-[11px] text-stone-500 block">Initiators / Principal Researchers</span>
                  <span className="font-semibold text-stone-900">{selectedActivity.initiators || selectedActivity.principalInvestigator}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded border border-stone-200/80">
                  <span className="text-[11px] text-stone-500 block">Institutional Reference & Contact</span>
                  <a href="mailto:boqolo@iqqo.gov.et" className="font-mono text-emerald-700 hover:underline font-semibold">
                    boqolo@iqqo.gov.et
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Objectives & Scientific Methodology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 border border-stone-200 p-4 rounded-lg bg-white">
              <h3 className="font-bold text-stone-900 text-xs">Scientific Objectives</h3>
              <ul className="space-y-1.5 list-disc list-inside text-stone-600 leading-relaxed">
                {selectedActivity.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 border border-stone-200 p-4 rounded-lg bg-white">
              <h3 className="font-bold text-stone-900 text-xs">Experimental Methodology & Target Agro-Ecology</h3>
              <p className="text-stone-600 leading-relaxed">{selectedActivity.methodology}</p>
              <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-100">
                <strong>Target Agro-Ecology:</strong> {selectedActivity.targetAgroEcology}
              </div>
            </div>
          </div>

          {/* Interactive Milestone Progress Tracking */}
          <div className="border border-stone-200 rounded-lg p-4 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h3 className="font-bold text-stone-900 text-xs">Milestones & Phase Deliverables</h3>
                <p className="text-[11px] text-stone-500">
                  {activeRole !== 'Viewer'
                    ? 'Researchers & Admins can click checkbox to verify completed milestones'
                    : 'Read-only progress status tracking'}
                </p>
              </div>
              <span className="font-mono text-xs text-stone-500 font-semibold tabular-nums">
                {selectedActivity.milestones.filter(m => m.completed).length} of {selectedActivity.milestones.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {selectedActivity.milestones.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (activeRole !== 'Viewer') {
                      toggleMilestone(selectedActivity.id, m.id);
                    }
                  }}
                  className={`p-3 rounded-md border flex items-start gap-3 transition-colors ${
                    activeRole !== 'Viewer' ? 'cursor-pointer hover:border-emerald-400' : 'cursor-default'
                  } ${m.completed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-stone-50 border-stone-200'}`}
                >
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={m.completed}
                      readOnly
                      disabled={activeRole === 'Viewer'}
                      className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`text-xs font-semibold ${m.completed ? 'text-emerald-900 line-through' : 'text-stone-800'}`}>
                        {m.title}
                      </span>
                      <span className="font-mono text-[10px] text-stone-500 shrink-0">
                        Target: {m.dueDate}
                      </span>
                    </div>
                    {m.deliverableSummary && (
                      <p className="text-[11px] text-stone-600 italic">
                        Result: {m.deliverableSummary}
                      </p>
                    )}
                    {m.completedDate && (
                      <div className="text-[10px] text-emerald-700 font-mono">
                        Certified achieved on {m.completedDate}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Deliverables & Publications */}
          <div className="border border-stone-200 rounded-lg p-4 bg-white space-y-3">
            <h3 className="font-bold text-stone-900 text-xs">Official Deliverables, Publications & Releases</h3>
            {selectedActivity.deliverables.length === 0 ? (
              <div className="text-stone-400 text-[11px] italic py-2">
                No formal variety release dossiers or journal publications catalogued yet.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {selectedActivity.deliverables.map(d => (
                  <div key={d.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-stone-800">{d.title}</div>
                      <div className="text-[11px] text-stone-500">
                        <span>{d.type}</span>
                        <span aria-hidden="true" className="mx-1">·</span>
                        <span>Date: {d.date}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Timeline Extension Governance */}
          <div className="border border-stone-200 rounded-lg p-4 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h3 className="font-bold text-stone-900 text-xs">Lifecycle Extension Requests</h3>
                <p className="text-[11px] text-stone-500">
                  Institutional governance mechanism for project prolongations
                </p>
              </div>

              {activeRole === 'Researcher' && (
                <button
                  onClick={() => setShowExtensionForm(!showExtensionForm)}
                  className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded border border-stone-300 transition-colors"
                >
                  {showExtensionForm ? 'Cancel Request' : '+ Request Extension'}
                </button>
              )}
            </div>

            {/* Researcher Extension Form */}
            {showExtensionForm && (
              <form onSubmit={handleExtensionSubmit} className="p-3 bg-stone-50 border border-stone-200 rounded-md space-y-3 text-xs">
                <div className="font-semibold text-stone-800">Submit Timeline Extension Proposal</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1">Additional Months Required</label>
                    <select
                      value={extensionMonths}
                      onChange={e => setExtensionMonths(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs"
                    >
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={9}>9 Months</option>
                      <option value={12}>12 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Current End Date</label>
                    <div className="font-mono text-stone-800 py-1">{selectedActivity.endDate}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">Detailed Justification (Agronomic, Climatic or Lab Logistical)</label>
                  <textarea
                    rows={2}
                    value={extensionJustification}
                    onChange={e => setExtensionJustification(e.target.value)}
                    placeholder="Provide detailed justification for the Institutional Research Review Committee..."
                    required
                    className="w-full bg-white border border-stone-300 rounded p-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowExtensionForm(false)}
                    className="px-3 py-1 bg-stone-200 text-stone-700 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold rounded text-xs"
                  >
                    Submit to HQ DG
                  </button>
                </div>
              </form>
            )}

            {/* Existing Extension History */}
            {selectedActivity.extensionHistory?.length === 0 ? (
              <div className="text-stone-400 text-[11px] italic py-1">
                No extensions requested. Running on original schedule.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedActivity.extensionHistory?.map(req => (
                  <div key={req.id} className="p-3 rounded border border-stone-200 bg-stone-50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-stone-800">+{req.requestedMonths} Months</span>
                        <span className="text-stone-500 ml-2">({req.previousEndDate} → {req.newEndDate})</span>
                      </div>
                      <span className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        req.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-red-100 text-red-800 border-red-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600">
                      <strong>Justification:</strong> {req.justification}
                    </p>

                    <div className="text-[10px] text-stone-400 font-mono">
                      Submitted by {req.requestedBy} on {req.requestDate}
                    </div>

                    {req.reviewNotes && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200">
                        <strong>HQ Review:</strong> {req.reviewNotes} (Reviewed by {req.reviewedBy} on {req.reviewDate})
                      </div>
                    )}

                    {/* Administrator Decision Controls */}
                    {activeRole === 'Administrator' && req.status === 'Pending' && (
                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Administrator review notes / conditions..."
                          value={adminReviewNotes}
                          onChange={e => setAdminReviewNotes(e.target.value)}
                          className="flex-1 bg-white border border-stone-300 rounded px-2 py-1 text-xs"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveExtension(selectedActivity.id, req.id, true, adminReviewNotes)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => approveExtension(selectedActivity.id, req.id, false, adminReviewNotes)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-semibold rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <div className="text-stone-500">
            Last modified: <span className="font-mono">{selectedActivity.lastUpdated}</span>
          </div>
          <button
            onClick={() => setSelectedActivity(null)}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-md transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
