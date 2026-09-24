import React, { useState, useEffect } from 'react';
import { Role, Course, Question, UserResponseState, StudentUser } from './types';
import { INITIAL_COURSES, INITIAL_QUESTIONS } from './data/initialData';
import { Header } from './components/common/Header';
import { PresentationView } from './components/presentation/PresentationView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentAuthModal } from './components/auth/StudentAuthModal';
import { AdminAuthModal } from './components/auth/AdminAuthModal';
import { LandingPage } from './components/home/LandingPage';

const STORAGE_KEY_COURSES = 'exmath_courses_v6';
const STORAGE_KEY_QUESTIONS = 'exmath_questions_v6';
const STORAGE_KEY_RESPONSES = 'exmath_user_responses_v6';
const STORAGE_KEY_STUDENTS = 'exmath_students_v3';
const STORAGE_KEY_CURRENT_STUDENT = 'exmath_current_student_v3';
const STORAGE_KEY_ADMIN_PASSWORD = 'exmath_admin_password_v1';
const SESSION_KEY_ADMIN_AUTH = 'exmath_admin_session_v1';

export const App: React.FC = () => {
  const [role, setRole] = useState<Role>('presenter');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isTeacherBypassed, setIsTeacherBypassed] = useState(false);

  // Admin Master Password
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN_PASSWORD) || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  // Admin Session Authenticated Flag
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

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
      if (saved) {
        const parsed: Course[] = JSON.parse(saved);
        const algCourse = parsed.find((c) => c.code === 'MAT-301' || c.name.includes('Álgebra'));
        if (algCourse && algCourse.slides && algCourse.slides.length >= 15) {
          return parsed;
        }
      }
      return INITIAL_COURSES;
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
    localStorage.setItem(STORAGE_KEY_ADMIN_PASSWORD, adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    if (studentUser) {
      localStorage.setItem(STORAGE_KEY_CURRENT_STUDENT, JSON.stringify(studentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_STUDENT);
    }
  }, [studentUser]);

  // Compute courses visible to current user (student or admin/presenter)
  const visibleCourses = courses.filter((c) => {
    if (role === 'admin') return true;
    if (!studentUser) return true;
    if (!c.targetUniversity || c.targetUniversity === 'all') return true;
    return c.targetUniversity === studentUser.university;
  });

  // Determine active course restricted strictly to visible courses
  const activeCourse =
    visibleCourses.find((c) => c.id === activeCourseId) ||
    (studentUser ? visibleCourses.find((c) => c.targetUniversity === studentUser.university) : undefined) ||
    visibleCourses[0] ||
    courses[0];

  // Auto-sync activeCourseId with activeCourse.id
  useEffect(() => {
    if (activeCourse && activeCourse.id !== activeCourseId) {
      setActiveCourseId(activeCourse.id);
    }
  }, [activeCourse, activeCourseId]);

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

    // Auto-switch active course to student's university course if found
    const targetCourse = courses.find((c) => c.targetUniversity === newStudent.university) ||
                         courses.find((c) => !c.targetUniversity || c.targetUniversity === 'all');
    if (targetCourse) {
      setActiveCourseId(targetCourse.id);
    }

    setIsAuthModalOpen(false);
  };

  const handleLogoutStudent = () => {
    setStudentUser(null);
    setIsTeacherBypassed(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('¿Desea eliminar a este estudiante del registro?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (studentUser?.id === id) {
        setStudentUser(null);
        setIsTeacherBypassed(false);
      }
    }
  };

  // ADMIN SECURITY HANDLERS
  const handleRequestAdminAccess = () => {
    if (isAdminAuthenticated) {
      setRole('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem(SESSION_KEY_ADMIN_AUTH, 'true');
    setRole('admin');
    setIsAdminAuthModalOpen(false);
  };

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY_ADMIN_AUTH);
    setRole('presenter');
  };

  const handleChangeAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    localStorage.setItem(STORAGE_KEY_ADMIN_PASSWORD, newPassword);
  };

  const handleRoleChange = (newRole: Role) => {
    if (newRole === 'admin') {
      handleRequestAdminAccess();
    } else {
      setRole(newRole);
    }
  };

  const isAccessAllowed = (role === 'admin' && isAdminAuthenticated) || !!studentUser || isTeacherBypassed;

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-sans ${
      role === 'admin' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Header General - Solo se muestra si el usuario ya ingresó y no está en Pantalla Completa */}
      {!isFullscreen && isAccessAllowed && (
        <Header
          role={role}
          onRoleChange={handleRoleChange}
          courses={courses}
          activeCourseId={activeCourseId}
          onSelectCourse={setActiveCourseId}
          studentUser={studentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogoutStudent={handleLogoutStudent}
          onRequestAdminAccess={handleRequestAdminAccess}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {!isAccessAllowed ? (
          <LandingPage
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onAdminAccess={handleRequestAdminAccess}
          />
        ) : role === 'presenter' ? (
          <PresentationView
            course={activeCourse}
            questions={questions}
            userResponses={userResponses}
            onResponseChange={handleResponseChange}
            role={role}
            isStudent={!!studentUser && !isAdminAuthenticated}
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
              onLockAdmin={handleLockAdmin}
              onChangeAdminPassword={handleChangeAdminPassword}
              adminPassword={adminPassword}
            />
          </div>
        )}
      </main>

      {/* Modal de Autenticación de Estudiantes (Login con Clave + Registro OTP) */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginStudentSuccess}
        students={students}
      />

      {/* Modal de Autenticación de Administrador / Docente con Clave Maestra */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        adminPasswordHash={adminPassword}
      />
    </div>
  );
};
export default App;
