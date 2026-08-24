import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ClassroomLayout } from '../types';

export async function exportRoomToPng(
  canvasElementId: string,
  filename: string = 'plano-aula-montessori.png'
): Promise<void> {
  const element = document.getElementById(canvasElementId);
  if (!element) {
    console.error(`Element with id ${canvasElementId} not found`);
    return;
  }

  // Clone or capture element with clean background
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    ignoreElements: (el) => {
      // Ignore UI buttons, rotation handles, delete buttons during print
      return el.classList.contains('fixture-ui-control') || el.classList.contains('export-ignore');
    },
  });

  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = filename;
  link.click();
}

export async function exportRoomToPdf(
  canvasElementId: string,
  classroom: ClassroomLayout,
  teacherName?: string
): Promise<void> {
  const element = document.getElementById(canvasElementId);
  if (!element) {
    console.error(`Element with id ${canvasElementId} not found`);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    ignoreElements: (el) => {
      return el.classList.contains('fixture-ui-control') || el.classList.contains('export-ignore');
    },
  });

  const imgData = canvas.toDataURL('image/png');

  // Create landscape PDF for classroom blueprint
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4', // 297 x 210 mm
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Draw Clean Header
  pdf.setFillColor(30, 27, 75); // Deep Indigo
  pdf.rect(0, 0, pageWidth, 18, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text(`MONTESSORI - ${classroom.name.toUpperCase()} (${classroom.gradeLevel || 'Aula'})`, 14, 11);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const dateStr = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(`Docente: ${teacherName || 'Docente'} | Fecha: ${dateStr}`, pageWidth - 14, 11, { align: 'right' });

  // Calculate image placement maintaining aspect ratio
  const margin = 12;
  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - 26 - margin;

  const canvasRatio = canvas.width / canvas.height;
  let renderWidth = availableWidth;
  let renderHeight = renderWidth / canvasRatio;

  if (renderHeight > availableHeight) {
    renderHeight = availableHeight;
    renderWidth = renderHeight * canvasRatio;
  }

  const imgX = margin + (availableWidth - renderWidth) / 2;
  const imgY = 22 + (availableHeight - renderHeight) / 2;

  pdf.addImage(imgData, 'PNG', imgX, imgY, renderWidth, renderHeight);

  // Footer info
  pdf.setTextColor(140, 140, 140);
  pdf.setFontSize(8);
  pdf.text(`Total Estudiantes Asignados: ${classroom.students.filter(s => s.assigned).length} / ${classroom.students.length}`, 14, pageHeight - 5);
  pdf.text(`Generado con Montessori Classroom Seating Planner`, pageWidth - 14, pageHeight - 5, { align: 'right' });

  pdf.save(`${classroom.name.replace(/\s+/g, '_')}_Seating_Chart.pdf`);
}
