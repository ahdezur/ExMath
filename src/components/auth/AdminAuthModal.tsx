import React, { useState } from 'react';
import { ShieldAlert, Lock, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminPasswordHash: string; // Current admin password string
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  adminPasswordHash,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLocked) {
      setErrorMsg(`Sistema bloqueado temporalmente. Intenta nuevamente en ${lockTimer} segundos.`);
      return;
    }

    if (inputPassword.trim() === adminPasswordHash) {
      // Success!
      setInputPassword('');
      setErrorMsg('');
      setFailedAttempts(0);
      onSuccess();
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      setInputPassword('');

      if (attempts >= 5) {
        setIsLocked(true);
        setLockTimer(30);
        setErrorMsg('Demasiados intentos fallidos. Acceso bloqueado por 30 segundos por seguridad.');

        const interval = setInterval(() => {
          setLockTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsLocked(false);
              setFailedAttempts(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrorMsg(`Clave maestra incorrecta. Intentos restantes: ${5 - attempts}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-slate-900 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-sm cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Acceso Administrador</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Ingresa la Clave Maestra de Docente para ingresar al panel de administración.
            </p>
          </div>
        </div>

        {/* ERROR BADGE */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Clave Maestra Docente / Admin
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked}
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-12 py-3.5 text-base text-slate-900 font-mono font-bold focus:border-indigo-600 focus:bg-white outline-none transition-all disabled:opacity-50"
              />
              <KeyRound className="absolute left-3.5 top-4 text-slate-400" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2">
            <ShieldCheck size={16} className="text-purple-700 shrink-0" />
            <span>Clave predeterminada inicial: <strong>admin123</strong> (puedes cambiarla dentro del panel).</span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isLocked || !inputPassword.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Autenticar e Ingresar al Panel</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer text-center"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
