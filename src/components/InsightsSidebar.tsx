import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  AlertTriangle, 
  CheckCircle2, 
  Grid3X3, 
  Shapes, 
  Square, 
  Users2, 
  Layers, 
  Edit3, 
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { Student, SeatingLayoutStrategy } from '../types';
import { Translations } from '../lib/i18n';

interface InsightsSidebarProps {
  metrics: {
    totalStudents: number;
    placedCount: number;
    conflictCount: number;
    frontRowCompliance: number;
    balanceScore: number;
    conflictPairs: { s1: Student; s2: Student; dist: number }[];
  };
  selectedStudent?: Student;
  onEditStudent: (student: Student) => void;
  onAutoArrange: (strategy: SeatingLayoutStrategy, options: {
    separateConflicts: boolean;
    frontRowNeeds: boolean;
    pairMentors: boolean;
  }) => void;
  onClearBlueprint: () => void;
  onLoadSample: () => void;
  t: Translations;
}

export const InsightsSidebar: React.FC<InsightsSidebarProps> = ({
  metrics,
  selectedStudent,
  onEditStudent,
  onAutoArrange,
  onClearBlueprint,
  onLoadSample,
  t,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<SeatingLayoutStrategy>('rows');
  const [separateConflicts, setSeparateConflicts] = useState(true);
  const [frontRowNeeds, setFrontRowNeeds] = useState(true);
  const [pairMentors, setPairMentors] = useState(true);

  return (
    <aside className="w-76 bg-white border-l border-slate-200 flex flex-col shadow-sm select-none h-full overflow-hidden shrink-0">
      {/* Placement Insights Section */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {t.insights}
            </h2>
          </div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            metrics.balanceScore >= 85
              ? 'bg-emerald-100 text-emerald-800'
              : metrics.balanceScore >= 65
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
          }`}>
            {metrics.balanceScore}% {t.optimal}
          </span>
        </div>

        {/* Diagnostic Metrics Cards */}
        <div className="space-y-2.5">
          {/* Harmony Score Bar */}
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-500 font-semibold">{t.harmonyScore}</span>
              <span className="font-bold text-indigo-900">{metrics.balanceScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  metrics.balanceScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${metrics.balanceScore}%` }}
              />
            </div>
          </div>

          {/* Front Row Needs Compliance */}
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-500 font-semibold">{t.frontRowNeeds}</span>
              <span className={`font-bold ${metrics.frontRowCompliance === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {metrics.frontRowCompliance}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-300"
                style={{ width: `${metrics.frontRowCompliance}%` }}
              />
            </div>
          </div>

          {/* Conflict Warnings */}
          <div className="pt-1">
            {metrics.conflictCount === 0 ? (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.noConflicts}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1 text-[10px] text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{metrics.conflictCount} {t.conflictsDetected}</span>
                </div>
                <div className="pl-5 text-rose-700">
                  {metrics.conflictPairs.slice(0, 2).map((cp, idx) => (
                    <p key={idx} className="truncate">
                      • {cp.s1.name} & {cp.s2.name}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Student Profile Inspector */}
      {selectedStudent ? (
        <div className="p-3 border-b border-slate-200 bg-indigo-50/50">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              {t.selectedStudent}
            </h3>
            <button
              onClick={() => onEditStudent(selectedStudent)}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
            >
              <Edit3 className="w-3 h-3" /> {t.edit}
            </button>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">{selectedStudent.name}</span>
              {selectedStudent.grade && (
                <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                  {selectedStudent.grade}
                </span>
              )}
            </div>

            <div className="text-[10px] text-slate-500 mt-1">
              {t.performance}: <strong className="text-slate-700 capitalize">{selectedStudent.performance}</strong>
            </div>

            {selectedStudent.traits.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedStudent.traits.map((tr) => (
                  <span key={tr} className="text-[8.5px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                    {tr.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {selectedStudent.notes && (
              <p className="text-[10px] text-slate-600 italic mt-2 border-t border-slate-100 pt-1">
                "{selectedStudent.notes}"
              </p>
            )}
          </div>
        </div>
      ) : null}

      {/* Smart Auto-Arrangement Controls */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col justify-between">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.autoArrange}</span>
          </h3>

          {/* Strategy Presets Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            <button
              onClick={() => setSelectedStrategy('rows')}
              className={`p-2 rounded-lg flex flex-col items-center justify-center text-center gap-1 border transition ${
                selectedStrategy === 'rows'
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-300 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="text-[9.5px]">{t.rowsLayout}</span>
            </button>

            <button
              onClick={() => setSelectedStrategy('pods')}
              className={`p-2 rounded-lg flex flex-col items-center justify-center text-center gap-1 border transition ${
                selectedStrategy === 'pods'
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-300 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <Shapes className="w-4 h-4" />
              <span className="text-[9.5px]">{t.podsLayout}</span>
            </button>

            <button
              onClick={() => setSelectedStrategy('u_shape')}
              className={`p-2 rounded-lg flex flex-col items-center justify-center text-center gap-1 border transition ${
                selectedStrategy === 'u_shape'
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-300 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <Square className="w-4 h-4" />
              <span className="text-[9.5px]">{t.uShapeLayout}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <button
              onClick={() => setSelectedStrategy('balanced_mentor')}
              className={`p-2 rounded-lg flex items-center justify-center gap-1.5 border transition ${
                selectedStrategy === 'balanced_mentor'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-300 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <Users2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px]">{t.mentorLayout}</span>
            </button>

            <button
              onClick={() => setSelectedStrategy('differentiated')}
              className={`p-2 rounded-lg flex items-center justify-center gap-1.5 border transition ${
                selectedStrategy === 'differentiated'
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-300 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[10px]">{t.abilityGroups}</span>
            </button>
          </div>

          {/* Smart Pedagogical Rule Checkboxes */}
          <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={separateConflicts}
                onChange={(e) => setSeparateConflicts(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="text-[11px] font-medium">{t.separateConflicts}</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={frontRowNeeds}
                onChange={(e) => setFrontRowNeeds(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="text-[11px] font-medium">{t.frontRowNeeds}</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pairMentors}
                onChange={(e) => setPairMentors(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="text-[11px] font-medium">{t.pairMentors}</span>
            </label>
          </div>

          {/* Pedagogical suggestion tip box */}
          <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-900 leading-relaxed">
              <strong>{t.montessoriTipTitle}:</strong> {t.montessoriTipDesc}
            </p>
          </div>
        </div>

        {/* Bottom Arrange & Utility Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <button
            onClick={() => onAutoArrange(selectedStrategy, {
              separateConflicts,
              frontRowNeeds,
              pairMentors,
            })}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.autoArrange}</span>
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onLoadSample}
              className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-semibold transition"
            >
              {t.loadSample}
            </button>
            <button
              onClick={onClearBlueprint}
              className="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-[10px] font-semibold transition"
            >
              {t.clearCanvas}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

