import React, { useState, useEffect } from 'react';
import { Role, Course, Question, UserResponseState, StudentUser } from './types';
import { INITIAL_COURSES, INITIAL_QUESTIONS } from './data/initialData';
import { Header } from './components/common/Header';
import { PresentationView } from './components/presentation/PresentationView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentAuthModal } from './components/auth/StudentAuthModal';

const STORAGE_KEY_COURSES = 'exmath_courses_v2';
const STORAGE_KEY_QUESTIONS = 'exmath_questions_v2';
const STORAGE_KEY_RESPONSES = 'exmath_user_responses_v2';
const STORAGE_KEY_STUDENTS = 'exmath_students_v2';
const STORAGE_KEY_CURRENT_STUDENT = 'exmath_current_student_v2';

export const App: React.FC = () => {
  const [role, setRole] = useState<Role>('presenter');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);
  
  // Load initial courses from localStorage or default
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  // Load initial questions from localStorage or default
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  // Load registered students list
  const [students, setStudents] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load logged in student
  const [studentUser, setStudentUser] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_STUDENT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeCourseId, setActiveCourseId] = useState<string>(
    'course-algebra-201'
  );

  const [userResponses, setUserResponses] = useState<UserResponseState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESPONSES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(userResponses));
  }, [userResponses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (studentUser) {
      localStorage.setItem(STORAGE_KEY_CURRENT_STUDENT, JSON.stringify(studentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_STUDENT);
    }
  }, [studentUser]);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  const handleResponseChange = (questionId: string, stateUpdate: any) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        ...stateUpdate,
      },
    }));
  };

  const handleResetDemo = () => {
    setCourses(INITIAL_COURSES);
    setQuestions(INITIAL_QUESTIONS);
    setUserResponses({});
    localStorage.removeItem(STORAGE_KEY_COURSES);
    localStorage.removeItem(STORAGE_KEY_QUESTIONS);
    localStorage.removeItem(STORAGE_KEY_RESPONSES);
    setActiveCourseId(INITIAL_COURSES[0].id);
  };

  const handleLoginStudentSuccess = (newStudent: StudentUser) => {
    setStudentUser(newStudent);
    // Add to students array if not already present
    setStudents((prev) => {
      const exists = prev.some((s) => s.email.toLowerCase() === newStudent.email.toLowerCase());
      if (exists) {
        return prev.map((s) => (s.email.toLowerCase() === newStudent.email.toLowerCase() ? newStudent : s));
      }
      return [...prev, newStudent];
    });
    setIsAuthModalOpen(false);
  };

  const handleLogoutStudent = () => {
    setStudentUser(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('¿Desea eliminar a este estudiante del registro?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (studentUser?.id === id) {
        setStudentUser(null);
      }
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-sans ${
      role === 'admin' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Header General - Oculto en Pantalla Completa */}
      {!isFullscreen && (
        <Header
          role={role}
          onRoleChange={setRole}
          courses={courses}
          activeCourseId={activeCourseId}
          onSelectCourse={setActiveCourseId}
          studentUser={studentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogoutStudent={handleLogoutStudent}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {role === 'presenter' ? (
          <PresentationView
            course={activeCourse}
            questions={questions}
            userResponses={userResponses}
            onResponseChange={handleResponseChange}
          />
        ) : (
          <div className="h-full overflow-y-auto bg-slate-100">
            <AdminDashboard
              courses={courses}
              questions={questions}
              activeCourseId={activeCourseId}
              onSelectCourse={setActiveCourseId}
              onUpdateCourses={setCourses}
              onUpdateQuestions={setQuestions}
              onResetData={handleResetDemo}
              students={students}
              onDeleteStudent={handleDeleteStudent}
            />
          </div>
        )}
      </main>

      {/* Modal de Autenticación de Estudiantes con OTP de 5 Minutos */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginStudentSuccess}
      />
    </div>
  );
};
export default App;

