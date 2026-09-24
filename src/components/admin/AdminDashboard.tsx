import React, { useState, useEffect } from 'react';
import { Course, Slide, Question, SlideLayout, StudentUser, University } from '../../types';
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
  ArrowLeft,
  ArrowRight,
  Save, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  FileQuestion,
  CheckCircle2,
  Eye,
  Users,
  School,
  ShieldCheck,
  Tag,
  Lock,
  KeyRound
} from 'lucide-react';

interface AdminDashboardProps {
  courses: Course[];
  questions: Question[];
  activeCourseId: string;
  onSelectCourse: (id: string) => void;
  onUpdateCourses: (courses: Course[]) => void;
  onUpdateQuestions: (questions: Question[]) => void;
  onResetData: () => void;
  students: StudentUser[];
  onDeleteStudent: (id: string) => void;
  onLockAdmin?: () => void;
  onChangeAdminPassword?: (newPass: string) => void;
  adminPassword?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  questions,
  activeCourseId,
  onSelectCourse,
  onUpdateCourses,
  onUpdateQuestions,
  onResetData,
  students,
  onDeleteStudent,
  onLockAdmin,
  onChangeAdminPassword,
  adminPassword = 'admin123',
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'slides' | 'questions' | 'students' | 'data' | 'security'>('slides');
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [questionFilterType, setQuestionFilterType] = useState<string>('all');
  const [studentUniFilter, setStudentUniFilter] = useState<string>('all');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseEditCode, setCourseEditCode] = useState('');
  const [courseEditName, setCourseEditName] = useState('');
  const [courseEditDescription, setCourseEditDescription] = useState('');

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];
  const courseQuestions = questions.filter((q) => q.courseId === activeCourse?.id);

  // Auto-seleccionar la primera diapositiva al entrar a la pestaña de slides si no hay ninguna seleccionada
  useEffect(() => {
    if (activeTab === 'slides' && (!editingSlide || !activeCourse?.slides.some((s) => s.id === editingSlide.id))) {
      if (activeCourse?.slides && activeCourse.slides.length > 0) {
        setEditingSlide(activeCourse.slides[0]);
      } else {
        setEditingSlide(null);
      }
    }
  }, [activeTab, activeCourseId, activeCourse?.slides]);

  const getUniLabel = (uni: University) => {
    switch (uni) {
      case 'uchile': return 'U. de Chile (@ug.uchile.cl)';
      case 'uandes': return 'U. de los Andes (@miuandes.cl)';
      case 'udd': return 'U. del Desarrollo (@udd.cl)';
      case 'usm': return 'UTFSM (@usm.cl)';
      case 'puc': return 'PUC (@uc.cl)';
    }
  };

  // --- GESTIÓN DE CURSOS ---
  const handleAddCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      code: 'MAT-999',
      name: 'Nuevo Curso Matemático',
      description: 'Descripción del nuevo curso...',
      color: 'from-purple-600 to-pink-500',
      targetUniversity: 'all',
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

  const handleUpdateCourseUniversity = (courseId: string, targetUniversity: University | 'all') => {
    const updated = courses.map((c) => (c.id === courseId ? { ...c, targetUniversity } : c));
    onUpdateCourses(updated);
  };

  // --- GESTIÓN DE SLIDES ---
  const handleSaveSlide = (slide: Slide) => {
    if (!activeCourse) return;
    const updatedSlides = activeCourse.slides.map((s) => (s.id === slide.id ? slide : s));
    const updatedCourse = { ...activeCourse, slides: updatedSlides };
    onUpdateCourses(courses.map((c) => (c.id === activeCourse.id ? updatedCourse : c)));
    setEditingSlide(slide);
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
    const data = { courses, questions, students };
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
    <div className="max-w-[1600px] w-full mx-auto p-4 md:p-8 space-y-8 text-slate-900">
      {/* HEADER DEL DASHBOARD DE ADMIN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
            Panel de Control del Docente
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            Administración de Cursos & Contenidos
          </h1>
        </div>

        {/* Course Selector for Active Editing & Lock Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold text-slate-600 pl-2">Curso Activo:</span>
            <select
              value={activeCourseId}
              onChange={(e) => onSelectCourse(e.target.value)}
              className="bg-slate-100 text-cyan-800 font-bold px-3 py-1.5 rounded-xl border border-slate-300 outline-none cursor-pointer text-xs"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {onLockAdmin && (
            <button
              onClick={onLockAdmin}
              className="px-3.5 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Cerrar Sesión de Administrador"
            >
              <Lock size={15} /> Bloquear Admin
            </button>
          )}
        </div>
      </div>

      {/* PESTAÑAS NAVEGACIÓN */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'slides'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Layers size={18} /> Editor de Diapositivas ({activeCourse?.slides.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'questions'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <HelpCircle size={18} /> Banco de Preguntas ({courseQuestions.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'courses'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <BookOpen size={18} /> Cursos ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'students'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Users size={18} /> Estudiantes Registrados ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'security'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck size={18} /> Seguridad & Clave Admin
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'data'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Save size={18} /> Datos & Backup
        </button>
      </div>

      {/* CONTENIDO PESTAÑA 1: DIAPOSITIVAS */}
      {activeTab === 'slides' && (
        <div className="space-y-6">
          {/* Header de Diapositivas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="text-cyan-700" /> Diapositivas de "{activeCourse?.name}"
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Total: <strong className="text-slate-800">{activeCourse?.slides.length || 0}</strong> diapositivas en este curso. Usa el selector horizontal para navegar entre ellas.
              </p>
            </div>
            <button
              onClick={handleAddSlide}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md hover:shadow-lg transition-all text-sm shrink-0 cursor-pointer"
            >
              <Plus size={18} /> Agregar Diapositiva
            </button>
          </div>

          {/* BARRA HORIZONTAL DE NAVEGACIÓN Y SELECTOR DE DIAPOSITIVAS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Navegador de Diapositivas ({activeCourse?.slides.length})
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Desplaza horizontalmente para ver todas
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {activeCourse?.slides.map((s, idx) => {
                const isSelected = editingSlide?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setEditingSlide(s)}
                    className={`shrink-0 w-64 p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/90 ring-2 ring-cyan-500/40 shadow-md scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-cyan-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Slide #{idx + 1}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[100px]">
                          {s.layout}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1 mb-1">
                        {s.title || 'Sin Título'}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-200/70 text-slate-500 text-xs">
                      <div className="flex items-center gap-1">
                        {s.questionId ? (
                          <span
                            className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                            title="Diapositiva con pregunta interactiva vinculada"
                          >
                            ✓ Pregunta
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Estándar</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(idx, 'up')}
                          disabled={idx === 0}
                          title="Mover hacia la izquierda"
                          className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-25 transition-colors cursor-pointer"
                        >
                          <ArrowLeft size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(idx, 'down')}
                          disabled={idx === ((activeCourse?.slides.length || 1) - 1)}
                          title="Mover hacia la derecha"
                          className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-25 transition-colors cursor-pointer"
                        >
                          <ArrowRight size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(s.id)}
                          title="Eliminar esta diapositiva"
                          className="p-1 rounded hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddSlide}
                className="shrink-0 w-44 h-[94px] rounded-2xl border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/50 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-cyan-700 font-bold text-xs transition-all cursor-pointer"
              >
                <Plus size={20} />
                <span>Nueva Diapositiva</span>
              </button>
            </div>
          </div>

          {/* WORKSPACE PARALELO (50% EDITOR / 50% VISTA PREVIA EN VIVO) */}
          {editingSlide ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* COLUMNA IZQUIERDA (50% ANCHO): FORMULARIO DE EDICIÓN */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xl text-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Edit size={18} className="text-cyan-700" /> Editando: {editingSlide.title || 'Diapositiva sin título'}
                  </h3>
                  <button
                    onClick={() => setEditingSlide(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    Cerrar Editor
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Título Principal
                      </label>
                      <input
                        type="text"
                        value={editingSlide.title}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, title: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm font-medium focus:border-cyan-600 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Subtítulo
                      </label>
                      <input
                        type="text"
                        value={editingSlide.subtitle || ''}
                        onChange={(e) =>
                          setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-sm font-medium focus:border-cyan-600 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
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
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-cyan-800 text-xs font-bold focus:border-cyan-600 focus:bg-white outline-none"
                      >
                        <option value="title">Portada</option>
                        <option value="content">Contenido Estándar</option>
                        <option value="theorem">Caja Teorema</option>
                        <option value="split_question">Texto + Pregunta</option>
                        <option value="full_exercise">Ejercicio Desarrollo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Pregunta Vinculada
                      </label>
                      <select
                        value={editingSlide.questionId || ''}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            questionId: e.target.value || undefined,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-emerald-800 text-xs font-bold focus:border-cyan-600 focus:bg-white outline-none"
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-slate-600">
                        Contenido (HTML + LaTeX $...$ ó $$...$$)
                      </label>
                      <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider">
                        Soporte HTML + Animaciones
                      </span>
                    </div>

                    {/* Quick Insert Snippet Toolbar */}
                    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-100 border border-slate-300 rounded-t-xl text-[11px] font-bold text-slate-700">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold flex items-center pr-1">Insertar:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n<div class="p-4 bg-cyan-50 border-l-4 border-cyan-500 rounded-r-xl my-4">\n  <strong class="text-cyan-900 block mb-1">📌 Teorema / Definición:</strong>\n  Escriba aquí el teorema con $f(x) = ...$\n</div>\n`;
                          setEditingSlide({ ...editingSlide, content: editingSlide.content + snippet });
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-cyan-50 text-cyan-800 border border-slate-300 transition-colors cursor-pointer"
                        title="Insertar Caja de Teorema"
                      >
                        🎨 Caja Teorema
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n<div class="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl my-4">\n  <strong class="text-emerald-900 block mb-1">💡 Ejemplo Práctico:</strong>\n  Desarrollo del ejercicio con $x = ...$\n</div>\n`;
                          setEditingSlide({ ...editingSlide, content: editingSlide.content + snippet });
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-300 transition-colors cursor-pointer"
                        title="Insertar Caja de Ejemplo"
                      >
                        🟢 Ejemplo
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n<div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl my-4 text-amber-950">\n  <strong>⚠️ Nota / Advertencia:</strong> ¡Atención a las condiciones del problema!\n</div>\n`;
                          setEditingSlide({ ...editingSlide, content: editingSlide.content + snippet });
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-amber-50 text-amber-900 border border-slate-300 transition-colors cursor-pointer"
                        title="Insertar Caja de Alerta"
                      >
                        ⚠️ Alerta
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n<div class="p-4 bg-slate-900 text-cyan-200 rounded-2xl border-2 border-cyan-400 animate-neon my-4 font-bold text-center shadow-lg">\n  ⚡ FÓRMULA DESTACADA: $$\\Delta = b^2 - 4ac$$\n</div>\n`;
                          setEditingSlide({ ...editingSlide, content: editingSlide.content + snippet });
                        }}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500 transition-colors cursor-pointer"
                        title="Insertar Caja Neón Animada"
                      >
                        🌟 Neón Animado
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `<span class="animate-highlight font-bold">Texto Destacado</span>`;
                          setEditingSlide({ ...editingSlide, content: editingSlide.content + snippet });
                        }}
                        className="px-2 py-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-400 transition-colors cursor-pointer"
                        title="Insertar Marcador Subrayado"
                      >
                        🖊️ Marcador
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n<div class="p-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 animate-rainbow my-4">\n  <div class="bg-white p-4 rounded-xl text-slate-900">\n    <h4 class="font-bold">Efecto Arcoíris Rotatorio</h4>\n    <p>Contenido con marco animado en vivo.</p>\n  </div>\n</div>\n`;
                          setEditingSlide({ ...editingSlide, content: editingSlide.content + snippet });
                        }}
                        className="px-2 py-1 rounded bg-gradient-to-r from-cyan-500 to-indigo-500 text-white transition-colors cursor-pointer"
                        title="Insertar Borde Arcoíris Animado"
                      >
                        🌈 Borde Arcoíris
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">★ Etiqueta</span>`;
                          setEditingSlide({ ...editingSlide, content: editingSlide.content + snippet });
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
                        title="Insertar Badge o Chip"
                      >
                        🏷️ Badge
                      </button>
                    </div>

                    <textarea
                      rows={9}
                      value={editingSlide.content}
                      onChange={(e) =>
                        setEditingSlide({ ...editingSlide, content: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-b-xl p-3.5 font-mono text-xs text-slate-900 focus:border-cyan-600 focus:bg-white outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Notas Privadas del Orador
                    </label>
                    <input
                      type="text"
                      value={editingSlide.notes || ''}
                      onChange={(e) =>
                        setEditingSlide({ ...editingSlide, notes: e.target.value })
                      }
                      placeholder="Instrucciones para el profesor durante la presentación..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder-slate-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleSaveSlide(editingSlide)}
                      className="w-full py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <Save size={18} /> Guardar Cambios en Diapositiva
                    </button>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA (50% ANCHO): VISTA PREVIA EN VIVO (STICKY & ESPACIOSA) */}
              <div className="space-y-3 sticky top-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={16} className="text-cyan-600 animate-pulse" /> Vista Previa en Vivo (Paralela 50/50)
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-time
                  </span>
                </div>

                <div className="p-6 md:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl space-y-4 text-slate-900 min-h-[500px] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-700 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">
                          Diseño: {editingSlide.layout}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          Slide #{activeCourse?.slides.findIndex(s => s.id === editingSlide.id) !== undefined ? activeCourse.slides.findIndex(s => s.id === editingSlide.id) + 1 : 1}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                        {editingSlide.title || 'Sin Título'}
                      </h2>
                      {editingSlide.subtitle && (
                        <p className="text-sm md:text-base font-semibold text-cyan-700 mt-1">
                          {editingSlide.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="text-slate-800 text-sm md:text-base leading-relaxed overflow-x-auto py-2">
                      <MathText content={editingSlide.content || 'Sin contenido'} lightTheme={true} />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    {editingSlide.questionId && (
                      <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-300 text-cyan-950 text-xs flex items-center justify-between">
                        <span className="flex items-center gap-2 font-semibold line-clamp-1">
                          <FileQuestion size={16} className="text-cyan-700 shrink-0" />
                          Pregunta Vinculada: [{courseQuestions.find(q => q.id === editingSlide.questionId)?.type}] {courseQuestions.find(q => q.id === editingSlide.questionId)?.title}
                        </span>
                        <span className="text-emerald-800 font-bold shrink-0 bg-white px-2 py-0.5 rounded-md border border-emerald-300 text-[10px]">
                          Activa en presentación
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-300 rounded-3xl text-center text-slate-500 bg-white shadow-sm">
              <Layers size={48} className="mb-3 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">Ninguna Diapositiva Seleccionada</h3>
              <p className="font-semibold text-slate-500 text-sm max-w-md">
                Selecciona una diapositiva del navegador horizontal superior para desplegar el editor en paralelo y su vista previa en vivo.
              </p>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: BANCO DE PREGUNTAS */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="text-cyan-700" /> Banco de Preguntas de "{activeCourse?.name}"
              </h2>
              <p className="text-xs text-slate-600">
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

          <div className="flex flex-wrap items-center gap-2">
            {['all', 'true_false', 'multiple_choice', 'checkboxes', 'fill_blanks', 'development'].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setQuestionFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    questionFilterType === t
                      ? 'bg-cyan-100 border border-cyan-300 text-cyan-900 font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t === 'all' ? 'Todas' : t}
                </button>
              )
            )}
          </div>

          {(isCreatingQuestion || editingQuestion) && (
            <div className="bg-white border-2 border-cyan-400 rounded-3xl p-6 shadow-2xl animate-fadeIn">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseQuestions
              .filter((q) => questionFilterType === 'all' || q.type === questionFilterType)
              .map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200">
                        {q.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setIsCreatingQuestion(false);
                          }}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-cyan-700"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 rounded hover:bg-slate-100 text-rose-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">{q.title}</h4>
                    <div className="text-xs text-slate-700 line-clamp-2">
                      <MathText content={q.prompt} lightTheme={true} />
                    </div>
                  </div>

                  {q.type === 'development' && (
                    <div className="text-[11px] font-semibold text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      ✓ Incluye Pauta Oficial con {q.solutionPauta.steps.length} pasos
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 3: GESTIÓN DE CURSOS & ETIQUETAS DE UNIVERSIDAD */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="text-cyan-700" /> Todos los Cursos y Accesos por Universidad
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
                    ? 'bg-white border-cyan-500 ring-2 ring-cyan-500/30 shadow-xl'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${c.color} text-white`}>
                    {c.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (editingCourseId === c.id) {
                          setEditingCourseId(null);
                        } else {
                          setEditingCourseId(c.id);
                          setCourseEditCode(c.code);
                          setCourseEditName(c.name);
                          setCourseEditDescription(c.description);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Editar nombre y datos del curso"
                    >
                      <Edit size={14} /> {editingCourseId === c.id ? 'Cancel' : 'Editar Nombre'}
                    </button>

                    <button
                      onClick={() => onSelectCourse(c.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        c.id === activeCourseId
                          ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {c.id === activeCourseId ? 'Seleccionado' : 'Seleccionar'}
                    </button>
                    {courses.length > 1 && (
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1.5 rounded hover:bg-slate-100 text-rose-600 cursor-pointer"
                        title="Eliminar curso"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {editingCourseId === c.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const updated = courses.map((item) =>
                        item.id === c.id
                          ? { ...item, code: courseEditCode.trim(), name: courseEditName.trim(), description: courseEditDescription.trim() }
                          : item
                      );
                      onUpdateCourses(updated);
                      setEditingCourseId(null);
                    }}
                    className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3 animate-fadeIn"
                  >
                    <h4 className="text-xs font-extrabold uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                      <Edit size={14} className="text-purple-700" /> Editar Datos del Curso
                    </h4>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                        Código de Asignatura (Ej: MAT-301)
                      </label>
                      <input
                        type="text"
                        required
                        value={courseEditCode}
                        onChange={(e) => setCourseEditCode(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                        Nombre Completo de la Asignatura
                      </label>
                      <input
                        type="text"
                        required
                        value={courseEditName}
                        onChange={(e) => setCourseEditName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                        Descripción General del Curso
                      </label>
                      <textarea
                        rows={2}
                        value={courseEditDescription}
                        onChange={(e) => setCourseEditDescription(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-purple-600"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Save size={14} /> Guardar Cambios
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCourseId(null)}
                        className="py-2 px-3 rounded-xl font-semibold bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 text-xs cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{c.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{c.description}</p>
                  </div>
                )}

                {/* ETIQUETA DE ACCESO DE UNIVERSIDAD */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                    <Tag size={14} className="text-cyan-700" /> Restricción de Universidad para Alumnos:
                  </label>
                  <select
                    value={c.targetUniversity || 'all'}
                    onChange={(e) => handleUpdateCourseUniversity(c.id, e.target.value as University | 'all')}
                    className="w-full bg-white border border-slate-300 text-slate-900 text-xs font-bold py-2 px-3 rounded-lg outline-none cursor-pointer focus:border-cyan-600"
                  >
                    <option value="all">🌐 Todos los Estudiantes (Público General)</option>
                    <option value="uchile">🎓 Exclusivo U. de Chile (@ug.uchile.cl)</option>
                    <option value="puc">🎓 Exclusivo PUC (@uc.cl)</option>
                    <option value="usm">🎓 Exclusivo UTFSM (@usm.cl)</option>
                    <option value="uandes">🎓 Exclusivo U. de los Andes (@miuandes.cl)</option>
                    <option value="udd">🎓 Exclusivo U. del Desarrollo (@udd.cl)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
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

      {/* CONTENIDO PESTAÑA 4: ESTUDIANTES REGISTRADOS */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="text-cyan-700" /> Estudiantes Registrados ({students.length})
              </h2>
              <p className="text-xs text-slate-600">
                Alumnos autenticados mediante código OTP de 5 minutos enviado a su correo institucional.
              </p>
            </div>

            {/* Filter by university */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Filtrar Universidad:</span>
              <select
                value={studentUniFilter}
                onChange={(e) => setStudentUniFilter(e.target.value)}
                className="bg-white border border-slate-300 text-xs font-bold px-3 py-2 rounded-xl text-slate-800 outline-none"
              >
                <option value="all">Todas ({students.length})</option>
                <option value="uchile">U. de Chile ({students.filter(s => s.university === 'uchile').length})</option>
                <option value="puc">PUC ({students.filter(s => s.university === 'puc').length})</option>
                <option value="usm">UTFSM ({students.filter(s => s.university === 'usm').length})</option>
                <option value="uandes">U. de los Andes ({students.filter(s => s.university === 'uandes').length})</option>
                <option value="udd">U. del Desarrollo ({students.filter(s => s.university === 'udd').length})</option>
              </select>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 space-y-3">
              <School size={40} className="mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-800 text-lg">No hay estudiantes registrados aún</h3>
              <p className="text-xs max-w-sm mx-auto">
                Los alumnos deben ingresar desde el botón "Ingreso Estudiantes" en la barra superior con su correo @ug.uchile.cl, @uc.cl, @usm.cl, @miuandes.cl o @udd.cl.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                      <th className="p-4">Estudiante</th>
                      <th className="p-4">Correo Institucional</th>
                      <th className="p-4">Universidad</th>
                      <th className="p-4">Estado OTP</th>
                      <th className="p-4">Fecha Registro</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {students
                      .filter(s => studentUniFilter === 'all' || s.university === studentUniFilter)
                      .map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-slate-900">{s.name}</td>
                          <td className="p-4 font-mono text-xs text-slate-700">{s.email}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase bg-cyan-100 text-cyan-900 border border-cyan-200">
                              {getUniLabel(s.university)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <ShieldCheck size={14} /> Verificado (OTP 5 min)
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {new Date(s.createdAt).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar al estudiante ${s.name}?`)) {
                                  onDeleteStudent(s.id);
                                }
                              }}
                              className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                              title="Eliminar sesión"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO PESTAÑA SECURITY: SEGURIDAD & CLAVE ADMIN */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xl text-slate-900">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
                <KeyRound size={28} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Seguridad & Clave Maestra</h2>
              <p className="text-xs text-slate-600 font-medium">
                Cambia la clave necesaria para acceder a este panel de administración de cursos y diapositivas.
              </p>
            </div>

            {passSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>{passSuccessMsg}</span>
              </div>
            )}

            {passErrorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={16} className="text-rose-600" />
                <span>{passErrorMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPassSuccessMsg('');
                setPassErrorMsg('');

                if (newPassInput.length < 4) {
                  setPassErrorMsg('La clave debe tener al menos 4 caracteres.');
                  return;
                }

                if (newPassInput !== confirmPassInput) {
                  setPassErrorMsg('Las contraseñas no coinciden. Verifica los campos.');
                  return;
                }

                if (onChangeAdminPassword) {
                  onChangeAdminPassword(newPassInput);
                  setPassSuccessMsg('¡Clave Maestra actualizada exitosamente!');
                  setNewPassInput('');
                  setConfirmPassInput('');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nueva Clave Maestra
                </label>
                <input
                  type="password"
                  required
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="Escribe la nueva contraseña"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono font-bold focus:border-purple-600 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Confirmar Nueva Clave Maestra
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono font-bold focus:border-purple-600 focus:bg-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={18} /> Guardar Nueva Clave Maestra
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 5: DATOS & COPIA DE SEGURIDAD */}
      {activeTab === 'data' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xl text-center text-slate-900">
            <Save size={40} className="mx-auto text-cyan-700" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Respaldo y Gestión de Datos</h2>
              <p className="text-sm text-slate-600 mt-1">
                Exporta toda la información de cursos, preguntas y estudiantes o restaura los datos de demostración precargados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-all"
              >
                <Download size={20} /> Exportar JSON
              </button>

              <label className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 cursor-pointer transition-all">
                <Upload size={20} /> Importar JSON
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <button
                onClick={() => {
                  if (confirm('¿Restaurar datos de fábrica? Perderás cambios no guardados en JSON.')) {
                    onResetData();
                  }
                }}
                className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-300 transition-all"
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
