import React, { useState, useEffect } from 'react';
import { StudentUser, University, OTPState } from '../../types';
import { Mail, ShieldCheck, Key, Clock, AlertCircle, Sparkles, CheckCircle2, UserCheck, School, Loader2, RefreshCw, Lock, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { sendOTPEmail } from '../../services/emailService';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: StudentUser) => void;
  students?: StudentUser[];
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  students = [],
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // REGISTER STATE
  const [regStep, setRegStep] = useState<'form' | 'otp'>('form');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // FORGOT PASSWORD STATE
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp_reset'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  // COMMON OTP & ERROR STATE
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendResultStatus, setSendResultStatus] = useState<{ success: boolean; message?: string } | null>(null);
  const [activeOTP, setActiveOTP] = useState<OTPState | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds

  // Reset messages when switching tabs
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setSendResultStatus(null);
  }, [tab, isForgotMode]);

  // Timer effect for OTP expiration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((regStep === 'otp' || forgotStep === 'otp_reset') && activeOTP) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((activeOTP.expiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setErrorMsg('El código de verificación ha expirado (límite de 5 minutos). Solicita uno nuevo.');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [regStep, forgotStep, activeOTP]);

  if (!isOpen) return null;

  const detectUniversity = (emailStr: string): University | null => {
    const clean = emailStr.trim().toLowerCase();
    if (clean.endsWith('@ug.uchile.cl')) return 'uchile';
    if (clean.endsWith('@miuandes.cl')) return 'uandes';
    if (clean.endsWith('@udd.cl')) return 'udd';
    if (clean.endsWith('@usm.cl')) return 'usm';
    if (clean.endsWith('@uc.cl')) return 'puc';
    return null;
  };

  const getUniversityName = (uni: University): string => {
    switch (uni) {
      case 'uchile': return 'Universidad de Chile';
      case 'uandes': return 'Universidad de los Andes';
      case 'udd': return 'Universidad del Desarrollo';
      case 'usm': return 'Universidad Técnica Federico Santa María';
      case 'puc': return 'Pontificia Universidad Católica';
    }
  };

  // Helper to get registered students from props or localStorage
  const getRegisteredStudents = (): StudentUser[] => {
    if (students && students.length > 0) return students;
    try {
      const saved = localStorage.getItem('exmath_students_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // --- HANDLER: INICIAR SESIÓN DIRECCIÓN EMAIL + CLAVE ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Ingresa tu correo institucional.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Ingresa tu contraseña.');
      return;
    }

    const registered = getRegisteredStudents();
    const foundUser = registered.find((s) => s.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      setErrorMsg('No existe una cuenta registrada con este correo. Ve a la pestaña "Registrarse" para crear tu cuenta.');
      return;
    }

    if (foundUser.password && foundUser.password !== loginPassword) {
      setErrorMsg('Contraseña incorrecta. Revisa tus datos o haz clic en "¿Olvidaste tu contraseña?".');
      return;
    }

    // Success login!
    onLoginSuccess(foundUser);
  };

  // --- HANDLER: ENVIAR CÓDIGO OTP PARA REGISTRO DE CUENTA ---
  const handleSendRegisterOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim()) {
      setErrorMsg('Por favor ingresa tu Nombre Completo.');
      return;
    }

    const uni = detectUniversity(regEmail);
    if (!uni) {
      setErrorMsg('Dominio no autorizado. Debes utilizar un correo institucional que termine en @ug.uchile.cl, @uc.cl, @usm.cl, @miuandes.cl o @udd.cl');
      return;
    }

    const cleanEmail = regEmail.trim().toLowerCase();
    const registered = getRegisteredStudents();
    const alreadyRegistered = registered.some((s) => s.email.toLowerCase() === cleanEmail);

    if (alreadyRegistered) {
      setErrorMsg('Este correo ya tiene una cuenta creada. Por favor dirígete a la pestaña "Iniciar Sesión".');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsSending(true);

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const universityName = getUniversityName(uni);

    const newOTP: OTPState = {
      email: cleanEmail,
      code: generatedCode,
      expiresAt,
      university: uni,
      name: regName.trim(),
      password: regPassword,
    };

    try {
      const res = await sendOTPEmail({
        toEmail: cleanEmail,
        recipientName: regName.trim(),
        code: generatedCode,
        universityName,
      });
      setSendResultStatus(res);
    } catch (err) {
      console.error('Error al enviar el correo:', err);
      setSendResultStatus({ success: false });
    } finally {
      setIsSending(false);
    }

    setActiveOTP(newOTP);
    setRegStep('otp');
    setTimeLeft(300);
    setOtpCode('');
  };

  // --- HANDLER: VERIFICAR OTP Y CREAR CUENTA ---
  const handleVerifyRegisterOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!activeOTP) return;

    if (Date.now() > activeOTP.expiresAt) {
      setErrorMsg('El código de 5 minutos ha expirado. Solicita un nuevo código.');
      return;
    }

    if (otpCode.trim() !== activeOTP.code) {
      setErrorMsg('Código incorrecto. Revisa los 6 dígitos recibidos en tu correo.');
      return;
    }

    // Success! Create Student Account
    const newStudent: StudentUser = {
      id: `student-${Date.now()}`,
      email: activeOTP.email,
      name: activeOTP.name,
      university: activeOTP.university,
      password: activeOTP.password,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    onLoginSuccess(newStudent);
  };

  // --- HANDLER: SOLICITAR OTP RECUPERACIÓN DE CLAVE ---
  const handleSendForgotOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const uni = detectUniversity(cleanEmail);
    if (!uni) {
      setErrorMsg('Ingresa un correo institucional válido.');
      return;
    }

    const registered = getRegisteredStudents();
    const foundUser = registered.find((s) => s.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      setErrorMsg('No se encontró ninguna cuenta registrada con este correo.');
      return;
    }

    setIsSending(true);

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const universityName = getUniversityName(uni);

    const newOTP: OTPState = {
      email: cleanEmail,
      code: generatedCode,
      expiresAt,
      university: uni,
      name: foundUser.name,
    };

    try {
      const res = await sendOTPEmail({
        toEmail: cleanEmail,
        recipientName: foundUser.name,
        code: generatedCode,
        universityName,
      });
      setSendResultStatus(res);
    } catch (err) {
      console.error('Error al enviar el correo:', err);
      setSendResultStatus({ success: false });
    } finally {
      setIsSending(false);
    }

    setActiveOTP(newOTP);
    setForgotStep('otp_reset');
    setTimeLeft(300);
    setOtpCode('');
  };

  // --- HANDLER: RECONFIGURAR CLAVE CON OTP ---
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!activeOTP) return;

    if (Date.now() > activeOTP.expiresAt) {
      setErrorMsg('El código de 5 minutos ha expirado. Solicita un nuevo código.');
      return;
    }

    if (otpCode.trim() !== activeOTP.code) {
      setErrorMsg('Código incorrecto. Revisa los 6 dígitos recibidos en tu correo.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    const registered = getRegisteredStudents();
    const foundUser = registered.find((s) => s.email.toLowerCase() === activeOTP.email);

    if (!foundUser) {
      setErrorMsg('Error al recuperar cuenta.');
      return;
    }

    const updatedUser: StudentUser = {
      ...foundUser,
      password: forgotNewPassword,
    };

    setSuccessMsg('¡Contraseña actualizada exitosamente! Iniciando sesión...');
    setTimeout(() => {
      onLoginSuccess(updatedUser);
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const detectedRegUni = detectUniversity(regEmail);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-5 text-slate-900 relative overflow-hidden">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-sm cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* Encabezado del Modal */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200 text-cyan-800 flex items-center justify-center mx-auto shadow-inner mb-2">
            <School size={26} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Acceso a Cursos ExMath</h2>
          <p className="text-xs text-slate-500 font-medium">
            Portal institucional exclusivo para estudiantes universitarios
          </p>
        </div>

        {/* PESTAÑAS PRINCIPALES: INICIAR SESIÓN vs REGISTRARSE (Si no está en olvido de clave) */}
        {!isForgotMode && regStep === 'form' && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-cyan-800 shadow-md border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn size={15} /> Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-cyan-800 shadow-md border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus size={15} /> Crear Cuenta (OTP)
            </button>
          </div>
        )}

        {/* ALERTA DE ERROR */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ALERTA DE ÉXITO */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FLUJO 1: INICIAR SESIÓN (CORREO + CONTRASEÑA PERSONAL) */}
        {/* ------------------------------------------------------------- */}
        {tab === 'login' && !isForgotMode && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Correo Institucional
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ejemplo@ug.uchile.cl | @uc.cl | @usm.cl"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                />
                <Mail className="absolute left-3 top-3 text-slate-400" size={17} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(true);
                    setForgotStep('email');
                    setForgotEmail(loginEmail);
                  }}
                  className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                />
                <Lock className="absolute left-3 top-3 text-slate-400" size={17} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={18} />
              <span>Iniciar Sesión Directa</span>
            </button>

            <div className="pt-2 text-center border-t border-slate-100">
              <span className="text-xs text-slate-500">¿Eres un estudiante nuevo? </span>
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-xs font-bold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
              >
                Crea tu cuenta aquí con tu correo institucional
              </button>
            </div>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FLUJO 2: REGISTRARSE (NOMBRE + CORREO + CLAVE -> VALIDACIÓN OTP) */}
        {/* ------------------------------------------------------------- */}
        {tab === 'register' && !isForgotMode && (
          <>
            {regStep === 'form' && (
              <form onSubmit={handleSendRegisterOTP} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Nombre Completo del Estudiante
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej: Camila Silva"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
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
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="ejemplo@ug.uchile.cl | @uc.cl | @usm.cl"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                    />
                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={17} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Crear Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mín. 6 caracteres"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repite la clave"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Previsualización de Universidad Detectada */}
                {detectedRegUni && (
                  <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan-700" />
                    <span>Universidad Detectada: <strong>{getUniversityName(detectedRegUni)}</strong></span>
                  </div>
                )}

                {/* Dominios Aceptados */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold block text-slate-800">Dominios Institucionales Aceptados:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold">@ug.uchile.cl</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-mono font-semibold">@uc.cl</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-semibold">@usm.cl</span>
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-semibold">@miuandes.cl</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-semibold">@udd.cl</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Enviando Código de Verificación OTP...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Verificar mi Correo con OTP y Crear Cuenta</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* PASO 2 DEL REGISTRO: VERIFICACIÓN CÓDIGO OTP */}
            {regStep === 'otp' && activeOTP && (
              <form onSubmit={handleVerifyRegisterOTP} className="space-y-4">
                <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-cyan-900 font-bold">
                    <Mail size={18} className="text-cyan-700" />
                    <span>Código OTP de Verificación Enviado</span>
                  </div>
                  <p>
                    Enviamos un código de 6 dígitos a <strong className="text-cyan-950 font-mono">{activeOTP.email}</strong> para validar tu correo institucional de <strong>{getUniversityName(activeOTP.university)}</strong>.
                  </p>
                  {sendResultStatus?.success === false && (
                    <div className="p-2 rounded bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px]">
                      ⚠️ Código en consola / simulador. (Revisa la consola si estás en desarrollo local).
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-600">
                      Código de 6 dígitos
                    </label>
                    <span className="text-xs font-bold text-cyan-700 flex items-center gap-1 font-mono">
                      <Clock size={14} /> Tiempo restante: {formatTime(timeLeft)}
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl font-mono font-extrabold tracking-widest text-cyan-900 focus:border-cyan-600 focus:bg-white outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRegStep('form')}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck size={16} /> Confirmar y Crear Cuenta
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FLUJO 3: OLVIDÉ MI CONTRASEÑA (RESTABLECER CON OTP) */}
        {/* ------------------------------------------------------------- */}
        {isForgotMode && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Key size={16} className="text-cyan-700" /> Recuperación de Contraseña
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(false);
                  setTab('login');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={13} /> Volver al Login
              </button>
            </div>

            {forgotStep === 'email' && (
              <form onSubmit={handleSendForgotOTP} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ingresa tu correo institucional registrado. Te enviaremos un código OTP de 6 dígitos para validar tu identidad y crear una nueva contraseña.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Correo Institucional Registrado
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="ejemplo@ug.uchile.cl | @uc.cl | @usm.cl"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                    />
                    <Mail className="absolute left-3 top-3 text-slate-400" size={17} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-6 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Enviando Código de Recuperación...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      <span>Enviar Código OTP a mi Correo</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {forgotStep === 'otp_reset' && activeOTP && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-slate-800 text-xs space-y-1">
                  <span className="font-bold block text-cyan-950">Código Enviado a: {activeOTP.email}</span>
                  <p>Ingresa los 6 dígitos del correo y tu nueva contraseña.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-600">
                      Código OTP (6 dígitos)
                    </label>
                    <span className="text-xs font-bold text-cyan-700 flex items-center gap-1 font-mono">
                      <Clock size={13} /> {formatTime(timeLeft)}
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-center text-xl font-mono font-extrabold text-cyan-900 focus:border-cyan-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Mín. 6 caracteres"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Confirmar Clave
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Repite la clave"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-cyan-600 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={18} /> Actualizar Contraseña e Iniciar Sesión
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
