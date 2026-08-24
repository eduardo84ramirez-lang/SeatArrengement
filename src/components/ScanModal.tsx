import React, { useState } from 'react';
import { Camera, X, Upload, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { extractStudentsFromImage, OcrProgress } from '../lib/ocrUtils';
import { Student } from '../types';

interface ScanModalProps {
  onImportStudents: (students: Partial<Student>[]) => void;
  onClose: () => void;
}

export const ScanModal: React.FC<ScanModalProps> = ({ onImportStudents, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);
  const [extractedStudents, setExtractedStudents] = useState<Partial<Student>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setExtractedStudents([]);
  };

  const handleStartOcr = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setOcrProgress({ status: 'Iniciando motor de reconocimiento OCR...', progress: 5 });

    try {
      const results = await extractStudentsFromImage(selectedFile, (p) => {
        setOcrProgress(p);
      });

      if (results.length === 0) {
        setError('No se detectaron nombres legibles en la foto. Intenta con una toma más iluminada o pega la lista manualmente.');
      } else {
        setExtractedStudents(results);
      }
    } catch (err: any) {
      console.error('Scan OCR error:', err);
      setError('Error al procesar la imagen OCR. Verifica que el archivo sea una imagen válida.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (extractedStudents.length > 0) {
      onImportStudents(extractedStudents);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        {/* Modal Header */}
        <div className="bg-indigo-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-tight">
              Escanear Lista de Estudiantes en Papel (OCR)
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600">
            Sube o toma una fotografía de tu lista de estudiantes manuscrita o impresa en papel. El sistema extraerá automáticamente los nombres para colocarlos en el aula.
          </p>

          {/* Upload Area */}
          {!previewUrl ? (
            <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-center group">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-800 text-sm mb-1">
                Haz clic para subir o arrastrar foto
              </span>
              <span className="text-[11px] text-slate-500">
                Formatos compatibles: JPG, PNG, WEBP (claros y bien iluminados)
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-300" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{selectedFile?.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {(selectedFile?.size ? (selectedFile.size / 1024).toFixed(1) : 0)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setExtractedStudents([]);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!isProcessing && extractedStudents.length === 0 && (
                <button
                  onClick={handleStartOcr}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Reconocer Nombres con OCR</span>
                </button>
              )}
            </div>
          )}

          {/* Processing Progress Indicator */}
          {isProcessing && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-indigo-900 font-bold">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>{ocrProgress?.status || 'Procesando imagen...'}</span>
                </span>
                <span>{ocrProgress?.progress || 0}%</span>
              </div>
              <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-200"
                  style={{ width: `${ocrProgress?.progress || 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Extracted Students Preview */}
          {extractedStudents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {extractedStudents.length} estudiantes detectados con éxito
                </span>
              </div>

              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50 space-y-1">
                {extractedStudents.map((s, i) => (
                  <div key={i} className="text-[11px] font-medium text-slate-800 bg-white p-1.5 rounded border border-slate-200 flex items-center justify-between">
                    <span>{i + 1}. {s.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold">
                      {s.performance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
            >
              Cancelar
            </button>
            {extractedStudents.length > 0 && (
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-200 transition"
              >
                Importar {extractedStudents.length} Estudiantes al Aula
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
