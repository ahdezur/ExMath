import React from 'react';
import { Role, Course, StudentUser, University } from '../../types';
import { Play, Shield, BookOpen, UserCheck, LogOut, School, Sparkles, User } from 'lucide-react';

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (id: string) => void;
  studentUser: StudentUser | null;
  onOpenAuthModal: () => void;
  onLogoutStudent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  courses,
  activeCourseId,
  onSelectCourse,
  studentUser,
  onOpenAuthModal,
  onLogoutStudent,
}) => {
  const getUniLabel = (uni: University) => {
    switch (uni) {
      case 'uchile': return 'U. de Chile';
      case 'uandes': return 'U. de los Andes';
      case 'udd': return 'U. del Desarrollo';
    }
  };

  const getUniBadgeStyle = (uni: University) => {
    switch (uni) {
      case 'uchile': return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'uandes': return 'bg-teal-950 text-teal-300 border-teal-700';
      case 'udd': return 'bg-purple-950 text-purple-300 border-purple-700';
    }
  };

  // Filter courses visible to student if logged in
  const visibleCourses = courses.filter((c) => {
    if (role === 'admin') return true;
    if (!studentUser) return true; // Show all until filtered
    if (!c.targetUniversity || c.targetUniversity === 'all') return true;
    return c.targetUniversity === studentUser.university;
  });

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between z-30 shrink-0 shadow-md">
      {/* BRAND LOGO & COURSE SELECTOR */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center font-serif text-2xl font-black text-white shadow-lg shadow-cyan-500/20">
            ∑
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              ExMath
            </span>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Matemáticas Interactivas
            </span>
          </div>
        </div>

        {/* SELECTOR DE CURSO RÁPIDO */}
        <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800">
          <BookOpen size={16} className="text-cyan-400" />
          <select
            value={activeCourseId}
            onChange={(e) => onSelectCourse(e.target.value)}
            className="bg-slate-800 text-slate-200 text-sm font-semibold px-3 py-1.5 rounded-xl border border-slate-700 outline-none cursor-pointer focus:border-cyan-500 max-w-xs truncate"
          >
            {visibleCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name} {c.targetUniversity && c.targetUniversity !== 'all' ? `[${getUniLabel(c.targetUniversity)}]` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ESTUDIANTE USER BADGE & PERFIL ACCIONES */}
      <div className="flex items-center gap-3">
        {/* Student Session Information */}
        {studentUser ? (
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 pl-3 rounded-2xl">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1 justify-end">
                <User size={12} className="text-cyan-400" /> {studentUser.name}
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${getUniBadgeStyle(studentUser.university)}`}>
                {getUniLabel(studentUser.university)}
              </span>
            </div>
            <button
              onClick={onLogoutStudent}
              title="Cerrar sesión de estudiante"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-950 border border-cyan-700 text-cyan-300 hover:bg-cyan-900 transition-all shadow-sm"
          >
            <School size={15} /> Ingreso Estudiantes
          </button>
        )}

        {/* Profile Switcher Pill (Admin vs Presentador) */}
        <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center shadow-inner">
          <button
            onClick={() => onRoleChange('presenter')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'presenter'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play size={13} /> Presentación
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield size={13} /> Admin
          </button>
        </div>
      </div>
    </header>
  );
};
