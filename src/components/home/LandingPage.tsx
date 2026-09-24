import React from 'react';
import { School, ShieldCheck, Sparkles, BookOpen, Layers, CheckCircle2, ArrowRight, Lock, UserCheck } from 'lucide-react';

interface LandingPageProps {
  onOpenAuthModal: () => void;
  onAdminAccess: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuthModal,
  onAdminAccess,
}) => {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-cyan-50/30 to-slate-100 text-slate-900 flex flex-col justify-between overflow-y-auto">
      {/* Top Navbar Header */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center font-serif text-2xl font-black text-white shadow-md shadow-cyan-500/20">
            ∑
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
              ExMath
            </span>
            <span className="block text-[10px] font-bold text-cyan-700 uppercase tracking-wider">
              Plataforma de Presentaciones Matemáticas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAdminAccess}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <Lock size={14} className="text-purple-600" /> Acceso Docente
          </button>
          <button
            onClick={onOpenAuthModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all flex items-center gap-1.5"
          >
            <School size={14} /> Ingreso Estudiantes
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-4 md:py-6 flex-1 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-bold shadow-sm animate-fadeIn">
          <Sparkles size={13} className="text-cyan-600" />
          <span>Presentaciones Matemáticas e Interactivas en Alta Definición</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Aprende y Evalúa Matemáticas de Forma <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Interactiva</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Accede a certámenes, guías y contenido exclusivo de presentaciones validando tu correo institucional con nuestro código de seguridad OTP.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-1">
          <button
            onClick={onOpenAuthModal}
            className="py-3.5 px-7 rounded-2xl font-extrabold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-xl shadow-cyan-600/25 hover:shadow-cyan-600/35 transition-all text-base flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <School size={20} />
            <span>Ingresar con Correo Institucional</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Highlights Grid (2 Columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 max-w-2xl w-full mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-left space-y-1 hover:border-cyan-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-serif text-lg font-bold">
              ∑
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Notación KaTeX Nítida</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Renderizado instantáneo de ecuaciones y demostraciones matemáticas en fondo claro de alto contraste.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-left space-y-1 hover:border-cyan-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">5 Tipos de Ejercicios</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Preguntas de Verdadero/Falso, Selección Múltiple, Casillas, Rellenar Blancos y Desarrollo con Pauta.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-slate-200 bg-white text-center text-[11px] text-slate-500 font-medium shrink-0">
        <p>© ExMath • Plataforma Interactiva de Matemáticas Institucionales</p>
      </footer>
    </div>
  );
};
