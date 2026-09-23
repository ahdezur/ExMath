import React, { useState, useEffect } from 'react';
import { StudentUser, University, OTPState } from '../../types';
import { Mail, ShieldCheck, Key, Clock, AlertCircle, Sparkles, CheckCircle2, UserCheck, School } from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: StudentUser) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeOTP, setActiveOTP] = useState<OTPState | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds

  // Timer effect for OTP expiration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && activeOTP) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((activeOTP.expiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setErrorMsg('El código de verificación ha expirado (límite de 5 minutos). Solicita uno nuevo.');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, activeOTP]);

  if (!isOpen) return null;

  const detectUniversity = (emailStr: string): University | null => {
    const clean = emailStr.trim().toLowerCase();
    if (clean.endsWith('@ug.uchile.cl')) return 'uchile';
    if (clean.endsWith('@miuandes.cl')) return 'uandes';
    if (clean.endsWith('@udd.cl')) return 'udd';
    return null;
  };

  const getUniversityName = (uni: University): string => {
    switch (uni) {
      case 'uchile': return 'Universidad de Chile';
      case 'uandes': return 'Universidad de los Andes';
      case 'udd': return 'Universidad del Desarrollo';
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor ingresa tu Nombre Completo.');
      return;
    }

    const uni = detectUniversity(email);
    if (!uni) {
      setErrorMsg('Dominio no autorizado. Debes utilizar un correo institucional que termine en @ug.uchile.cl, @miuandes.cl o @udd.cl');
      return;
    }

    // Generate random 6-digit code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const newOTP: OTPState = {
      email: email.trim().toLowerCase(),
      code: generatedCode,
      expiresAt,
      university: uni,
      name: name.trim(),
    };

    setActiveOTP(newOTP);
    setStep('otp');
    setTimeLeft(300);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!activeOTP) return;

    if (Date.now() > activeOTP.expiresAt) {
      setErrorMsg('El código de 5 minutos ha expirado. Haz clic en reenviar código.');
      return;
    }

    if (otpCode.trim() !== activeOTP.code) {
      setErrorMsg('Código incorrecto. Verifica los 6 dígitos recibidos.');
      return;
    }

    // Success! Create Student Account
    const newStudent: StudentUser = {
      id: `student-${Date.now()}`,
      email: activeOTP.email,
      name: activeOTP.name,
      university: activeOTP.university,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    onLoginSuccess(newStudent);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const detectedUni = detectUniversity(email);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-slate-900 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-sm"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-100 border border-cyan-200 text-cyan-800 flex items-center justify-center mx-auto shadow-inner">
            <School size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Acceso a Cursos Institucionales</h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Ingreso exclusivo para estudiantes de U. de Chile, U. de los Andes y U. del Desarrollo.
          </p>
        </div>

        {/* ERROR BADGE */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: REGISTRO CON CORREO INSTITUCIONAL */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Nombre Completo del Estudiante
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Camila Silva"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Correo Institucional
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@ug.uchile.cl | @miuandes.cl | @udd.cl"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                />
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            {/* University Tag Detector Preview */}
            {detectedUni && (
              <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-cyan-700" />
                <span>Universidad Detectada: <strong>{getUniversityName(detectedUni)}</strong></span>
              </div>
            )}

            {/* University Badge rules info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold block text-slate-800">Dominios Aceptados:</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold">@ug.uchile.cl</span>
                <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-semibold">@miuandes.cl</span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-semibold">@udd.cl</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} /> Solicitar Código de Verificación (5 min)
            </button>
          </form>
        )}

        {/* STEP 2: VERIFICACIÓN CÓDIGO OTP (5 MINUTOS) */}
        {step === 'otp' && activeOTP && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            {/* Simulated Email Inbox Drawer Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2 text-amber-950">
              <div className="flex items-center justify-between text-xs font-bold border-b border-amber-200 pb-2">
                <span className="flex items-center gap-1 text-amber-900">
                  <Sparkles size={14} /> Simulación de Envíos de Correo OTP
                </span>
                <span className="font-mono text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
                  {activeOTP.email}
                </span>
              </div>
              <p className="text-xs">
                Se envió un código temporal de 6 dígitos a tu casilla de correo:
              </p>
              <div className="text-center py-2 bg-white rounded-xl border border-amber-300 shadow-inner">
                <span className="text-2xl font-mono font-black tracking-widest text-amber-900">
                  {activeOTP.code}
                </span>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center justify-between px-2 text-xs font-semibold">
              <span className="text-slate-600">Tiempo restante del código:</span>
              <span className={`font-mono text-sm px-2 py-0.5 rounded ${
                timeLeft < 60 ? 'bg-rose-100 text-rose-800 font-bold animate-pulse' : 'bg-slate-100 text-cyan-800 font-bold'
              }`}>
                <Clock size={14} className="inline mr-1" />
                {formatTime(timeLeft)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Ingresa el Código de 6 Dígitos
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest text-slate-900 font-bold focus:border-cyan-600 focus:bg-white outline-none"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <UserCheck size={18} /> Confirmar e Ingresar a Cursos
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setErrorMsg('');
                }}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Volver o cambiar correo electrónico
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
