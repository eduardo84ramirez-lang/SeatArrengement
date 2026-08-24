import React, { useState } from 'react';
import { X, User, GraduationCap, ShieldAlert, Eye, MessageSquare } from 'lucide-react';
import { Student, PerformanceLevel, BehaviorTrait } from '../types';
import { Translations } from '../lib/i18n';

interface StudentModalProps {
  student?: Partial<Student> | null;
  allStudents: Student[];
  onSave: (student: Student) => void;
  onClose: () => void;
  onDelete?: (studentId: string) => void;
  t: Translations;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  student,
  allStudents,
  onSave,
  onClose,
  onDelete,
  t,
}) => {
  const isEditing = !!student?.id;

  const [name, setName] = useState(student?.name || '');
  const [grade, setGrade] = useState(student?.grade || 'B+');
  const [performance, setPerformance] = useState<PerformanceLevel>(student?.performance || 'medium');
  const [traits, setTraits] = useState<BehaviorTrait[]>(student?.traits || []);
  const [conflictStudentIds, setConflictStudentIds] = useState<string[]>(student?.conflictStudentIds || []);
  const [notes, setNotes] = useState(student?.notes || '');

  const toggleTrait = (trait: BehaviorTrait) => {
    if (traits.includes(trait)) {
      setTraits(traits.filter((t) => t !== trait));
    } else {
      setTraits([...traits, trait]);
    }
  };

  const toggleConflict = (id: string) => {
    if (conflictStudentIds.includes(id)) {
      setConflictStudentIds(conflictStudentIds.filter((cid) => cid !== id));
    } else {
      setConflictStudentIds([...conflictStudentIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const studentToSave: Student = {
      id: student?.id || `student-${Date.now()}`,
      name: name.trim(),
      grade: grade.trim() || undefined,
      performance,
      traits,
      conflictStudentIds,
      notes: notes.trim() || undefined,
      assigned: student?.assigned ?? false,
      x: student?.x ?? 200,
      y: student?.y ?? 200,
      rotation: student?.rotation ?? 0,
    };

    onSave(studentToSave);
  };

  const potentialConflictPeers = allStudents.filter((s) => s.id !== student?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-indigo-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-tight">
              {isEditing ? t.editStudent : t.newStudent}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Name & Academic Grade */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-700 font-bold mb-1">{t.fullName} *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Isabella Martínez"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{t.gradeScore}</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="A+, 95, B"
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center"
              />
            </div>
          </div>

          {/* Academic Performance Level */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">{t.academicPerf}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPerformance('high')}
                className={`p-2 rounded-lg font-bold border text-center transition ${
                  performance === 'high'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.highPerf}
              </button>
              <button
                type="button"
                onClick={() => setPerformance('medium')}
                className={`p-2 rounded-lg font-bold border text-center transition ${
                  performance === 'medium'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-1 ring-amber-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.mediumPerf}
              </button>
              <button
                type="button"
                onClick={() => setPerformance('support')}
                className={`p-2 rounded-lg font-bold border text-center transition ${
                  performance === 'support'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.supportPerf}
              </button>
            </div>
          </div>

          {/* Behavioral Traits & Accommodations */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              {t.behavioralTraits}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => toggleTrait('front_row_need')}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                  traits.includes('front_row_need')
                    ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold ring-1 ring-sky-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Eye className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t.frontRowNeed}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleTrait('mentor')}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                  traits.includes('mentor')
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.peerMentor}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleTrait('chatty')}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                  traits.includes('chatty')
                    ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold ring-1 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t.frequentTalker}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleTrait('easily_distracted')}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                  traits.includes('easily_distracted')
                    ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold ring-1 ring-purple-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{t.easilyDistracted}</span>
              </button>
            </div>
          </div>

          {/* Incompatible Peers / Conflict Selection */}
          {potentialConflictPeers.length > 0 && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {t.avoidAdjacentTo}
              </label>
              <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-lg p-2 grid grid-cols-2 gap-1.5 bg-slate-50">
                {potentialConflictPeers.map((p) => {
                  const isConflict = conflictStudentIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleConflict(p.id)}
                      className={`px-2 py-1 rounded text-left text-[11px] truncate flex items-center justify-between border transition ${
                        isConflict
                          ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {isConflict && <span className="text-rose-600 font-extrabold ml-1">✕</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">{t.notes}</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Trabaja mejor en el costado izquierdo del salón..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(student!.id!)}
                className="text-rose-600 hover:text-rose-800 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
              >
                {t.deleteStudent}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-200 transition"
              >
                {isEditing ? t.saveChanges : t.addStudent}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

