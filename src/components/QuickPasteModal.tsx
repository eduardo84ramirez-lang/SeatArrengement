import React, { useState } from 'react';
import { ClipboardPaste, X, Check, Users, Sparkles, Trash2, HelpCircle } from 'lucide-react';
import { Student, PerformanceLevel, BehaviorTrait } from '../types';
import { Translations } from '../lib/i18n';

interface QuickPasteModalProps {
  t: Translations;
  onImport: (students: Partial<Student>[], replaceAll: boolean) => void;
  onClose: () => void;
}

export const QuickPasteModal: React.FC<QuickPasteModalProps> = ({ t, onImport, onClose }) => {
  const [pasteText, setPasteText] = useState('');
  const [replaceAll, setReplaceAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse lines dynamically
  const parseLines = (text: string): { name: string; grade?: string; perf: PerformanceLevel; traits: BehaviorTrait[] }[] => {
    if (!text.trim()) return [];

    let rawLines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    
    // If user pasted comma-separated list on 1 line: "Alice, Bob, Charlie"
    if (rawLines.length === 1 && rawLines[0].includes(',') && !rawLines[0].includes('\t')) {
      const commaSplit = rawLines[0].split(',').map((s) => s.trim()).filter(Boolean);
      if (commaSplit.length > 2) {
        rawLines = commaSplit;
      }
    }

    const results: { name: string; grade?: string; perf: PerformanceLevel; traits: BehaviorTrait[] }[] = [];

    rawLines.forEach((line) => {
      // Remove leading numbering like "1.", "1)", "1 -", "#1"
      let cleanLine = line.replace(/^\s*(\d+[\.\)\-:]|\#\d+)\s*/i, '').trim();
      if (!cleanLine) return;

      // Check if separated by comma, tab, or semicolon
      let parts: string[] = [];
      if (cleanLine.includes('\t')) {
        parts = cleanLine.split('\t').map((p) => p.trim());
      } else if (cleanLine.includes(';') || cleanLine.includes(',')) {
        parts = (cleanLine.includes(';') ? cleanLine.split(';') : cleanLine.split(',')).map((p) => p.trim());
      } else {
        parts = [cleanLine];
      }

      const name = parts[0]?.trim();
      if (!name || name.length < 2) return;

      let grade = parts[1]?.trim();
      let perf: PerformanceLevel = 'medium';
      const traits: BehaviorTrait[] = [];

      // Check 2nd or 3rd part for performance level
      const allText = cleanLine.toLowerCase();
      if (allText.includes('alto') || allText.includes('high') || allText.includes('haut') || allText.includes('excelente')) {
        perf = 'high';
      } else if (allText.includes('refuerzo') || allText.includes('support') || allText.includes('soutien') || allText.includes('bajo')) {
        perf = 'support';
      }

      if (allText.includes('fila') || allText.includes('front') || allText.includes('premier rang') || allText.includes('vision') || allText.includes('atencion')) {
        traits.push('front_row_need');
      }
      if (allText.includes('mentor') || allText.includes('tutor') || allText.includes('tuteur')) {
        traits.push('mentor');
      }
      if (allText.includes('chat') || allText.includes('habla') || allText.includes('bavard')) {
        traits.push('chatty');
      }

      results.push({
        name,
        grade: grade && !['high','alto','haut','support','refuerzo','soutien','medium','medio','moyen'].includes(grade.toLowerCase()) ? grade : undefined,
        perf,
        traits,
      });
    });

    return results;
  };

  const parsedStudents = parseLines(pasteText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedStudents.length === 0) {
      setError(t.noStudentsFound || 'Por favor ingresa al menos un nombre de estudiante.');
      return;
    }

    const studentsToImport: Partial<Student>[] = parsedStudents.map((p, idx) => ({
      id: `pasted-${Date.now()}-${idx}`,
      name: p.name,
      grade: p.grade || 'B+',
      performance: p.perf,
      performanceScore: p.perf === 'high' ? 95 : p.perf === 'support' ? 65 : 80,
      traits: p.traits,
      conflictStudentIds: [],
      assigned: false,
      x: 0,
      y: 0,
    }));

    onImport(studentsToImport, replaceAll);
    onClose();
  };

  const handleInsertSample = () => {
    setPasteText(
      `Camila Morales\nSantiago Gómez, A\nValentina Ríos, 95, Alto\nMateo Fernández\nLuciana Castro\nNicolás Herrera\nMariana Vargas, Refuerzo\nDaniel Ospina\nIsabella Correa\nSamuel Mendoza`
    );
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-indigo-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs">
              <ClipboardPaste className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                {t.quickPasteTitle}
              </h2>
              <p className="text-[11px] text-indigo-300">
                {t.quickPasteDesc}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col space-y-3.5">
          {/* Quick paste text area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>{t.quickPaste}</span>
                {parsedStudents.length > 0 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                    {parsedStudents.length} {t.quickPasteCount}
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInsertSample}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  {t.loadSample}
                </button>
                {pasteText && (
                  <button
                    type="button"
                    onClick={() => {
                      setPasteText('');
                      setError(null);
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t.clearText}
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={8}
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.quickPastePlaceholder}
              autoFocus
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 leading-relaxed shadow-inner"
            />
          </div>

          {/* Quick instructions & live preview chip summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-600 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="leading-tight">{t.quickPasteHelp}</p>
              {parsedStudents.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {parsedStudents.slice(0, 12).map((s, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {s.name}
                    </span>
                  ))}
                  {parsedStudents.length > 12 && (
                    <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      +{parsedStudents.length - 12} más...
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mode Switch (Append vs Replace) */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={replaceAll}
                onChange={(e) => setReplaceAll(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span>Reemplazar lista actual (borrar anteriores)</span>
            </label>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 border border-rose-200 text-xs p-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={parsedStudents.length === 0}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{t.quickPasteButton} ({parsedStudents.length})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
