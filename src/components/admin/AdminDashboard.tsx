import React, { useState } from 'react';
import { Course, Slide, Question, SlideLayout } from '../../types';
import { QuestionEditor } from './QuestionEditor';
import { MathText } from '../../utils/katexRenderer';
import { 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  FileQuestion,
  CheckCircle2,
  Eye
} from 'lucide-react';

interface AdminDashboardProps {
  courses: Course[];
  questions: Question[];
  activeCourseId: string;
  onSelectCourse: (id: string) => void;
  onUpdateCourses: (courses: Course[]) => void;
  onUpdateQuestions: (questions: Question[]) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  questions,
  activeCourseId,
  onSelectCourse,
  onUpdateCourses,
  onUpdateQuestions,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'slides' | 'questions' | 'data'>('slides');
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [questionFilterType, setQuestionFilterType] = useState<string>('all');

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];
  const courseQuestions = questions.filter((q) => q.courseId === activeCourse?.id);

  // --- GESTIÓN DE CURSOS ---
  const handleAddCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      code: 'MAT-999',
      name: 'Nuevo Curso Matemático',
      description: 'Descripción del nuevo curso...',
      color: 'from-purple-600 to-pink-500',
      slides: [
        {
          id: `slide-${Date.now()}-1`,
          courseId: `course-${Date.now()}`,
          title: 'Diapositiva Inicial',
          subtitle: 'Bienvenida',
          layout: 'title',
          content: 'Bienvenido al curso de matemáticas.',
        },
      ],
    };
    onUpdateCourses([...courses, newCourse]);
    onSelectCourse(newCourse.id);
  };

  const handleDeleteCourse = (id: string) => {
    if (courses.length <= 1) {
      alert('Debe existir al menos un curso.');
      return;
    }
    if (confirm('¿Está seguro de eliminar este curso y sus diapositivas?')) {
      const filtered = courses.filter((c) => c.id !== id);
      onUpdateCourses(filtered);
      if (activeCourseId === id) {
        onSelectCourse(filtered[0].id);
      }
    }
  };

  // --- GESTIÓN DE SLIDES ---
  const handleSaveSlide = (slide: Slide) => {
    if (!activeCourse) return;
    const updatedSlides = activeCourse.slides.map((s) => (s.id === slide.id ? slide : s));
    const updatedCourse = { ...activeCourse, slides: updatedSlides };
    onUpdateCourses(courses.map((c) => (c.id === activeCourse.id ? updatedCourse : c)));
    setEditingSlide(null);
  };

  const handleAddSlide = () => {
    if (!activeCourse) return;
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      courseId: activeCourse.id,
      title: 'Nueva Diapositiva Matemática',
      subtitle: 'Subtítulo o Teorema',
      layout: 'content',
      content: 'Escriba aquí el contenido en **Markdown** o ecuaciones $\\text{LaTeX}$.',
    };
    const updatedCourse = {
      ...activeCourse,
      slides: [...activeCourse.slides, newSlide],
    };
    onUpdateCourses(courses.map((c) => (c.id === activeCourse.id ? updatedCourse : c)));
    setEditingSlide(newSlide);
  };

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    if (!activeCourse) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= activeCourse.slides.length) return;

    const slidesCopy = [...activeCourse.slides];
    const temp = slidesCopy[idx];
    slidesCopy[idx] = slidesCopy[newIdx];
    slidesCopy[newIdx] = temp;

    const updatedCourse = { ...activeCourse, slides: slidesCopy };
    onUpdateCourses(courses.map((c) => (c.id === activeCourse.id ? updatedCourse : c)));
  };

  const handleDeleteSlide = (slideId: string) => {
    if (!activeCourse) return;
    if (confirm('¿Eliminar esta diapositiva?')) {
      const updatedSlides = activeCourse.slides.filter((s) => s.id !== slideId);
      const updatedCourse = { ...activeCourse, slides: updatedSlides };
      onUpdateCourses(courses.map((c) => (c.id === activeCourse.id ? updatedCourse : c)));
      if (editingSlide?.id === slideId) setEditingSlide(null);
    }
  };

  // --- GESTIÓN DE PREGUNTAS ---
  const handleSaveQuestion = (q: Question) => {
    const exists = questions.some((item) => item.id === q.id);
    let updated: Question[];
    if (exists) {
      updated = questions.map((item) => (item.id === q.id ? q : item));
    } else {
      updated = [...questions, q];
    }
    onUpdateQuestions(updated);
    setIsCreatingQuestion(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (confirm('¿Eliminar esta pregunta del banco?')) {
      onUpdateQuestions(questions.filter((q) => q.id !== qId));
    }
  };

  // --- IMPORTAR Y EXPORTAR ---
  const handleExportJSON = () => {
    const data = { courses, questions };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exmath-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.courses && parsed.questions) {
          onUpdateCourses(parsed.courses);
          onUpdateQuestions(parsed.questions);
          alert('¡Base de datos cargada con éxito!');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      {/* HEADER DEL DASHBOARD DE ADMIN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Panel de Control del Docente
          </span>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            Administración de Cursos & Contenidos
          </h1>
        </div>

        {/* Course Selector for Active Editing */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 pl-2">Curso Activo:</span>
          <select
            value={activeCourseId}
            onChange={(e) => onSelectCourse(e.target.value)}
            className="bg-slate-800 text-cyan-300 font-bold px-3 py-1.5 rounded-xl border border-slate-700 outline-none cursor-pointer"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PESTAÑAS NAVEGACIÓN */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'slides'
              ? 'bg-cyan-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers size={18} /> Editor de Diapositivas ({activeCourse?.slides.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'questions'
              ? 'bg-cyan-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle size={18} /> Banco de Preguntas ({courseQuestions.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-cyan-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen size={18} /> Cursos ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'data'
              ? 'bg-cyan-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Save size={18} /> Datos & Copia de Seguridad
        </button>
      </div>

      {/* CONTENIDO PESTAÑA 1: DIAPOSITIVAS */}
      {activeTab === 'slides' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="text-cyan-400" /> Diapositivas de "{activeCourse?.name}"
            </h2>
            <button
              onClick={handleAddSlide}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg transition-all"
            >
              <Plus size={18} /> Agregar Diapositiva
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Slides */}
            <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {activeCourse?.slides.map((s, idx) => {
                const isSelected = editingSlide?.id === s.id;
                return (
                  <div
                    key={s.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/40 ring-1 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => setEditingSlide(s)}
                      className="flex-1 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-cyan-400 block mb-0.5">
                        Slide {idx + 1} • {s.layout}
                      </span>
                      <h4 className="font-semibold text-white text-sm line-clamp-1">{s.title}</h4>
                      {s.questionId && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 inline-block mt-1">
                          ✓ Con Pregunta
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingSlide(s)}
                        title="Ver / Editar Vista Previa"
                        className={`p-1.5 rounded transition-colors ${
                          isSelected ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800 text-cyan-400'
                        }`}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === activeCourse.slides.length - 1}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(s.id)}
                        className="p-1.5 rounded hover:bg-slate-800 text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Editor de la Slide Seleccionada */}
            <div className="lg:col-span-2">
              {editingSlide ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-lg text-white">
                      Editando Diapositiva: {editingSlide.title}
                    </h3>
                    <button
                      onClick={() => setEditingSlide(null)}
                      className="text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Cerrar Editor
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Título Principal
                      </label>
                      <input
                        type="text"
                        value={editingSlide.title}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, title: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Subtítulo
                      </label>
                      <input
                        type="text"
                        value={editingSlide.subtitle || ''}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Diseño / Layout PPT
                      </label>
                      <select
                        value={editingSlide.layout}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            layout: e.target.value as SlideLayout,
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-medium focus:border-cyan-500 outline-none"
                      >
                        <option value="title">Título de Portada</option>
                        <option value="content">Contenido Estándar</option>
                        <option value="theorem">Caja Destacada de Teorema</option>
                        <option value="split_question">Pantalla Dividida (Texto + Pregunta)</option>
                        <option value="full_exercise">Ejercicio de Desarrollo Completo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                        Pregunta Vinculada del Banco
                      </label>
                      <select
                        value={editingSlide.questionId || ''}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            questionId: e.target.value || undefined,
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-medium focus:border-cyan-500 outline-none"
                      >
                        <option value="">-- Ninguna --</option>
                        {courseQuestions.map((q) => (
                          <option key={q.id} value={q.id}>
                            [{q.type}] {q.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                      Contenido (Markdown + LaTeX $...$ ó $$...$$)
                    </label>
                    <textarea
                      rows={5}
                      value={editingSlide.content}
                      onChange={(e) =>
                        setEditingSlide({ ...editingSlide, content: e.target.value })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono text-sm text-slate-100 focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                      Notas Privadas del Orador
                    </label>
                    <input
                      type="text"
                      value={editingSlide.notes || ''}
                      onChange={(e) =>
                        setEditingSlide({ ...editingSlide, notes: e.target.value })
                      }
                      placeholder="Instrucciones para el profesor durante la presentación..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
                    />
                  </div>

                  <div className="flex justify-end pt-2 border-b border-slate-800 pb-4">
                    <button
                      onClick={() => handleSaveSlide(editingSlide)}
                      className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-2"
                    >
                      <Save size={18} /> Guardar Cambios en Diapositiva
                    </button>
                  </div>

                  {/* VISTA PREVIA EN VIVO DE LA DIAPOSITIVA (LIVE PREVIEW) */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={16} /> Vista Previa en Vivo de la Diapositiva
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        Actualización en tiempo real
                      </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      {/* Sub-tarjeta simulada de la slide */}
                      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl space-y-4">
                        <div className="border-b border-slate-700/50 pb-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block mb-1">
                            Diseño: {editingSlide.layout}
                          </span>
                          <h2 className="text-2xl font-extrabold text-white">
                            {editingSlide.title || 'Sin Título'}
                          </h2>
                          {editingSlide.subtitle && (
                            <p className="text-sm font-semibold text-cyan-300 mt-1">
                              {editingSlide.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Content render */}
                        <div className="text-slate-200 text-base">
                          <MathText content={editingSlide.content || 'Sin contenido'} />
                        </div>

                        {/* Question preview indicator */}
                        {editingSlide.questionId && (
                          <div className="mt-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-xs flex items-center justify-between">
                            <span className="flex items-center gap-2 font-semibold">
                              <FileQuestion size={16} className="text-cyan-400" />
                              Pregunta Vinculada: [{courseQuestions.find(q => q.id === editingSlide.questionId)?.type}] {courseQuestions.find(q => q.id === editingSlide.questionId)?.title}
                            </span>
                            <span className="text-emerald-400 font-bold">Activa en Slide</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-12 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
                  <Layers size={40} className="mb-3 text-slate-600" />
                  <p className="font-semibold text-slate-400">
                    Selecciona una diapositiva de la izquierda para editar su contenido y ver su vista previa en vivo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: BANCO DE PREGUNTAS */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="text-cyan-400" /> Banco de Preguntas de "{activeCourse?.name}"
              </h2>
              <p className="text-xs text-slate-400">
                Soporta 5 tipos de preguntas interactivas con notación {"$\\text{LaTeX}$"}.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingQuestion(null);
                setIsCreatingQuestion(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg transition-all"
            >
              <Plus size={18} /> Crear Pregunta
            </button>
          </div>

          {/* Filtros de Tipo */}
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'true_false', 'multiple_choice', 'checkboxes', 'fill_blanks', 'development'].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setQuestionFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    questionFilterType === t
                      ? 'bg-cyan-950 border border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'all' ? 'Todas' : t}
                </button>
              )
            )}
          </div>

          {/* Modal / Form de Edición de Pregunta */}
          {(isCreatingQuestion || editingQuestion) && (
            <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-4">
                {editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta para el Banco'}
              </h3>
              <QuestionEditor
                courseId={activeCourse?.id || ''}
                initialQuestion={editingQuestion || undefined}
                onSave={handleSaveQuestion}
                onCancel={() => {
                  setIsCreatingQuestion(false);
                  setEditingQuestion(null);
                }}
              />
            </div>
          )}

          {/* Lista de Preguntas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseQuestions
              .filter((q) => questionFilterType === 'all' || q.type === questionFilterType)
              .map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {q.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setIsCreatingQuestion(false);
                          }}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 rounded hover:bg-slate-800 text-rose-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-100 text-base mb-1">{q.title}</h4>
                    <div className="text-xs text-slate-400 line-clamp-2">
                      <MathText content={q.prompt} />
                    </div>
                  </div>

                  {q.type === 'development' && (
                    <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                      ✓ Incluye Pauta Oficial con {q.solutionPauta.steps.length} pasos
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 3: GESTIÓN DE CURSOS */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="text-cyan-400" /> Todos los Cursos Disponibles
            </h2>
            <button
              onClick={handleAddCourse}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg transition-all"
            >
              <Plus size={18} /> Crear Nuevo Curso
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <div
                key={c.id}
                className={`p-6 rounded-3xl border transition-all space-y-4 ${
                  c.id === activeCourseId
                    ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/40 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${c.color} text-white`}>
                    {c.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCourse(c.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        c.id === activeCourseId
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c.id === activeCourseId ? 'Seleccionado' : 'Seleccionar'}
                    </button>
                    {courses.length > 1 && (
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1.5 rounded hover:bg-slate-800 text-rose-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{c.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{c.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
                  <span>{c.slides.length} Diapositivas</span>
                  <span>
                    {questions.filter((q) => q.courseId === c.id).length} Preguntas en Banco
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 4: DATOS & COPIA DE SEGURIDAD */}
      {activeTab === 'data' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl text-center">
            <Save size={40} className="mx-auto text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Respaldo y Gestión de Datos</h2>
              <p className="text-sm text-slate-400 mt-1">
                Exporta toda la información de cursos y preguntas o restaura los datos de demostración precargados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-all"
              >
                <Download size={20} /> Exportar JSON
              </button>

              <label className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 cursor-pointer transition-all">
                <Upload size={20} /> Importar JSON
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <button
                onClick={() => {
                  if (confirm('¿Restaurar datos de fábrica? Perderás cambios no guardados en JSON.')) {
                    onResetData();
                  }
                }}
                className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 font-bold border border-rose-800/60 transition-all"
              >
                <RotateCcw size={20} /> Restaurar Cursos de Demostración de Fábrica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
