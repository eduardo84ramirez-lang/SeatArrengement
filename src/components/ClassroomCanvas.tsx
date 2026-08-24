import React, { useRef, useState } from 'react';
import { 
  RotateCw, 
  X, 
  AlertTriangle, 
  Crosshair, 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  GraduationCap, 
  MessageSquare, 
  Armchair, 
  DoorOpen, 
  AppWindow, 
  Archive, 
  Library, 
  Flower2, 
  Move
} from 'lucide-react';
import { Student, FixtureItem, PaperMapConfig } from '../types';
import { Translations } from '../lib/i18n';

interface ClassroomCanvasProps {
  students: Student[];
  fixtures: Record<string, FixtureItem>;
  paperMap: PaperMapConfig;
  selectedStudentId?: string;
  onSelectStudent: (student: Student | undefined) => void;
  onUpdateStudentPosition: (studentId: string, x: number, y: number) => void;
  onRotateStudent: (studentId: string) => void;
  onUnassignStudent: (studentId: string) => void;
  onUpdateFixturePosition: (fixtureId: string, x: number, y: number) => void;
  onRotateFixture: (fixtureId: string) => void;
  onToggleFixture: (fixtureId: string) => void;
  onUpdatePaperMap: (config: Partial<PaperMapConfig>) => void;
  onCanvasClickToPlace: (x: number, y: number) => void;
  isClickToPlaceActive: boolean;
  onToggleClickToPlace: () => void;
  conflictPairs: { s1: Student; s2: Student; dist: number }[];
  onSwapStudents: (s1Id: string, s2Id: string) => void;
  t: Translations;
}

export const ClassroomCanvas: React.FC<ClassroomCanvasProps> = ({
  students,
  fixtures,
  paperMap,
  selectedStudentId,
  onSelectStudent,
  onUpdateStudentPosition,
  onRotateStudent,
  onUnassignStudent,
  onUpdateFixturePosition,
  onRotateFixture,
  onToggleFixture,
  onUpdatePaperMap,
  onCanvasClickToPlace,
  isClickToPlaceActive,
  onToggleClickToPlace,
  conflictPairs,
  onSwapStudents,
  t,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swapSourceId, setSwapSourceId] = useState<string | null>(null);

  // Dragging state for desks and fixtures
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'student' | 'fixture' | null>(null);
  const dragStartPos = useRef<{ x: number; y: number; elemX: number; elemY: number }>({ x: 0, y: 0, elemX: 0, elemY: 0 });

  // Map of students involved in conflicts for instant visual badge
  const conflictingStudentIds = new Set<string>();
  conflictPairs.forEach(p => {
    conflictingStudentIds.add(p.s1.id);
    conflictingStudentIds.add(p.s2.id);
  });

  const handlePointerDown = (
    e: React.PointerEvent,
    id: string,
    type: 'student' | 'fixture',
    currentX: number,
    currentY: number
  ) => {
    // Ignore clicks on control buttons (rotate, delete, etc.)
    if ((e.target as HTMLElement).closest('button')) return;
    if (isClickToPlaceActive) return;

    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setDraggingId(id);
    setDragType(type);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      elemX: currentX,
      elemY: currentY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !containerRef.current) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    const newX = Math.max(10, Math.min(containerRef.current.clientWidth - 90, dragStartPos.current.elemX + dx));
    const newY = Math.max(10, Math.min(containerRef.current.clientHeight - 60, dragStartPos.current.elemY + dy));

    if (dragType === 'student') {
      onUpdateStudentPosition(draggingId, newX, newY);
    } else if (dragType === 'fixture') {
      onUpdateFixturePosition(draggingId, newX, newY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
      setDraggingId(null);
      setDragType(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isClickToPlaceActive || !containerRef.current) return;
    if ((e.target as HTMLElement).closest('.desk-card-item') || (e.target as HTMLElement).closest('.draggable-fixture')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 42;
    const clickY = e.clientY - rect.top - 26;

    onCanvasClickToPlace(Math.max(10, clickX), Math.max(10, clickY));
  };

  const handleDeskClick = (student: Student) => {
    if (isClickToPlaceActive) return;

    if (swapSourceId) {
      if (swapSourceId !== student.id) {
        onSwapStudents(swapSourceId, student.id);
      }
      setSwapSourceId(null);
    } else {
      onSelectStudent(student);
    }
  };

  const handleUploadPaperMap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onUpdatePaperMap({ imageUrl: event.target?.result as string, opacity: 0.5 });
    };
    reader.readAsDataURL(file);
  };

  const assignedStudents = students.filter(s => s.assigned);

  return (
    <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden relative select-none">
      {/* Top Toolbar: Fixtures Toggles & Paper Map Controls */}
      <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-2 shadow-2xs z-20">
        {/* Left: Quick Fixture Toggles */}
        <div className="flex items-center space-x-1 overflow-x-auto text-[10px]">
          <button
            onClick={() => onToggleFixture('teacher_desk')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-bold border transition ${
              fixtures.teacher_desk?.visible
                ? 'bg-blue-900 text-white border-blue-950 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <Armchair className="w-3 h-3 text-sky-300" />
            <span>{t.teacherDesk}</span>
          </button>
          <button
            onClick={() => onToggleFixture('blackboard')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-bold border transition ${
              fixtures.blackboard?.visible
                ? 'bg-slate-900 text-amber-300 border-slate-950 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-amber-400" />
            <span>{t.blackboard}</span>
          </button>
          <button
            onClick={() => onToggleFixture('door')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-bold border transition ${
              fixtures.door?.visible
                ? 'bg-red-50 text-red-700 border-red-300 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <DoorOpen className="w-3 h-3 text-red-600" />
            <span>{t.door}</span>
          </button>
          <button
            onClick={() => {
              onToggleFixture('window_left');
              onToggleFixture('window_right');
            }}
            className={`px-2 py-1 rounded flex items-center gap-1 font-bold border transition ${
              fixtures.window_left?.visible || fixtures.window_right?.visible
                ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <AppWindow className="w-3 h-3 text-sky-600" />
            <span>{t.window}</span>
          </button>
          <button
            onClick={() => onToggleFixture('bookshelf')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-bold border transition ${
              fixtures.bookshelf?.visible
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <Library className="w-3 h-3 text-amber-600" />
            <span>{t.bookshelf}</span>
          </button>
          <button
            onClick={() => onToggleFixture('lockers')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-bold border transition ${
              fixtures.lockers?.visible
                ? 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <Archive className="w-3 h-3 text-indigo-600" />
            <span>{t.lockers}</span>
          </button>
          <button
            onClick={() => onToggleFixture('plant')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-bold border transition ${
              fixtures.plant?.visible
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <Flower2 className="w-3 h-3 text-emerald-600" />
            <span>{t.plant}</span>
          </button>
        </div>

        {/* Right: Paper Map Controls & Tap-to-Place */}
        <div className="flex items-center space-x-2">
          {paperMap.imageUrl ? (
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
              <span className="text-[10px] font-bold text-slate-500">{t.opacity}:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={paperMap.opacity}
                onChange={(e) => onUpdatePaperMap({ opacity: parseFloat(e.target.value) })}
                className="w-16 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <button
                onClick={() => onUpdatePaperMap({ imageUrl: null })}
                className="text-rose-600 hover:text-rose-800 p-0.5"
                title={t.hideMap}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="text-xs bg-white hover:bg-slate-50 text-indigo-900 border border-indigo-200 font-bold px-2.5 py-1 rounded-md cursor-pointer flex items-center gap-1.5 transition shadow-2xs">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">{t.uploadMapPhoto}</span>
              <input type="file" accept="image/*" onChange={handleUploadPaperMap} className="hidden" />
            </label>
          )}

          {/* Tap-to-Place Mode Button */}
          <button
            onClick={onToggleClickToPlace}
            className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 transition shadow-2xs ${
              isClickToPlaceActive
                ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
            }`}
            title={t.clickToPlaceDesc}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isClickToPlaceActive ? t.clickToPlaceActive : t.clickToPlace}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-auto relative">
        <div
          id="classroom-export-canvas"
          ref={containerRef}
          onClick={handleCanvasClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`w-full max-w-5xl h-[560px] bg-white rounded-xl shadow-md border-2 border-slate-300 relative overflow-hidden transition-all ${
            isClickToPlaceActive ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.07) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Paper Map Background Image Layer */}
          {paperMap.imageUrl && (
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none transition-opacity duration-150 z-0"
              style={{
                backgroundImage: `url("${paperMap.imageUrl}")`,
                opacity: paperMap.opacity,
              }}
            />
          )}

          {/* Front Blackboard Header Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-300 text-[10px] px-8 py-1 rounded-b-md font-mono uppercase tracking-[0.2em] shadow-xs z-10 export-ignore">
            {t.frontBoard}
          </div>

          {/* FIXTURE: Teacher Desk */}
          {fixtures.teacher_desk?.visible && (
            <div
              className="absolute draggable-fixture z-15 bg-blue-900 text-white rounded-lg p-2 shadow-md border-2 border-blue-950 flex flex-col justify-between cursor-move"
              style={{
                left: `${fixtures.teacher_desk.x}px`,
                top: `${fixtures.teacher_desk.y}px`,
                width: `${fixtures.teacher_desk.width}px`,
                height: `${fixtures.teacher_desk.height}px`,
                transform: `rotate(${fixtures.teacher_desk.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'teacher_desk', 'fixture', fixtures.teacher_desk.x, fixtures.teacher_desk.y)}
            >
              <div className="flex items-center justify-between text-blue-200 text-[8px] fixture-ui-control">
                <span className="flex items-center gap-0.5">
                  <Move className="w-2.5 h-2.5" />
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => onRotateFixture('teacher_desk')} className="hover:text-white" title={t.rotate}>
                    <RotateCw className="w-2.5 h-2.5" />
                  </button>
                  <button onClick={() => onToggleFixture('teacher_desk')} className="text-rose-300 hover:text-rose-100">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase text-center text-white pb-0.5">
                {t.teacherDesk}
              </span>
            </div>
          )}

          {/* FIXTURE: Blackboard */}
          {fixtures.blackboard?.visible && (
            <div
              className="absolute draggable-fixture z-15 bg-slate-900 text-amber-300 rounded-md px-3 py-1 shadow-md border-2 border-slate-700 flex flex-col items-center justify-between cursor-move"
              style={{
                left: `${fixtures.blackboard.x}px`,
                top: `${fixtures.blackboard.y}px`,
                width: `${fixtures.blackboard.width}px`,
                height: `${fixtures.blackboard.height}px`,
                transform: `rotate(${fixtures.blackboard.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'blackboard', 'fixture', fixtures.blackboard.x, fixtures.blackboard.y)}
            >
              <div className="w-full flex items-center justify-between text-[8px] fixture-ui-control text-slate-400">
                <span>{t.blackboard}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => onRotateFixture('blackboard')} className="hover:text-white" title={t.rotate}>
                    <RotateCw className="w-2.5 h-2.5" />
                  </button>
                  <button onClick={() => onToggleFixture('blackboard')} className="text-rose-400">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FIXTURE: Door */}
          {fixtures.door?.visible && (
            <div
              className="absolute draggable-fixture z-15 bg-white border-2 border-red-500 rounded-br-2xl p-1 shadow-sm flex flex-col justify-between cursor-move"
              style={{
                left: `${fixtures.door.x}px`,
                top: `${fixtures.door.y}px`,
                width: `${fixtures.door.width}px`,
                height: `${fixtures.door.height}px`,
                transform: `rotate(${fixtures.door.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'door', 'fixture', fixtures.door.x, fixtures.door.y)}
            >
              <div className="flex items-center justify-between text-[8px] text-red-600 fixture-ui-control">
                <span className="font-bold">{t.door}</span>
                <button onClick={() => onToggleFixture('door')} className="text-red-500">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          )}

          {/* FIXTURE: Window Left */}
          {fixtures.window_left?.visible && (
            <div
              className="absolute draggable-fixture z-15 bg-sky-100 border-2 border-sky-500 rounded p-1 flex flex-col items-center justify-between cursor-move"
              style={{
                left: `${fixtures.window_left.x}px`,
                top: `${fixtures.window_left.y}px`,
                width: `${fixtures.window_left.width}px`,
                height: `${fixtures.window_left.height}px`,
                transform: `rotate(${fixtures.window_left.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'window_left', 'fixture', fixtures.window_left.x, fixtures.window_left.y)}
            >
              <div className="text-[7px] text-sky-800 font-bold rotate-90 my-auto">{t.window}</div>
            </div>
          )}

          {/* FIXTURE: Window Right */}
          {fixtures.window_right?.visible && (
            <div
              className="absolute draggable-fixture z-15 bg-sky-100 border-2 border-sky-500 rounded p-1 flex flex-col items-center justify-between cursor-move"
              style={{
                left: `${fixtures.window_right.x}px`,
                top: `${fixtures.window_right.y}px`,
                width: `${fixtures.window_right.width}px`,
                height: `${fixtures.window_right.height}px`,
                transform: `rotate(${fixtures.window_right.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'window_right', 'fixture', fixtures.window_right.x, fixtures.window_right.y)}
            >
              <div className="text-[7px] text-sky-800 font-bold rotate-90 my-auto">{t.window}</div>
            </div>
          )}

          {/* FIXTURE: Lockers */}
          {fixtures.lockers?.visible && (
            <div
              className="absolute draggable-fixture z-15 bg-slate-100 border-2 border-indigo-900 rounded p-1 shadow-sm flex items-center justify-around cursor-move"
              style={{
                left: `${fixtures.lockers.x}px`,
                top: `${fixtures.lockers.y}px`,
                width: `${fixtures.lockers.width}px`,
                height: `${fixtures.lockers.height}px`,
                transform: `rotate(${fixtures.lockers.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'lockers', 'fixture', fixtures.lockers.x, fixtures.lockers.y)}
            >
              <span className="text-[9px] font-bold text-indigo-950">{t.lockers}</span>
            </div>
          )}

          {/* FIXTURE: Bookshelf */}
          {fixtures.bookshelf?.visible && (
            <div
              className="absolute draggable-fixture z-15 bg-amber-800 border-2 border-amber-950 rounded p-1 shadow-sm flex items-center justify-around cursor-move text-white"
              style={{
                left: `${fixtures.bookshelf.x}px`,
                top: `${fixtures.bookshelf.y}px`,
                width: `${fixtures.bookshelf.width}px`,
                height: `${fixtures.bookshelf.height}px`,
                transform: `rotate(${fixtures.bookshelf.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'bookshelf', 'fixture', fixtures.bookshelf.x, fixtures.bookshelf.y)}
            >
              <span className="text-[9px] font-bold">{t.bookshelf}</span>
            </div>
          )}

          {/* FIXTURE: Plant */}
          {fixtures.plant?.visible && (
            <div
              className="absolute draggable-fixture z-15 w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-700 shadow-sm cursor-move"
              style={{
                left: `${fixtures.plant.x}px`,
                top: `${fixtures.plant.y}px`,
                transform: `rotate(${fixtures.plant.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, 'plant', 'fixture', fixtures.plant.x, fixtures.plant.y)}
            >
              <Flower2 className="w-4 h-4 text-emerald-600" />
            </div>
          )}

          {/* Student Desks Layer */}
          {assignedStudents.map((student) => {
            const isSelected = selectedStudentId === student.id;
            const isSwapSource = swapSourceId === student.id;
            const hasConflict = conflictingStudentIds.has(student.id);

            const perfColor =
              student.performance === 'high'
                ? 'bg-emerald-500'
                : student.performance === 'medium'
                ? 'bg-amber-500'
                : 'bg-rose-500';

            const borderClass = isSwapSource
              ? 'border-2 border-amber-500 ring-4 ring-amber-200'
              : hasConflict
              ? 'border-2 border-rose-500 ring-2 ring-rose-200'
              : isSelected
              ? 'border-2 border-indigo-600 ring-2 ring-indigo-200'
              : 'border border-indigo-400 hover:border-indigo-600';

            return (
              <div
                key={student.id}
                onClick={() => handleDeskClick(student)}
                onPointerDown={(e) => handlePointerDown(e, student.id, 'student', student.x, student.y)}
                className={`desk-card-item absolute rounded-lg bg-white shadow-sm flex flex-col justify-between overflow-hidden cursor-move transition-shadow z-20 ${borderClass}`}
                style={{
                  left: `${student.x}px`,
                  top: `${student.y}px`,
                  width: '84px',
                  height: '52px',
                  transform: `rotate(${student.rotation || 0}deg)`,
                }}
              >
                {/* Desk Header Pill */}
                <div className="bg-indigo-900 text-white px-1.5 py-0.5 flex items-center justify-between text-[7px] font-bold">
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${perfColor}`} />
                    <span className="tracking-wide truncate uppercase">{t.deskAssigned}</span>
                  </div>

                  <div className="flex items-center gap-0.5 fixture-ui-control">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRotateStudent(student.id);
                      }}
                      className="text-white hover:text-sky-300 p-0.5"
                      title={t.rotate}
                    >
                      <RotateCw className="w-2 h-2" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnassignStudent(student.id);
                      }}
                      className="text-white hover:text-rose-300 p-0.5"
                      title={t.unseat}
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                </div>

                {/* Desk Content: Student Name & Badges */}
                <div className="px-1.5 py-1 flex flex-col justify-center items-center text-center flex-1">
                  <span className="text-[9.5px] font-extrabold text-slate-800 leading-tight truncate w-full" title={student.name}>
                    {student.name}
                  </span>

                  <div className="flex items-center gap-1 mt-0.5">
                    {student.grade && (
                      <span className="text-[7px] font-black text-indigo-700 bg-indigo-50 px-1 rounded">
                        {student.grade}
                      </span>
                    )}
                    {student.traits.includes('mentor') && (
                      <GraduationCap className="w-2.5 h-2.5 text-emerald-600" title={t.mentor} />
                    )}
                    {student.traits.includes('front_row_need') && (
                      <Eye className="w-2.5 h-2.5 text-sky-600" title={t.frontRowNeed} />
                    )}
                    {student.traits.includes('chatty') && (
                      <MessageSquare className="w-2.5 h-2.5 text-amber-600" title={t.chatty} />
                    )}
                  </div>
                </div>

                {/* Conflict warning icon badge */}
                {hasConflict && (
                  <div
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-sm animate-bounce"
                    title={t.conflictsDetected}
                  >
                    <AlertTriangle className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Canvas Footer Controls */}
      <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
        <div className="bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1.5 rounded-lg border border-slate-700 shadow-md pointer-events-auto flex items-center gap-3">
          <span>{t.seatedCount}: <strong className="text-emerald-400">{assignedStudents.length}</strong> / {students.length}</span>
          {conflictingStudentIds.size > 0 && (
            <span className="text-rose-400 font-bold flex items-center gap-1 border-l border-slate-700 pl-3">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              {conflictPairs.length} {t.conflictsDetected}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

