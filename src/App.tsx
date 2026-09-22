import React, { useState, useEffect } from 'react';
import { Role, Course, Question, UserResponseState } from './types';
import { INITIAL_COURSES, INITIAL_QUESTIONS } from './data/initialData';
import { Header } from './components/common/Header';
import { PresentationView } from './components/presentation/PresentationView';
import { AdminDashboard } from './components/admin/AdminDashboard';

const STORAGE_KEY_COURSES = 'exmath_courses_v2';
const STORAGE_KEY_QUESTIONS = 'exmath_questions_v2';
const STORAGE_KEY_RESPONSES = 'exmath_user_responses_v2';

export const App: React.FC = () => {
  const [role, setRole] = useState<Role>('presenter');
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Header General - Oculto en Pantalla Completa */}
      {!isFullscreen && (
        <Header
          role={role}
          onRoleChange={setRole}
          courses={courses}
          activeCourseId={activeCourseId}
          onSelectCourse={setActiveCourseId}
          onResetDemo={handleResetDemo}
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
          <div className="h-full overflow-y-auto">
            <AdminDashboard
              courses={courses}
              questions={questions}
              activeCourseId={activeCourseId}
              onSelectCourse={setActiveCourseId}
              onUpdateCourses={setCourses}
              onUpdateQuestions={setQuestions}
              onResetData={handleResetDemo}
            />
          </div>
        )}
      </main>
    </div>
  );
};
export default App;
