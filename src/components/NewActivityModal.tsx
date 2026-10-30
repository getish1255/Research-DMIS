import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityStatus, Milestone } from '../types';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';

export const NewActivityModal: React.FC = () => {
  const {
    isNewActivityModalOpen,
    setIsNewActivityModalOpen,
    centers,
    directorates,
    currentUser,
    addActivity,
    activities
  } = useApp();

  const [centerId, setCenterId] = useState(currentUser.centerId || 'sinana-arc');
  const [directorateId, setDirectorateId] = useState('crop-research');
  const [title, setTitle] = useState('');
  const [targetAgroEcology, setTargetAgroEcology] = useState('Highland');
  const [fiscalYear, setFiscalYear] = useState(2026);
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2028-10-31');
  const [budgetAllocatedETB, setBudgetAllocatedETB] = useState(1200000);
  const [objectives, setObjectives] = useState<string[]>([
    'Evaluate genetic diversity and adaptability across multi-location trial plots.',
    'Formulate agro-ecological management recommendations for smallholder farmers.'
  ]);
  const [newObjective, setNewObjective] = useState('');
  const [methodology, setMethodology] = useState('Randomized complete block design (RCBD) with 3 replications across highland experimental sites.');
  const [expectedOutputs, setExpectedOutputs] = useState('Candidate variety verification dossier submitted to National Release Committee.');
  const [milestones, setMilestones] = useState<{ title: string; dueDate: string }[]>([
    { title: 'Germplasm accession acquisition and nursery layout', dueDate: '2026-07-30' },
    { title: 'First year yield and disease incidence evaluation', dueDate: '2027-01-30' }
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('2027-08-30');

  if (!isNewActivityModalOpen) return null;

  const currentDirectorate = directorates.find(d => d.id === directorateId);
  const availableTeams = currentDirectorate?.teams || [];
  const teamId = availableTeams[0]?.id || 'team-default';

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (idx: number) => {
    setObjectives(objectives.filter((_, i) => i !== idx));
  };

  const handleAddMilestone = () => {
    if (newMilestoneTitle.trim() && newMilestoneDate) {
      setMilestones([...milestones, { title: newMilestoneTitle.trim(), dueDate: newMilestoneDate }]);
      setNewMilestoneTitle('');
    }
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Generate unique institutional code (e.g., IQQO-CRD-SIN-2026-05)
    const selectedCenter = centers.find(c => c.id === centerId);
    const selectedDir = directorates.find(d => d.id === directorateId);
    const centerCode = selectedCenter?.shortCode.replace(/ARC|ERC|LRC|SRC/g, '') || 'CTR';
    const dirCode = selectedDir?.code || 'DIR';
    const serial = String(activities.length + 1).padStart(2, '0');
    const generatedCode = `IQQO-${dirCode}-${centerCode}-${fiscalYear}-${serial}`;

    const formattedMilestones: Milestone[] = milestones.map((m, idx) => ({
      id: `m-new-${Date.now()}-${idx}`,
      title: m.title,
      dueDate: m.dueDate,
      completed: false
    }));

    addActivity({
      code: generatedCode,
      title: title.trim(),
      centerId,
      directorateId,
      teamId,
      status: 'New',
      progressPercent: 0,
      principalInvestigator: currentUser.name,
      piEmail: currentUser.email,
      collaborators: ['Regional Research Team Scientists'],
      fiscalYear,
      startDate,
      endDate,
      budgetAllocatedETB: Number(budgetAllocatedETB),
      budgetUtilizedETB: 0,
      objectives,
      methodology,
      expectedOutputs,
      targetAgroEcology,
      milestones: formattedMilestones,
      deliverables: [],
      extensionHistory: []
    });

    setIsNewActivityModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-4">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">Register New Research Activity</h2>
            <p className="text-xs text-stone-500">Initiate proposal in IQQO institutional repository</p>
          </div>
          <button
            onClick={() => setIsNewActivityModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700">
          {/* Institutional Affiliation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Executing Research Center</label>
              <select
                value={centerId}
                onChange={e => setCenterId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs font-medium focus:ring-1 focus:ring-emerald-600"
              >
                {centers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Governing Directorate</label>
              <select
                value={directorateId}
                onChange={e => setDirectorateId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs font-medium focus:ring-1 focus:ring-emerald-600"
              >
                {directorates.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Activity Title (Scientific & Descriptive)</label>
            <input
              type="text"
              required
              placeholder="e.g. Adaptation and Yield Evaluation of High-Yielding Faba Bean Clones in Bale Highlands..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Agro-Ecology & Fiscal Year & Dates */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Target Agro-Ecology</label>
              <select
                value={targetAgroEcology}
                onChange={e => setTargetAgroEcology(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs"
              >
                <option value="Highland">Highland</option>
                <option value="Midland">Midland</option>
                <option value="Lowland">Lowland</option>
                <option value="Pastoral / Arid">Pastoral / Arid</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Fiscal Year</label>
              <input
                type="number"
                value={fiscalYear}
                onChange={e => setFiscalYear(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded p-1.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-1.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Scheduled End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded p-1.5 text-xs font-mono"
              />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Total Approved Budget (Ethiopian Birr - ETB)</label>
            <input
              type="number"
              required
              step={50000}
              value={budgetAllocatedETB}
              onChange={e => setBudgetAllocatedETB(Number(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded p-2 text-xs font-mono"
            />
          </div>

          {/* Objectives */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-stone-800">Scientific Objectives</label>
            <ul className="space-y-1">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-center justify-between gap-2 p-1.5 bg-stone-50 rounded border border-stone-200">
                  <span className="flex-1">{obj}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(i)}
                    className="text-stone-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add another objective..."
                value={newObjective}
                onChange={e => setNewObjective(e.target.value)}
                className="flex-1 bg-white border border-stone-300 rounded px-2 py-1 text-xs"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-medium text-xs"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Methodology */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Experimental Methodology</label>
            <textarea
              rows={2}
              required
              value={methodology}
              onChange={e => setMethodology(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded p-2 text-xs"
            />
          </div>

          {/* Initial Milestones */}
          <div className="space-y-1.5 border border-stone-200 p-3 rounded-lg bg-stone-50">
            <label className="block font-semibold text-stone-800">Initial Project Milestones</label>
            <div className="space-y-1">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-stone-200">
                  <span>{m.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-stone-500">{m.dueDate}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <input
                type="text"
                placeholder="New milestone..."
                value={newMilestoneTitle}
                onChange={e => setNewMilestoneTitle(e.target.value)}
                className="sm:col-span-2 bg-white border border-stone-300 rounded px-2 py-1 text-xs"
              />
              <div className="flex gap-1">
                <input
                  type="date"
                  value={newMilestoneDate}
                  onChange={e => setNewMilestoneDate(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-[11px] font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-medium text-xs whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewActivityModalOpen(false)}
              className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded text-xs transition-colors shadow-xs"
            >
              Submit & Register Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
