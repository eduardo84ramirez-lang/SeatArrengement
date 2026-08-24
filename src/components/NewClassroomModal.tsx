import React, { useState } from 'react';
import { School, X, Plus } from 'lucide-react';
import { initialFixtures } from '../data/sampleClassrooms';
import { ClassroomLayout } from '../types';

interface NewClassroomModalProps {
  onCreate: (classroom: ClassroomLayout) => void;
  onClose: () => void;
}

export const NewClassroomModal: React.FC<NewClassroomModalProps> = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newClassroom: ClassroomLayout = {
      id: `classroom-${Date.now()}`,
      name: name.trim(),
      gradeLevel: gradeLevel.trim() || 'Primaria / Salón',
      updatedAt: new Date().toISOString(),
      students: [],
      fixtures: JSON.parse(JSON.stringify(initialFixtures)),
      paperMap: {
        imageUrl: null,
        opacity: 0.5,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      },
      canvasWidth: 800,
      canvasHeight: 560,
      gridSnap: true,
      notes: notes.trim() || undefined,
    };

    onCreate(newClassroom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-indigo-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <School className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-tight">Crear Nuevo Salón de Clase</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nombre de la Clase / Sección *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Grado 5A - Matemáticas"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Nivel / Número de Aula</label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="Ej. Salón 201 - Bloque B"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Notas u Objetivos del Salón</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Énfasis en aprendizaje colaborativo por mesas de trabajo..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Salón</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
