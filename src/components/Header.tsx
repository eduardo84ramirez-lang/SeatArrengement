import React from 'react';
import { 
  FileDown, 
  Image as ImageIcon, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Save, 
  LogOut, 
  LogIn, 
  BarChart3,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, ClassroomLayout } from '../types';
import { Language, Translations } from '../lib/i18n';

interface HeaderProps {
  currentClassroom: ClassroomLayout;
  allClassrooms: ClassroomLayout[];
  onSelectClassroom: (id: string) => void;
  onNewClassroom: () => void;
  onSaveCloud: () => void;
  onExportPdf: () => void;
  onExportPng: () => void;
  syncStatus: 'saved' | 'saving' | 'offline' | 'error';
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenDiagnosis: () => void;
  metrics: {
    totalStudents: number;
    placedCount: number;
    conflictCount: number;
    frontRowCompliance: number;
    balanceScore: number;
  };
  t: Translations;
}

export const Header: React.FC<HeaderProps> = ({
  currentClassroom,
  allClassrooms,
  onSelectClassroom,
  onNewClassroom,
  onSaveCloud,
  onExportPdf,
  onExportPng,
  syncStatus,
  user,
  onOpenAuthModal,
  onLogout,
  language,
  onLanguageChange,
  onOpenDiagnosis,
  metrics,
  t,
}) => {
  return (
    <header className="h-14 bg-indigo-950 text-white flex items-center justify-between px-3 sm:px-6 shadow-md z-30 select-none border-b border-indigo-900">
      {/* Left: Branding & Classroom Selector */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm border border-indigo-400/40 shrink-0">
          M
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight uppercase text-white flex items-center gap-1.5">
              {t.appName}
            </h1>
            <span className="text-[9px] bg-indigo-800 text-indigo-200 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
              PRO
            </span>
          </div>
          <p className="text-[10px] text-indigo-300/80 hidden sm:block">{t.appSubtitle}</p>
        </div>

        {/* Classroom Switcher Dropdown */}
        <div className="hidden md:flex items-center ml-4 pl-3 border-l border-indigo-800/80">
          <select
            value={currentClassroom.id}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                onNewClassroom();
              } else {
                onSelectClassroom(e.target.value);
              }
            }}
            className="bg-indigo-900/90 text-xs font-semibold text-indigo-100 rounded-lg px-2.5 py-1.5 border border-indigo-700/80 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
          >
            {allClassrooms.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.name} ({c.students.length} {t.studentsCount})
              </option>
            ))}
            <option value="__new__" className="bg-slate-900 text-emerald-400 font-bold">
              {t.newClassroom}
            </option>
          </select>
        </div>
      </div>

      {/* Center/Right: Diagnóstico Pedagógico in Bar Menu + Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Diagnóstico Pedagógico Bar Menu Item */}
        <button
          onClick={onOpenDiagnosis}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-900/90 hover:bg-indigo-800/90 border border-indigo-700/90 text-white text-xs font-bold transition shadow-xs group"
          title={t.pedagogicalDiagnosis}
        >
          <BarChart3 className="w-4 h-4 text-indigo-300 group-hover:text-amber-300 transition-colors" />
          <span className="hidden sm:inline font-semibold">{t.pedagogicalDiagnosis}</span>
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
              metrics.balanceScore >= 80
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : metrics.balanceScore >= 60
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {metrics.conflictCount > 0 && <AlertTriangle className="w-3 h-3 text-rose-300" />}
            {metrics.balanceScore}%
          </span>
        </button>

        {/* Language Selector Switcher (ES / EN / FR) */}
        <div className="flex items-center bg-indigo-900/90 border border-indigo-700/90 rounded-lg p-0.5 text-[11px] font-bold">
          <button
            onClick={() => onLanguageChange('es')}
            className={`px-2 py-1 rounded transition-colors ${
              language === 'es'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-300 hover:text-white'
            }`}
            title="Español"
          >
            ES
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded transition-colors ${
              language === 'en'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-300 hover:text-white'
            }`}
            title="English"
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('fr')}
            className={`px-2 py-1 rounded transition-colors ${
              language === 'fr'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-300 hover:text-white'
            }`}
            title="Français"
          >
            FR
          </button>
        </div>

        {/* Sync Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-indigo-900/60 border border-indigo-800 px-2.5 py-1 rounded-md text-[11px] font-medium text-indigo-200">
          {syncStatus === 'saving' && (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{t.syncSaving}</span>
            </>
          )}
          {syncStatus === 'saved' && (
            <>
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.syncSaved}</span>
            </>
          )}
          {syncStatus === 'offline' && (
            <>
              <CloudOff className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.syncOffline}</span>
            </>
          )}
          {syncStatus === 'error' && (
            <>
              <CloudOff className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.syncError}</span>
            </>
          )}
        </div>

        {/* Save Cloud Button */}
        <button
          onClick={onSaveCloud}
          className="text-xs bg-indigo-800 hover:bg-indigo-700 text-indigo-100 px-2.5 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 border border-indigo-700 shadow-xs"
          title={t.saveCloud}
        >
          <Save className="w-3.5 h-3.5 text-indigo-300" />
          <span className="hidden xl:inline">{t.saveCloud}</span>
        </button>

        {/* Export PDF Button (Isolated Room Canvas) */}
        <button
          onClick={onExportPdf}
          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md font-bold transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-950/20"
          title={t.exportPdf}
        >
          <FileDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.exportPdf}</span>
        </button>

        {/* Export PNG Button */}
        <button
          onClick={onExportPng}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5"
          title={t.exportPng}
        >
          <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden 2xl:inline">{t.exportPng}</span>
        </button>

        <div className="h-5 w-[1px] bg-indigo-800/80 mx-1"></div>

        {/* Teacher Auth / User Profile */}
        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-indigo-900/80 border border-indigo-700/80 px-2.5 py-1 rounded-md">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.displayName?.charAt(0) || 'D'}
                </div>
              )}
              <span className="text-xs font-semibold text-indigo-100 max-w-[120px] truncate">
                {user.email || user.displayName}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-indigo-300 hover:text-rose-300 hover:bg-indigo-900 rounded-md transition"
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.loginGoogle}</span>
          </button>
        )}
      </div>
    </header>
  );
};
