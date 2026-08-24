import React, { useState } from 'react';
import { FileSpreadsheet, X, Upload, Check, AlertCircle } from 'lucide-react';
import { Student, PerformanceLevel, BehaviorTrait } from '../types';

interface ImportCsvModalProps {
  onImport: (students: Partial<Student>[]) => void;
  onClose: () => void;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({ onImport, onClose }) => {
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleParseText = () => {
    if (!pasteText.trim()) {
      setError('Por favor ingresa o pega la lista de nombres.');
      return;
    }

    const lines = pasteText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const parsed: Partial<Student>[] = [];

    lines.forEach((line, index) => {
      // Support comma or semicolon separation: "Juan Perez, A+, high, front_row_need"
      const parts = line.includes(',') ? line.split(',') : line.includes(';') ? line.split(';') : [line];
      const name = parts[0]?.trim();
      if (!name) return;

      let grade: string | undefined = parts[1]?.trim();
      let performance: PerformanceLevel = 'medium';
      const traits: BehaviorTrait[] = [];

      // Check third part or notes
      const perfStr = parts[2]?.trim().toLowerCase();
      if (perfStr === 'high' || perfStr === 'alto' || perfStr === 'excelente') {
        performance = 'high';
      } else if (perfStr === 'support' || perfStr === 'refuerzo' || perfStr === 'bajo') {
        performance = 'support';
      } else if (perfStr === 'medium' || perfStr === 'medio' || perfStr === 'basico') {
        performance = 'medium';
      }

      if (parts[3]) {
        const traitStr = parts[3].toLowerCase();
        if (traitStr.includes('front') || traitStr.includes('fila') || traitStr.includes('vision')) {
          traits.push('front_row_need');
        }
        if (traitStr.includes('chat') || traitStr.includes('habla') || traitStr.includes('platic')) {
          traits.push('chatty');
        }
        if (traitStr.includes('mentor') || traitStr.includes('tutor') || traitStr.includes('lider')) {
          traits.push('mentor');
        }
      }

      parsed.push({
        id: `csv-student-${Date.now()}-${index}`,
        name,
        grade: grade || 'B+',
        performance,
        traits,
        conflictStudentIds: [],
        assigned: false,
        x: 0,
        y: 0,
      });
    });

    if (parsed.length === 0) {
      setError('No se pudieron extraer nombres válidos del texto ingresado.');
      return;
    }

    onImport(parsed);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPasteText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-indigo-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold tracking-tight">
              Cargar Lista de Estudiantes (CSV / Texto)
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 font-medium">
              Pega un estudiante por línea o sube un archivo <code>.csv</code>:
            </p>
            <label className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 transition">
              <Upload className="w-3 h-3" />
              <span>Subir Archivo .CSV</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-mono">
            Formato opcional con columnas:<br />
            <strong>Nombre, Calificación, Rendimiento (high/medium/support), Rasgo</strong><br />
            Ejemplo:<br />
            Adriana Gomez, A+, high, mentor<br />
            Diego Santos, C, support, front_row_need
          </div>

          <textarea
            rows={7}
            value={pasteText}
            onChange={(e) => {
              setPasteText(e.target.value);
              setError(null);
            }}
            placeholder="Juan Pérez&#10;María Gómez&#10;Carlos Rodríguez&#10;Sofía Ramírez..."
            className="w-full bg-white border border-slate-300 rounded-xl p-3 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed text-xs"
          />

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleParseText}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Importar Estudiantes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
