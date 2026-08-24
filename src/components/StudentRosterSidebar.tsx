import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  FileSpreadsheet, 
  Camera, 
  ClipboardPaste,
  Copy,
  Plus, 
  CheckCircle2, 
  Eye, 
  MessageSquare, 
  ShieldAlert, 
  GraduationCap,
  Users
} from 'lucide-react';
import { Student } from '../types';
import { Translations } from '../lib/i18n';

interface StudentRosterSidebarProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  selectedStudentId?: string;
  onAddStudent: () => void;
  onOpenQuickPaste: () => void;
  onCopyRoster: () => void;
  onOpenCsvModal: () => void;
  onOpenScanModal: () => void;
  onAssignToCenter: (studentId: string) => void;
  t: Translations;
}

export const StudentRosterSidebar: React.FC<StudentRosterSidebarProps> = ({
  students,
  onSelectStudent,
  selectedStudentId,
  onAddStudent,
  onOpenQuickPaste,
  onCopyRoster,
  onOpenCsvModal,
  onOpenScanModal,
  onAssignToCenter,
  t,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'high' | 'support' | 'front_row' | 'chatty'>('all');

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.grade && s.grade.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (filter === 'unassigned') return !s.assigned;
    if (filter === 'high') return s.performance === 'high';
    if (filter === 'support') return s.performance === 'support';
    if (filter === 'front_row') return s.traits.includes('front_row_need') || s.traits.includes('easily_distracted');
    if (filter === 'chatty') return s.traits.includes('chatty');
    return true;
  });

  const unassignedCount = students.filter((s) => !s.assigned).length;
  const highCount = students.filter((s) => s.performance === 'high').length;
  const supportCount = students.filter((s) => s.performance === 'support').length;
  const frontCount = students.filter((s) => s.traits.includes('front_row_need')).length;

  return (
    <aside className="w-72 sm:w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm select-none h-full overflow-hidden shrink-0">
      {/* Header with Title, Stats & Quick Actions */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t.studentRoster} ({students.length})
            </h2>
          </div>
          {unassignedCount > 0 ? (
            <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
              {unassignedCount} {t.unassigned}
            </span>
          ) : (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t.allAssigned}
            </span>
          )}
        </div>

        {/* Quick Paste Prominent Action Bar */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onOpenQuickPaste}
            className="w-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200 transition active:scale-[0.98]"
            title={t.quickPasteDesc}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>{t.quickPaste}</span>
          </button>

          <button
            onClick={onCopyRoster}
            disabled={students.length === 0}
            className="w-full text-xs font-semibold text-slate-700 hover:text-indigo-900 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 transition shadow-2xs"
            title={t.copyRoster}
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.copyRoster}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-7 pr-6 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 shadow-2xs placeholder:text-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Fast Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-[10px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded font-bold whitespace-nowrap transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setFilter('unassigned')}
            className={`px-2 py-0.5 rounded font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              filter === 'unassigned'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {t.filterUnassigned} ({unassignedCount})
          </button>
          <button
            onClick={() => setFilter('front_row')}
            className={`px-2 py-0.5 rounded font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              filter === 'front_row'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}
          >
            {t.filterFrontRow} ({frontCount})
          </button>
          <button
            onClick={() => setFilter('support')}
            className={`px-2 py-0.5 rounded font-semibold whitespace-nowrap transition ${
              filter === 'support'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {t.filterSupport} ({supportCount})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-2 py-0.5 rounded font-semibold whitespace-nowrap transition ${
              filter === 'high'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {t.filterHigh} ({highCount})
          </button>
        </div>
      </div>

      {/* Roster List Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 divide-y divide-slate-100">
        {filteredStudents.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 italic">
            {t.noStudentsFound}
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isSelected = selectedStudentId === student.id;
            const perfColor =
              student.performance === 'high'
                ? 'bg-emerald-500'
                : student.performance === 'medium'
                ? 'bg-amber-500'
                : 'bg-rose-500';

            const perfBadgeBg =
              student.performance === 'high'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : student.performance === 'medium'
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-rose-700 bg-rose-50 border-rose-200';

            const hasFrontNeed = student.traits.includes('front_row_need');
            const isMentor = student.traits.includes('mentor');
            const isChatty = student.traits.includes('chatty');
            const hasConflicts = student.conflictStudentIds.length > 0;

            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className={`p-2 rounded-lg transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-50/90 border-indigo-300 ring-1 ring-indigo-400 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full ${perfColor} shrink-0`} />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {student.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {student.grade && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${perfBadgeBg}`}>
                        {student.grade}
                      </span>
                    )}
                    {student.assigned ? (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {t.deskAssigned}
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssignToCenter(student.id);
                        }}
                        className="text-[9px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs"
                        title={t.placeOnCanvas}
                      >
                        <Plus className="w-2.5 h-2.5" /> {t.placeOnCanvas}
                      </button>
                    )}
                  </div>
                </div>

                {/* Behavioral tags & Needs Icons */}
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  {hasFrontNeed && (
                    <span className="text-[8.5px] bg-sky-100 text-sky-800 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5 text-sky-600" /> {t.filterFrontRow}
                    </span>
                  )}
                  {isMentor && (
                    <span className="text-[8.5px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <GraduationCap className="w-2.5 h-2.5 text-emerald-600" /> {t.mentor}
                    </span>
                  )}
                  {isChatty && (
                    <span className="text-[8.5px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <MessageSquare className="w-2.5 h-2.5 text-amber-600" /> {t.chatty}
                    </span>
                  )}
                  {hasConflicts && (
                    <span className="text-[8.5px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <ShieldAlert className="w-2.5 h-2.5 text-rose-600" /> {t.conflict} ({student.conflictStudentIds.length})
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Roster Actions Bottom Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onOpenCsvModal}
            className="w-full text-[11px] font-semibold text-slate-700 hover:text-indigo-900 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center gap-1.5 transition shadow-2xs"
            title="CSV / Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.importCsv}</span>
          </button>

          <button
            onClick={onOpenScanModal}
            className="w-full text-[11px] font-semibold text-slate-700 hover:text-indigo-900 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center gap-1.5 transition shadow-2xs"
            title={t.scanPaperOcr}
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.scanPaperOcr}</span>
          </button>
        </div>

        <button
          onClick={onAddStudent}
          className="w-full text-xs font-bold text-indigo-700 hover:text-indigo-800 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-lg flex items-center justify-center gap-1.5 transition"
        >
          <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
          <span>+ {t.addStudent}</span>
        </button>
      </div>
    </aside>
  );
};

