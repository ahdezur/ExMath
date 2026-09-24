import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Course, Slide, Question, UserResponseState, Role } from '../../types';
import { MathText } from '../../utils/katexRenderer';
import { QuestionRenderer } from '../questions/QuestionRenderer';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Grid, 
  BookOpen, 
  CheckCircle,
  Sparkles,
  Sun,
  Moon,
  MessageSquare,
  HelpCircle,
  FileQuestion
} from 'lucide-react';

interface PresentationViewProps {
  course: Course;
  questions: Question[];
  userResponses: UserResponseState;
  onResponseChange: (questionId: string, stateUpdate: any) => void;
  role?: Role;
  isStudent?: boolean;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  course,
  questions,
  userResponses,
  onResponseChange,
  role = 'presenter',
  isStudent = false,
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [lightTheme, setLightTheme] = useState(true);

  // Fullscreen hover / auto-hide control state
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = course.slides;
  const currentSlide: Slide | undefined = slides[currentSlideIdx];
  const embeddedQuestion = currentSlide?.questionId 
    ? questions.find(q => q.id === currentSlide.questionId)
    : undefined;

  const goToNext = useCallback(() => {
    setCurrentSlideIdx((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentSlideIdx((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    if (document.fullscreenElement) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, []);

  const handleControlMouseEnter = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
  };

  const handleControlMouseLeave = () => {
    if (document.fullscreenElement) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1500);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      if (!isFS) {
        setShowControls(true);
        if (hideControlsTimerRef.current) {
          clearTimeout(hideControlsTimerRef.current);
        }
      } else {
        handleMouseMove();
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [handleMouseMove]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user typing in a textarea/input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlideIdx(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlideIdx(slides.length - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, slides.length]);

  if (!currentSlide) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
        <BookOpen size={48} className="mb-4 text-slate-600" />
        <h2 className="text-2xl font-bold text-slate-200">Este curso no tiene diapositivas cargadas</h2>
        <p className="mt-2 text-sm">Cambia al perfil de Administrador para agregar diapositivas.</p>
      </div>
    );
  }

  const progressPercent = ((currentSlideIdx + 1) / slides.length) * 100;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative h-full flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
        lightTheme ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* BARRA SUPERIOR DE CONTROL PPT */}
      <div
        onMouseEnter={handleControlMouseEnter}
        onMouseLeave={handleControlMouseLeave}
        className={`px-6 py-3 border-b flex items-center justify-between shrink-0 transition-all duration-300 backdrop-blur-md ${
          lightTheme ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-slate-900/95 border-slate-800 text-slate-200'
        } ${
          isFullscreen
            ? `fixed top-0 left-0 right-0 z-50 shadow-xl ${
                showControls ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
              }`
            : 'relative z-10 translate-y-0 opacity-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${course.color} text-white shadow-sm`}>
            {course.code}
          </span>
          <h1 className="font-bold text-lg hidden sm:block truncate max-w-md">
            {course.name}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Notes Toggle (Solo visible para el Orador / Docente, NUNCA para Alumnos) */}
          {!isStudent && role !== 'student' && currentSlide.notes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                showNotes 
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300' 
                  : lightTheme ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Notas Privadas del Orador (Docente)"
            >
              <MessageSquare size={16} /> <span className="hidden md:inline">Notas Orador</span>
            </button>
          )}

          {/* Slide Grid Drawer */}
          <button
            onClick={() => setShowGridModal(true)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
              lightTheme ? 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Ver todas las diapositivas"
          >
            <Grid size={16} /> <span className="hidden md:inline">Diapositivas</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setLightTheme(!lightTheme)}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
              lightTheme ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Cambiar tema claro/oscuro para proyector"
          >
            {lightTheme ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
              lightTheme ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Pantalla Completa (F)"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL DE LA DIAPOSITIVA (PPT STAGE FIJO SIN SCROLL DE PÁGINA) */}
      <div className="flex-1 overflow-hidden p-3 sm:p-6 md:p-8 flex flex-col justify-center items-center relative min-h-0 w-full">
        <div className={`w-full max-w-6xl h-full ${
          isFullscreen ? 'max-h-[94vh]' : 'max-h-[calc(100vh-140px)]'
        } rounded-3xl border p-6 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 relative ${
          lightTheme 
            ? 'bg-white border-slate-200 shadow-slate-300/50' 
            : 'bg-slate-900/90 border-slate-800/90 shadow-cyan-950/20'
        }`}>
          {/* Header de la Diapositiva */}
          <div className="mb-4 md:mb-6 border-b border-slate-700/30 pb-4 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                lightTheme ? 'text-cyan-700' : 'text-cyan-400'
              }`}>
                <Sparkles size={14} /> Slide {currentSlideIdx + 1}
              </span>
              {embeddedQuestion && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                  lightTheme 
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold' 
                    : 'bg-cyan-950 border border-cyan-800 text-cyan-300'
                }`}>
                  <FileQuestion size={14} /> Ejercicio Interactivo Vinculado
                </span>
              )}
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
              lightTheme ? 'text-slate-900' : 'text-white'
            }`}>
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className={`mt-1 text-base md:text-lg font-semibold ${
                lightTheme ? 'text-cyan-700' : 'text-cyan-400'
              }`}>
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* CONTENIDO SEGÚN LAYOUT */}
          <div className="flex-1 min-h-0 flex flex-col justify-center overflow-y-auto pr-1">
            {currentSlide.layout === 'title' && (
              <div className="py-6 text-center space-y-6 max-w-3xl mx-auto">
                <div className={`text-xl md:text-2xl leading-relaxed ${lightTheme ? 'text-slate-800' : 'text-slate-100'}`}>
                  <MathText content={currentSlide.content} lightTheme={lightTheme} />
                </div>
              </div>
            )}

            {currentSlide.layout === 'theorem' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${
                  lightTheme 
                    ? 'bg-cyan-50/90 border-cyan-200 text-slate-800 shadow-sm' 
                    : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-100'
                }`}>
                  <MathText content={currentSlide.content} lightTheme={lightTheme} />
                </div>
                {embeddedQuestion && (
                  <div className="mt-6">
                    <QuestionRenderer
                      question={embeddedQuestion}
                      userState={userResponses[embeddedQuestion.id]}
                      onStateChange={(update) => onResponseChange(embeddedQuestion.id, update)}
                      lightTheme={lightTheme}
                    />
                  </div>
                )}
              </div>
            )}

            {currentSlide.layout === 'split_question' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className={`space-y-4 text-lg ${lightTheme ? 'text-slate-800' : 'text-slate-100'}`}>
                  <MathText content={currentSlide.content} lightTheme={lightTheme} />
                </div>
                <div>
                  {embeddedQuestion ? (
                    <QuestionRenderer
                      question={embeddedQuestion}
                      userState={userResponses[embeddedQuestion.id]}
                      onStateChange={(update) => onResponseChange(embeddedQuestion.id, update)}
                      lightTheme={lightTheme}
                    />
                  ) : (
                    <div className={`p-8 rounded-2xl border border-dashed text-center ${
                      lightTheme ? 'border-slate-300 text-slate-500 bg-slate-50' : 'border-slate-700 text-slate-500 bg-slate-900/40'
                    }`}>
                      Sin pregunta vinculada a esta diapositiva.
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentSlide.layout === 'full_exercise' && (
              <div className="space-y-6">
                <div className={`text-lg ${lightTheme ? 'text-slate-800' : 'text-slate-100'}`}>
                  <MathText content={currentSlide.content} lightTheme={lightTheme} />
                </div>
                {embeddedQuestion && (
                  <QuestionRenderer
                    question={embeddedQuestion}
                    userState={userResponses[embeddedQuestion.id]}
                    onStateChange={(update) => onResponseChange(embeddedQuestion.id, update)}
                    lightTheme={lightTheme}
                  />
                )}
              </div>
            )}

            {currentSlide.layout === 'content' && (
              <div className={`space-y-6 text-lg ${lightTheme ? 'text-slate-800' : 'text-slate-100'}`}>
                <MathText content={currentSlide.content} lightTheme={lightTheme} />
                {embeddedQuestion && (
                  <div className="mt-8">
                    <QuestionRenderer
                      question={embeddedQuestion}
                      userState={userResponses[embeddedQuestion.id]}
                      onStateChange={(update) => onResponseChange(embeddedQuestion.id, update)}
                      lightTheme={lightTheme}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SPEAKER NOTES DRAWER (NOTAS PRIVADAS DEL ORADOR) */}
      {!isStudent && role !== 'student' && showNotes && currentSlide.notes && (
        <div className={`px-6 py-4 bg-slate-900 border-t border-cyan-500/40 text-cyan-100 flex items-start gap-3 text-sm backdrop-blur-md shadow-2xl transition-all duration-300 ${
          isFullscreen
            ? `fixed bottom-16 left-0 right-0 z-40 ${
                showControls ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
              }`
            : 'relative z-20'
        }`}>
          <MessageSquare className="text-cyan-400 shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-bold text-cyan-300 block mb-0.5">💬 Notas Privadas del Orador (Solo visibles para el Docente):</span>
            <p className="leading-relaxed text-xs md:text-sm">{currentSlide.notes}</p>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR DE NAVEGACIÓN PPT */}
      <div
        onMouseEnter={handleControlMouseEnter}
        onMouseLeave={handleControlMouseLeave}
        className={`px-6 py-3 border-t flex items-center justify-between shrink-0 transition-all duration-300 backdrop-blur-md ${
          lightTheme ? 'bg-white/95 border-slate-200' : 'bg-slate-900/95 border-slate-800'
        } ${
          isFullscreen
            ? `fixed bottom-0 left-0 right-0 z-50 shadow-xl ${
                showControls ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
              }`
            : 'relative z-10 translate-y-0 opacity-100'
        }`}
      >
        {/* Previous Button */}
        <button
          onClick={goToPrev}
          disabled={currentSlideIdx === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
            currentSlideIdx === 0
              ? 'opacity-40 cursor-not-allowed text-slate-500'
              : lightTheme 
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
          }`}
        >
          <ChevronLeft size={20} /> Anterior
        </button>

        {/* Progress indicator */}
        <div className="flex flex-col items-center gap-1.5 max-w-xs w-full px-4">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${course.color} transition-all duration-300`} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Diapositiva {currentSlideIdx + 1} de {slides.length}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={currentSlideIdx === slides.length - 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
            currentSlideIdx === slides.length - 1
              ? 'opacity-40 cursor-not-allowed text-slate-500'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg'
          }`}
        >
          Siguiente <ChevronRight size={20} />
        </button>
      </div>

      {/* MODAL GRID DE DIAPOSITIVAS (THUMBNAIL DRAWER) */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Grid className="text-cyan-400" size={20} /> Navegador de Diapositivas
              </h3>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6 overflow-y-auto">
              {slides.map((s, idx) => {
                const isActive = idx === currentSlideIdx;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSlideIdx(idx);
                      setShowGridModal(false);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-32 relative overflow-hidden group ${
                      isActive 
                        ? 'border-cyan-500 bg-cyan-950/40 ring-2 ring-cyan-500/50' 
                        : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-cyan-400 block mb-1">
                        Slide {idx + 1}
                      </span>
                      <h4 className="font-semibold text-sm text-slate-200 line-clamp-2">
                        {s.title}
                      </h4>
                    </div>
                    {s.questionId && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 self-start">
                        ✓ Ejercicio
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
