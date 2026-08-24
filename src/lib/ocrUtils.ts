import { createWorker } from 'tesseract.js';
import { Student, PerformanceLevel, BehaviorTrait } from '../types';

export interface OcrProgress {
  status: string;
  progress: number;
}

export async function extractStudentsFromImage(
  imageFile: File | Blob,
  onProgress?: (p: OcrProgress) => void
): Promise<Partial<Student>[]> {
  try {
    const worker = await createWorker('spa+eng', 1, {
      logger: (m) => {
        if (onProgress && m.status === 'recognizing text') {
          onProgress({
            status: 'Reconociendo nombres...',
            progress: Math.round((m.progress || 0) * 100),
          });
        }
      },
    });

    const result = await worker.recognize(imageFile);
    await worker.terminate();

    const rawText = result.data.text || '';
    const lines = rawText.split('\n')
      .map(line => line.trim())
      // Strip leading bullet points, numbers like 1. 2)
      .map(line => line.replace(/^[\d\s\.\-\*\•\)]+/, '').trim())
      .filter(line => line.length >= 3);

    const students: Partial<Student>[] = lines.map((name, index) => {
      // Basic heuristic detection of traits in text if teacher wrote notes like "Juan (Front)" or "Maria (A+)"
      let performance: PerformanceLevel = 'medium';
      const traits: BehaviorTrait[] = [];
      let cleanName = name;

      const lower = name.toLowerCase();
      if (lower.includes('(a') || lower.includes('(alto') || lower.includes('(excelente')) {
        performance = 'high';
        cleanName = cleanName.replace(/\(.*?\)/g, '').trim();
      } else if (lower.includes('(apoyo') || lower.includes('(bajo') || lower.includes('(refuerzo')) {
        performance = 'support';
        cleanName = cleanName.replace(/\(.*?\)/g, '').trim();
      }

      if (lower.includes('adelante') || lower.includes('frente') || lower.includes('vision') || lower.includes('lentes')) {
        traits.push('front_row_need');
      }
      if (lower.includes('inquieto') || lower.includes('distra') || lower.includes('platic')) {
        traits.push('chatty');
      }
      if (lower.includes('tutor') || lower.includes('lider') || lower.includes('mentor')) {
        traits.push('mentor');
      }

      return {
        id: `ocr-student-${Date.now()}-${index}`,
        name: cleanName || `Estudiante ${index + 1}`,
        performance,
        traits,
        conflictStudentIds: [],
        assigned: false,
        x: 0,
        y: 0,
      };
    });

    return students;
  } catch (err) {
    console.error('OCR Error:', err);
    throw err;
  }
}
