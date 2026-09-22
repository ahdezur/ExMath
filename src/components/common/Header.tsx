import React from 'react';
import { Role, Course } from '../../types';
import { Play, Shield, BookOpen, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (id: string) => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  courses,
  activeCourseId,
  onSelectCourse,
  onResetDemo,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between z-30 shrink-0 shadow-md">
      {/* BRAND LOGO */}
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
            className="bg-slate-800 text-slate-200 text-sm font-semibold px-3 py-1.5 rounded-xl border border-slate-700 outline-none cursor-pointer focus:border-cyan-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTROLES DE PERFIL (ADMIN VS PRESENTADOR) */}
      <div className="flex items-center gap-3">
        {/* Profile Switcher Pill */}
        <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center shadow-inner">
          <button
            onClick={() => onRoleChange('presenter')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'presenter'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play size={14} /> Presentación PPT
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield size={14} /> Administración
          </button>
        </div>
      </div>
    </header>
  );
};
