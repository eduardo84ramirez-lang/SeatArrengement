import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isAllowedDomain, saveClassroomToFirestore, loadUserClassrooms, logoutUser } from './lib/firebase';
import { ClassroomLayout, Student, FixtureItem, PaperMapConfig, SeatingLayoutStrategy, UserProfile } from './types';
import { defaultClassroom, sampleStudentsGrade4B, initialFixtures } from './data/sampleClassrooms';
import { autoArrangeStudents, computeClassroomMetrics } from './lib/autoArrange';
import { exportRoomToPdf, exportRoomToPng } from './lib/exportUtils';
import { Language, getTranslations } from './lib/i18n';
import { Header } from './components/Header';
import { StudentRosterSidebar } from './components/StudentRosterSidebar';
import { ClassroomCanvas } from './components/ClassroomCanvas';
import { StudentModal } from './components/StudentModal';
import { QuickPasteModal } from './components/QuickPasteModal';
import { PedagogicalDiagnosisModal } from './components/PedagogicalDiagnosisModal';
import { ScanModal } from './components/ScanModal';
import { ImportCsvModal } from './components/ImportCsvModal';
import { AuthModal } from './components/AuthModal';
import { NewClassroomModal } from './components/NewClassroomModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  // Language & i18n state (Spanish by default, English, French)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('montessori_lang') as Language;
    return saved && ['es', 'en', 'fr'].includes(saved) ? saved : 'es';
  });

  const t = getTranslations(language);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('montessori_lang', newLang);
  };

  // Authentication state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'offline' | 'error'>('saved');

  // Classroom state
  const [classrooms, setClassrooms] = useState<ClassroomLayout[]>([defaultClassroom]);
  const [currentClassroomId, setCurrentClassroomId] = useState<string>(defaultClassroom.id);
  const currentClassroom = classrooms.find((c) => c.id === currentClassroomId) || classrooms[0];

  // Active student selection & inspector
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
  const selectedStudent = currentClassroom.students.find((s) => s.id === selectedStudentId);

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Partial<Student> | null>(null);
  const [showQuickPasteModal, setShowQuickPasteModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showNewClassroomModal, setShowNewClassroomModal] = useState(false);

  // Canvas Mode state
  const [isClickToPlaceActive, setIsClickToPlaceActive] = useState(false);

  // Toast Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Auto-save debounce ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const isDomainValid = isAllowedDomain(firebaseUser.email);
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL,
          isMontessoriDomain: isDomainValid,
        };

        if (isDomainValid) {
          setUser(profile);
          setSyncStatus('saving');
          // Load user's saved classrooms from Firebase
          const userClassrooms = await loadUserClassrooms(firebaseUser.uid);
          if (userClassrooms && userClassrooms.length > 0) {
            setClassrooms(userClassrooms);
            setCurrentClassroomId(userClassrooms[0].id);
            showToast(`${profile.displayName} - ${t.classroomsLoaded || 'Plano cargado'}`, 'success');
          }
          setSyncStatus('saved');
        } else {
          // Non-montessori email logged in
          setUser(null);
          showToast(`Acceso denegado: solo correos @montessori.edu.co`, 'error');
        }
      } else {
        setUser(null);
        setSyncStatus('offline');
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Auto-save triggers
  const triggerAutoSave = (updatedClassroom: ClassroomLayout) => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    setSyncStatus('saving');
    autoSaveTimerRef.current = setTimeout(async () => {
      if (user?.uid) {
        const success = await saveClassroomToFirestore(user.uid, updatedClassroom);
        setSyncStatus(success ? 'saved' : 'error');
      } else {
        // Save to local storage
        try {
          localStorage.setItem(`montessori_classroom_${updatedClassroom.id}`, JSON.stringify(updatedClassroom));
          setSyncStatus('saved');
        } catch (e) {
          setSyncStatus('error');
        }
      }
    }, 1000);
  };

  // Helper to update current classroom
  const updateCurrentClassroom = (updater: (prev: ClassroomLayout) => ClassroomLayout) => {
    setClassrooms((prevClassrooms) => {
      const updated = prevClassrooms.map((c) => {
        if (c.id === currentClassroomId) {
          const newClassroom = updater(c);
          triggerAutoSave(newClassroom);
          return newClassroom;
        }
        return c;
      });
      return updated;
    });
  };

  // Student position updates
  const handleUpdateStudentPosition = (studentId: string, x: number, y: number) => {
    updateCurrentClassroom((c) => ({
      ...c,
      students: c.students.map((s) => (s.id === studentId ? { ...s, x, y, assigned: true } : s)),
    }));
  };

  const handleRotateStudent = (studentId: string) => {
    updateCurrentClassroom((c) => ({
      ...c,
      students: c.students.map((s) => {
        if (s.id === studentId) {
          const currentRot = s.rotation || 0;
          return { ...s, rotation: (currentRot + 90) % 360 };
        }
        return s;
      }),
    }));
  };

  const handleUnassignStudent = (studentId: string) => {
    updateCurrentClassroom((c) => ({
      ...c,
      students: c.students.map((s) => (s.id === studentId ? { ...s, assigned: false } : s)),
    }));
    showToast(t.studentUnassignedToast || 'Estudiante retirado del plano', 'info');
  };

  const handleAssignToCenter = (studentId: string) => {
    updateCurrentClassroom((c) => ({
      ...c,
      students: c.students.map((s) =>
        s.id === studentId ? { ...s, assigned: true, x: 240, y: 160 } : s
      ),
    }));
    setSelectedStudentId(studentId);
    showToast(t.studentPlacedToast || 'Estudiante ubicado en el aula', 'success');
  };

  const handleSwapStudents = (s1Id: string, s2Id: string) => {
    updateCurrentClassroom((c) => {
      const s1 = c.students.find((s) => s.id === s1Id);
      const s2 = c.students.find((s) => s.id === s2Id);
      if (!s1 || !s2) return c;

      const s1Pos = { x: s1.x, y: s1.y, rotation: s1.rotation };
      const s2Pos = { x: s2.x, y: s2.y, rotation: s2.rotation };

      return {
        ...c,
        students: c.students.map((s) => {
          if (s.id === s1Id) return { ...s, ...s2Pos };
          if (s.id === s2Id) return { ...s, ...s1Pos };
          return s;
        }),
      };
    });
    showToast(t.studentsSwappedToast || '¡Asientos intercambiados!', 'success');
  };

  // Fixtures updates
  const handleUpdateFixturePosition = (fixtureId: string, x: number, y: number) => {
    updateCurrentClassroom((c) => {
      const fixture = c.fixtures[fixtureId];
      if (!fixture) return c;
      return {
        ...c,
        fixtures: {
          ...c.fixtures,
          [fixtureId]: { ...fixture, x, y },
        },
      };
    });
  };

  const handleRotateFixture = (fixtureId: string) => {
    updateCurrentClassroom((c) => {
      const fixture = c.fixtures[fixtureId];
      if (!fixture) return c;
      return {
        ...c,
        fixtures: {
          ...c.fixtures,
          [fixtureId]: { ...fixture, rotation: (fixture.rotation + 90) % 360 },
        },
      };
    });
  };

  const handleToggleFixture = (fixtureId: string) => {
    updateCurrentClassroom((c) => {
      const fixture = c.fixtures[fixtureId];
      if (!fixture) return c;
      return {
        ...c,
        fixtures: {
          ...c.fixtures,
          [fixtureId]: { ...fixture, visible: !fixture.visible },
        },
      };
    });
  };

  // Paper map updates
  const handleUpdatePaperMap = (config: Partial<PaperMapConfig>) => {
    updateCurrentClassroom((c) => ({
      ...c,
      paperMap: { ...c.paperMap, ...config },
    }));
    if (config.imageUrl) {
      showToast(t.paperMapLoadedToast || 'Mapa de papel cargado', 'success');
    }
  };

  // Tap/Click on Photo to place desks
  const handleCanvasClickToPlace = (x: number, y: number) => {
    updateCurrentClassroom((c) => {
      const unassigned = c.students.find((s) => !s.assigned);
      if (unassigned) {
        return {
          ...c,
          students: c.students.map((s) =>
            s.id === unassigned.id ? { ...s, assigned: true, x, y } : s
          ),
        };
      } else {
        // Create new student desk
        const newStudentIndex = c.students.length + 1;
        const newStudent: Student = {
          id: `student-placed-${Date.now()}`,
          name: `${t.student} ${newStudentIndex}`,
          performance: 'medium',
          traits: [],
          conflictStudentIds: [],
          assigned: true,
          x,
          y,
          rotation: 0,
        };
        return {
          ...c,
          students: [...c.students, newStudent],
        };
      }
    });
    showToast(t.deskPlacedToast || 'Asiento ubicado', 'info');
  };

  // Auto Arrange
  const handleAutoArrange = (
    strategy: SeatingLayoutStrategy,
    options: { separateConflicts: boolean; frontRowNeeds: boolean; pairMentors: boolean }
  ) => {
    if (currentClassroom.students.length === 0) {
      showToast(t.noStudentsFound || 'No hay estudiantes para organizar', 'error');
      return;
    }

    const arrangedStudents = autoArrangeStudents(
      currentClassroom.students,
      strategy,
      currentClassroom.canvasWidth || 800,
      currentClassroom.canvasHeight || 560,
      currentClassroom.fixtures,
      options
    );

    updateCurrentClassroom((c) => ({
      ...c,
      students: arrangedStudents,
    }));

    showToast(t.autoArrangedToast || 'Aula organizada automáticamente', 'success');
  };

  // Student Save / Delete
  const handleSaveStudent = (savedStudent: Student) => {
    updateCurrentClassroom((c) => {
      const exists = c.students.some((s) => s.id === savedStudent.id);
      let newStudents = exists
        ? c.students.map((s) => (s.id === savedStudent.id ? savedStudent : s))
        : [...c.students, savedStudent];
      return { ...c, students: newStudents };
    });
    setShowStudentModal(false);
    setSelectedStudentId(savedStudent.id);
    showToast(`${savedStudent.name} - ${t.saved || 'Guardado'}`, 'success');
  };

  const handleDeleteStudent = (studentId: string) => {
    updateCurrentClassroom((c) => ({
      ...c,
      students: c.students.filter((s) => s.id !== studentId),
    }));
    setShowStudentModal(false);
    setSelectedStudentId(undefined);
    showToast(t.studentDeletedToast || 'Estudiante eliminado', 'info');
  };

  // Import handlers (OCR, CSV & Quick Paste)
  const handleImportStudents = (imported: Partial<Student>[], replaceAll: boolean = false) => {
    updateCurrentClassroom((c) => {
      const fullStudents: Student[] = imported.map((imp, idx) => ({
        id: imp.id || `imp-${Date.now()}-${idx}`,
        name: imp.name || `${t.student} ${idx + 1}`,
        grade: imp.grade || 'B+',
        performance: imp.performance || 'medium',
        performanceScore: imp.performanceScore || 80,
        traits: imp.traits || [],
        conflictStudentIds: imp.conflictStudentIds || [],
        assigned: false,
        x: 0,
        y: 0,
        rotation: 0,
      }));

      const baseList = replaceAll ? [] : c.students;

      return {
        ...c,
        students: [...baseList, ...fullStudents],
      };
    });
    showToast(`${imported.length} ${t.studentsImportedToast || 'estudiantes importados'}`, 'success');
  };

  // Copy Roster to Clipboard
  const handleCopyRoster = () => {
    if (currentClassroom.students.length === 0) {
      showToast(t.noStudentsFound || 'No hay estudiantes en la lista', 'info');
      return;
    }

    const textToCopy = currentClassroom.students
      .map((s, idx) => {
        const traitsStr = s.traits.length > 0 ? ` (${s.traits.join(', ')})` : '';
        const gradeStr = s.grade ? ` [${s.grade}]` : '';
        return `${idx + 1}. ${s.name}${gradeStr} - ${s.performance}${traitsStr}`;
      })
      .join('\n');

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showToast(t.rosterCopied || '¡Lista de estudiantes copiada al portapapeles!', 'success');
      })
      .catch(() => {
        showToast('Error al copiar la lista', 'error');
      });
  };

  // Export handlers (Isolated room canvas only!)
  const handleExportPdf = async () => {
    showToast(t.exportPdfLoading || 'Generando documento PDF...', 'info');
    try {
      await exportRoomToPdf('classroom-export-canvas', currentClassroom, user?.displayName || 'Docente Montessori');
      showToast(t.exportPdfSuccess || '¡PDF descargado con éxito!', 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Error al exportar PDF', 'error');
    }
  };

  const handleExportPng = async () => {
    showToast(t.exportPngLoading || 'Capturando imagen...', 'info');
    try {
      await exportRoomToPng('classroom-export-canvas', `${currentClassroom.name.replace(/\s+/g, '_')}_Aula.png`);
      showToast(t.exportPngSuccess || '¡PNG descargado con éxito!', 'success');
    } catch (err) {
      console.error('PNG export error:', err);
      showToast('Error al exportar PNG', 'error');
    }
  };

  // Save to cloud manual button
  const handleManualSaveCloud = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSyncStatus('saving');
    const success = await saveClassroomToFirestore(user.uid, currentClassroom);
    setSyncStatus(success ? 'saved' : 'error');
    showToast(success ? (t.cloudSavedSuccess || 'Guardado en Firebase') : 'Error al guardar en Firebase', success ? 'success' : 'error');
  };

  // Compute live diagnostic metrics
  const metrics = computeClassroomMetrics(currentClassroom.students, currentClassroom.fixtures);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 text-slate-900 font-sans select-none overflow-hidden">
      {/* Top Header Navbar */}
      <Header
        currentClassroom={currentClassroom}
        allClassrooms={classrooms}
        onSelectClassroom={(id) => {
          setCurrentClassroomId(id);
          setSelectedStudentId(undefined);
        }}
        onNewClassroom={() => setShowNewClassroomModal(true)}
        onSaveCloud={handleManualSaveCloud}
        onExportPdf={handleExportPdf}
        onExportPng={handleExportPng}
        syncStatus={syncStatus}
        user={user}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={async () => {
          await logoutUser();
          setUser(null);
          showToast(t.loggedOut || 'Sesión cerrada', 'info');
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenDiagnosis={() => setShowDiagnosisModal(true)}
        metrics={metrics}
        t={t}
      />

      {/* Main High-Density Workspace Grid */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Student Roster */}
        <StudentRosterSidebar
          students={currentClassroom.students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={(s) => setSelectedStudentId(s.id)}
          onAddStudent={() => {
            setStudentToEdit(null);
            setShowStudentModal(true);
          }}
          onOpenQuickPaste={() => setShowQuickPasteModal(true)}
          onOpenCsvModal={() => setShowCsvModal(true)}
          onOpenScanModal={() => setShowScanModal(true)}
          onAssignToCenter={handleAssignToCenter}
          onCopyRoster={handleCopyRoster}
          t={t}
        />

        {/* Center/Right: Interactive Classroom Blueprint Canvas (Expanded 2nd Column) */}
        <ClassroomCanvas
          students={currentClassroom.students}
          fixtures={currentClassroom.fixtures}
          paperMap={currentClassroom.paperMap}
          selectedStudentId={selectedStudentId}
          onSelectStudent={(s) => setSelectedStudentId(s?.id)}
          onUpdateStudentPosition={handleUpdateStudentPosition}
          onRotateStudent={handleRotateStudent}
          onUnassignStudent={handleUnassignStudent}
          onUpdateFixturePosition={handleUpdateFixturePosition}
          onRotateFixture={handleRotateFixture}
          onToggleFixture={handleToggleFixture}
          onUpdatePaperMap={handleUpdatePaperMap}
          onCanvasClickToPlace={handleCanvasClickToPlace}
          isClickToPlaceActive={isClickToPlaceActive}
          onToggleClickToPlace={() => setIsClickToPlaceActive(!isClickToPlaceActive)}
          conflictPairs={metrics.conflictPairs}
          onSwapStudents={handleSwapStudents}
          t={t}
        />
      </main>

      {/* Footer Status Bar */}
      <footer className="h-7 bg-slate-900 text-slate-400 border-t border-slate-800 px-6 flex items-center justify-between text-[10px] select-none">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Database: <strong className="text-slate-200">Firebase Firestore</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Domain: <strong className="text-indigo-300">@montessori.edu.co</strong>
          </span>
        </div>
        <div>Colegio Montessori • Classroom Seating Management System</div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200 pointer-events-none">
          <div className="bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            showToast(`${loggedInUser.displayName}`, 'success');
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showStudentModal && (
        <StudentModal
          student={studentToEdit}
          allStudents={currentClassroom.students}
          onSave={handleSaveStudent}
          onDelete={handleDeleteStudent}
          onClose={() => {
            setShowStudentModal(false);
            setStudentToEdit(null);
          }}
          t={t}
        />
      )}

      {showQuickPasteModal && (
        <QuickPasteModal
          t={t}
          onImport={(students, replaceAll) => handleImportStudents(students, replaceAll)}
          onClose={() => setShowQuickPasteModal(false)}
        />
      )}

      {showDiagnosisModal && (
        <PedagogicalDiagnosisModal
          classroom={currentClassroom}
          metrics={metrics}
          onAutoArrange={(strategy, options) => {
            handleAutoArrange(strategy, options);
          }}
          onClearBlueprint={() => {
            updateCurrentClassroom((c) => ({
              ...c,
              students: c.students.map((s) => ({ ...s, assigned: false })),
            }));
            showToast(t.allUnassignedToast || 'Se retiraron los estudiantes del plano', 'info');
          }}
          onLoadSample={() => {
            updateCurrentClassroom((c) => ({
              ...c,
              students: sampleStudentsGrade4B,
            }));
            showToast(t.sampleLoadedToast || 'Datos de ejemplo cargados', 'success');
          }}
          onClose={() => setShowDiagnosisModal(false)}
          t={t}
        />
      )}

      {showScanModal && (
        <ScanModal
          onImportStudents={(students) => handleImportStudents(students, false)}
          onClose={() => setShowScanModal(false)}
        />
      )}

      {showCsvModal && (
        <ImportCsvModal
          onImport={(students) => handleImportStudents(students, false)}
          onClose={() => setShowCsvModal(false)}
        />
      )}

      {showNewClassroomModal && (
        <NewClassroomModal
          onCreate={(newCls) => {
            setClassrooms([...classrooms, newCls]);
            setCurrentClassroomId(newCls.id);
            setSelectedStudentId(undefined);
            showToast(`"${newCls.name}"`, 'success');
          }}
          onClose={() => setShowNewClassroomModal(false)}
        />
      )}
    </div>
  );
}

