import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Users2, 
  GraduationCap, 
  ShieldAlert, 
  Lightbulb,
  Grid3X3,
  Shapes,
  Square,
  Layers,
  Trash2,
  Bookmark,
  MessageSquare
} from 'lucide-react';
import { ClassroomLayout, Student, SeatingLayoutStrategy } from '../types';
import { Translations } from '../lib/i18n';

interface PedagogicalDiagnosisModalProps {
  classroom: ClassroomLayout;
  metrics: {
    totalStudents: number;
    placedCount: number;
    conflictCount: number;
    frontRowCompliance: number;
    balanceScore: number;
    conflictPairs: { s1: Student; s2: Student; dist: number }[];
  };
  onClose: () => void;
  onAutoArrange: (
    strategy: SeatingLayoutStrategy,
    options: {
      separateConflicts: boolean;
      frontRowNeeds: boolean;
      pairMentors: boolean;
    }
  ) => void;
  onClearBlueprint: () => void;
  onLoadSample: () => void;
  t: Translations;
}

export const PedagogicalDiagnosisModal: React.FC<PedagogicalDiagnosisModalProps> = ({
  classroom,
  metrics,
  onClose,
  onAutoArrange,
  onClearBlueprint,
  onLoadSample,
  t,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<SeatingLayoutStrategy>('balanced_mentor');
  const [separateConflicts, setSeparateConflicts] = useState(true);
  const [frontRowNeeds, setFrontRowNeeds] = useState(true);
  const [pairMentors, setPairMentors] = useState(true);

  const students = classroom.students;
  const placed = students.filter((s) => s.assigned);

  // 1. Front Row Needs analysis
  const frontRowStudents = students.filter(
    (s) => s.traits.includes('front_row_need') || s.traits.includes('easily_distracted')
  );
  const frontRowPlacedCorrectly = frontRowStudents.filter((s) => s.assigned && s.y <= 180);
  const frontRowPlacedWrong = frontRowStudents.filter((s) => s.assigned && s.y > 180);

  // 2. Academic Performance Breakdown
  const highPerf = students.filter((s) => s.performance === 'high');
  const mediumPerf = students.filter((s) => s.performance === 'medium');
  const supportPerf = students.filter((s) => s.performance === 'support');

  // 3. Mentorship Pairing analysis
  const supportPlaced = placed.filter((s) => s.performance === 'support');
  const supportWithNearbyMentor = supportPlaced.filter((sup) => {
    return placed.some((other) => {
      if (other.id === sup.id) return false;
      const isMentor = other.traits.includes('peer_mentor') || other.performance === 'high';
      if (!isMentor) return false;
      const dist = Math.hypot(other.x - sup.x, other.y - sup.y);
      return dist < 140;
    });
  });

  // 4. Talkative / Distraction analysis
  const chattyPlaced = placed.filter((s) => s.traits.includes('chatty'));
  const chattyPairs = metrics.conflictPairs.filter(
    (cp) => cp.s1.traits.includes('chatty') && cp.s2.traits.includes('chatty')
  );

  // Dynamic Montessori Pedagogical Insights
  const insightsList: { type: 'success' | 'warning' | 'tip'; text: string }[] = [];

  if (metrics.balanceScore >= 85) {
    insightsList.push({
      type: 'success',
      text: 'Excelente balance pedagógico global. El aula favorece la concentración individual y la interacción constructiva.',
    });
  } else if (metrics.balanceScore >= 65) {
    insightsList.push({
      type: 'warning',
      text: 'Nivel de armonía aceptable, pero existen oportunidades para reducir focos de distracción y reubicar estudiantes prioritarios.',
    });
  } else {
    insightsList.push({
      type: 'warning',
      text: 'Se detectan incompatibilidades directas o desbalance en filas frontales que pueden afectar la dinámica de aprendizaje.',
    });
  }

  if (frontRowPlacedWrong.length > 0) {
    insightsList.push({
      type: 'warning',
      text: `Se recomienda reubicar a ${frontRowPlacedWrong.map((s) => s.name).join(', ')} en las primeras 2 filas para atender sus necesidades sensoriales o de enfoque.`,
    });
  } else if (frontRowStudents.length > 0 && frontRowPlacedCorrectly.length === frontRowStudents.length) {
    insightsList.push({
      type: 'success',
      text: '100% de cumplimiento en ubicación prioritaria: Todos los estudiantes con necesidades visuales/auditivas están en primeras filas.',
    });
  }

  if (supportPlaced.length > 0) {
    if (supportWithNearbyMentor.length === supportPlaced.length) {
      insightsList.push({
        type: 'success',
        text: 'Estrategia Montessori cumplida: Todos los estudiantes que requieren refuerzo cuentan con un tutor par adyacente.',
      });
    } else {
      insightsList.push({
        type: 'tip',
        text: `Consejo: ${supportPlaced.length - supportWithNearbyMentor.length} estudiante(s) en refuerzo podrían beneficiarse de tener a un compañero de alto rendimiento al lado.`,
      });
    }
  }

  if (chattyPairs.length > 0) {
    insightsList.push({
      type: 'warning',
      text: `Se identificaron ${chattyPairs.length} parejas de estudiantes conversadores sentados juntos, lo que puede generar distracciones en la clase.`,
    });
  }

  const strategies: { id: SeatingLayoutStrategy; label: string; icon: any }[] = [
    { id: 'balanced_mentor', label: t.mentorLayout || 'Tutor-Par', icon: Users2 },
    { id: 'rows', label: t.rowsLayout || 'Filas', icon: Grid3X3 },
    { id: 'pods', label: t.podsLayout || 'Mesas/Pods', icon: Shapes },
    { id: 'u_shape', label: t.uShapeLayout || 'Forma U', icon: Square },
    { id: 'differentiated', label: t.abilityGroups || 'Por Niveles', icon: Layers },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-indigo-950 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                {t.pedagogicalDiagnosis}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-800 text-indigo-200">
                  {classroom.name}
                </span>
              </h2>
              <p className="text-xs text-indigo-300">
                {t.pedagogicalDiagnosisDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-indigo-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Score Card */}
            <div className="md:col-span-2 bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-18 h-18 rounded-full flex flex-col items-center justify-center border-4 ${
                    metrics.balanceScore >= 80
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : metrics.balanceScore >= 60
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-rose-500 bg-rose-50 text-rose-900'
                  }`}
                >
                  <span className="text-xl font-black">{metrics.balanceScore}%</span>
                  <span className="text-[9px] uppercase font-bold text-slate-500">{t.optimal}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  {t.harmonyScore}
                </div>
                <div className="text-sm font-extrabold text-slate-800">
                  {metrics.balanceScore >= 80
                    ? t.diagnosisStatusOptimal
                    : metrics.balanceScore >= 60
                    ? t.diagnosisStatusAttention
                    : t.diagnosisStatusCritical}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {metrics.placedCount} de {metrics.totalStudents} {t.studentsCount} ubicados en el plano.
                </p>
              </div>
            </div>

            {/* Front Row Compliance Card */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{t.priorityFrontRow}</span>
                <Eye className="w-4 h-4 text-sky-600" />
              </div>
              <div className="my-1.5">
                <div className="text-lg font-black text-slate-800">
                  {metrics.frontRowCompliance}%
                </div>
                <div className="text-[10px] text-slate-500">
                  {frontRowPlacedCorrectly.length}/{frontRowStudents.length} {t.studentsCount} con necesidad en fila 1.
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-500"
                  style={{ width: `${metrics.frontRowCompliance}%` }}
                />
              </div>
            </div>

            {/* Conflicts Card */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{t.conflict}</span>
                <ShieldAlert className={`w-4 h-4 ${metrics.conflictCount === 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
              </div>
              <div className="my-1.5">
                <div className={`text-lg font-black ${metrics.conflictCount === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {metrics.conflictCount === 0 ? '0' : metrics.conflictCount}
                </div>
                <div className="text-[10px] text-slate-500">
                  {metrics.conflictCount === 0 ? t.noConflicts : t.conflictsDetected}
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${metrics.conflictCount === 0 ? 'bg-emerald-500 w-full' : 'bg-rose-500 w-3/4'}`}
                />
              </div>
            </div>
          </div>

          {/* Academic & Behavioral Distribution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic Balance Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t.academicBalance}
                </h3>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-700">{t.perfHigh}</span>
                    <span className="text-slate-600 font-bold">{highPerf.length} ({Math.round((highPerf.length / Math.max(1, students.length)) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(highPerf.length / Math.max(1, students.length)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{t.perfMedium}</span>
                    <span className="text-slate-600 font-bold">{mediumPerf.length} ({Math.round((mediumPerf.length / Math.max(1, students.length)) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full"
                      style={{ width: `${(mediumPerf.length / Math.max(1, students.length)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-700">{t.perfSupport}</span>
                    <span className="text-slate-600 font-bold">{supportPerf.length} ({Math.round((supportPerf.length / Math.max(1, students.length)) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${(supportPerf.length / Math.max(1, students.length)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Peer Mentoring Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Users2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.mentorsPairedTitle}:</span>
                </span>
                <span className="font-bold text-slate-800">
                  {supportWithNearbyMentor.length} / {supportPlaced.length} {t.studentsCount}
                </span>
              </div>
            </div>

            {/* Behavioral Traits Summary Card */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t.conflictPairsTitle}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    <span>{t.frontRowNeed}</span>
                  </span>
                  <span className="font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full text-[11px]">
                    {frontRowStudents.length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.chatty}</span>
                  </span>
                  <span className="font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[11px]">
                    {chattyPlaced.length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.peerMentor}</span>
                  </span>
                  <span className="font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px]">
                    {students.filter((s) => s.traits.includes('peer_mentor')).length}
                  </span>
                </div>
              </div>

              {metrics.conflictPairs.length > 0 && (
                <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                  <div className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Puntos de atención detectados:</span>
                  </div>
                  <ul className="text-[10px] text-rose-700 space-y-0.5 list-disc pl-4">
                    {metrics.conflictPairs.map((cp, idx) => (
                      <li key={idx}>
                        <strong>{cp.s1.name}</strong> y <strong>{cp.s2.name}</strong> están contiguos.
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Auto-Arrange Strategy & Optimization Section */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  {t.autoArrange}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onLoadSample}
                  className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 px-2 py-1 rounded bg-white border border-indigo-200 flex items-center gap-1"
                >
                  <Bookmark className="w-3 h-3 text-indigo-500" />
                  {t.loadSample}
                </button>
                <button
                  onClick={onClearBlueprint}
                  className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 px-2 py-1 rounded bg-white border border-rose-200 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3 text-rose-500" />
                  {t.clearCanvas}
                </button>
              </div>
            </div>

            {/* Strategy Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
              {strategies.map((strat) => {
                const Icon = strat.icon;
                const isSelected = selectedStrategy === strat.id;
                return (
                  <button
                    key={strat.id}
                    onClick={() => setSelectedStrategy(strat.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                    <span>{strat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Optimization Rules Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-indigo-100 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={separateConflicts}
                  onChange={(e) => setSeparateConflicts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
                <span className="text-slate-700 font-medium">{t.separateConflicts}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={frontRowNeeds}
                  onChange={(e) => setFrontRowNeeds(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
                <span className="text-slate-700 font-medium">{t.frontRowNeeds}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pairMentors}
                  onChange={(e) => setPairMentors(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
                <span className="text-slate-700 font-medium">{t.pairMentors}</span>
              </label>
            </div>
          </div>

          {/* Real-time Montessori Pedagogical Recommendations */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                {t.recommendationsTitle}
              </h3>
            </div>
            <div className="space-y-2">
              {insightsList.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 text-xs leading-relaxed p-2.5 rounded-lg border ${
                    item.type === 'success'
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : item.type === 'warning'
                      ? 'bg-amber-100/70 border-amber-200 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                  {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                  {item.type === 'tip' && <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition"
          >
            {t.closeDiagnosis}
          </button>

          <button
            onClick={() => {
              onAutoArrange(selectedStrategy, {
                separateConflicts,
                frontRowNeeds,
                pairMentors,
              });
              onClose();
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-2 transition active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.runAutoArrange}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
