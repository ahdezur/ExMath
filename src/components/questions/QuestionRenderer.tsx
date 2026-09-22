import React, { useState } from 'react';
import { 
  Question, 
  TrueFalseQuestion, 
  MultipleChoiceQuestion, 
  CheckboxesQuestion, 
  FillBlanksQuestion, 
  DevelopmentQuestion 
} from '../../types';
import { MathText } from '../../utils/katexRenderer';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  Sparkles, 
  Edit3,
  RotateCcw
} from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  userState?: {
    answered?: boolean;
    isCorrect?: boolean;
    userAnswer?: any;
    showPauta?: boolean;
    notesText?: string;
  };
  onStateChange?: (stateUpdate: any) => void;
  standalone?: boolean;
  lightTheme?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  userState,
  onStateChange,
  standalone = false,
  lightTheme = false,
}) => {
  // Fallback local state if parent doesn't provide
  const [localAnswered, setLocalAnswered] = useState(userState?.answered || false);
  const [localIsCorrect, setLocalIsCorrect] = useState(userState?.isCorrect || false);
  const [localAnswer, setLocalAnswer] = useState<any>(userState?.userAnswer ?? null);
  const [showPauta, setShowPauta] = useState(userState?.showPauta || false);
  const [notes, setNotes] = useState(userState?.notesText || '');
  const [showHints, setShowHints] = useState(false);

  const answered = userState?.answered !== undefined ? userState.answered : localAnswered;
  const isCorrect = userState?.isCorrect !== undefined ? userState.isCorrect : localIsCorrect;
  const currentAnswer = userState?.userAnswer !== undefined ? userState.userAnswer : localAnswer;

  const updateState = (newFields: any) => {
    if (onStateChange) {
      onStateChange(newFields);
    } else {
      if (newFields.answered !== undefined) setLocalAnswered(newFields.answered);
      if (newFields.isCorrect !== undefined) setLocalIsCorrect(newFields.isCorrect);
      if (newFields.userAnswer !== undefined) setLocalAnswer(newFields.userAnswer);
      if (newFields.showPauta !== undefined) setShowPauta(newFields.showPauta);
      if (newFields.notesText !== undefined) setNotes(newFields.notesText);
    }
  };

  const handleReset = () => {
    updateState({
      answered: false,
      isCorrect: false,
      userAnswer: question.type === 'checkboxes' ? [] : question.type === 'fill_blanks' ? {} : null,
      showPauta: false,
      notesText: ''
    });
  };

  // 1. RENDER VERDADERO / FALSO
  const renderTrueFalse = (q: TrueFalseQuestion) => {
    const handleSelect = (val: boolean) => {
      if (answered) return;
      const correct = val === q.correctAnswer;
      updateState({
        answered: true,
        isCorrect: correct,
        userAnswer: val
      });
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[true, false].map((val) => {
            const isSelected = currentAnswer === val;
            let btnStyle = lightTheme 
              ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm' 
              : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200';
            
            if (answered) {
              if (val === q.correctAnswer) {
                btnStyle = lightTheme
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/40 font-bold'
                  : 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/50';
              } else if (isSelected && !isCorrect) {
                btnStyle = lightTheme
                  ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/40 font-bold'
                  : 'border-rose-500 bg-rose-950/40 text-rose-300 ring-2 ring-rose-500/50';
              } else {
                btnStyle = lightTheme
                  ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60'
                  : 'border-slate-800 bg-slate-900/40 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              btnStyle = lightTheme
                ? 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/40 font-bold'
                : 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-2 ring-cyan-500/50';
            }

            return (
              <button
                key={val ? 'true' : 'false'}
                onClick={() => handleSelect(val)}
                disabled={answered}
                className={`flex items-center justify-center gap-3 p-5 rounded-xl border-2 font-semibold text-lg transition-all transform active:scale-95 shadow-md ${btnStyle}`}
              >
                <span className="text-xl">{val ? '✓ Verdadero' : '✗ Falso'}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // 2. RENDER ALTERNATIVAS (Multiple Choice)
  const renderMultipleChoice = (q: MultipleChoiceQuestion) => {
    const handleSelectOption = (optId: string) => {
      if (answered) return;
      const correct = optId === q.correctOptionId;
      updateState({
        answered: true,
        isCorrect: correct,
        userAnswer: optId
      });
    };

    return (
      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          const isSelected = currentAnswer === opt.id;
          
          let cardStyle = lightTheme
            ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800 shadow-sm'
            : 'border-slate-700/80 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200';
          let badgeStyle = lightTheme ? 'bg-slate-200 text-slate-800 font-bold' : 'bg-slate-700 text-slate-300';

          if (answered) {
            if (opt.id === q.correctOptionId) {
              cardStyle = lightTheme
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/40 font-semibold'
                : 'border-emerald-500 bg-emerald-950/50 text-emerald-200 ring-2 ring-emerald-500/40';
              badgeStyle = 'bg-emerald-500 text-white font-bold';
            } else if (isSelected && !isCorrect) {
              cardStyle = lightTheme
                ? 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/40 font-semibold'
                : 'border-rose-500 bg-rose-950/50 text-rose-200 ring-2 ring-rose-500/40';
              badgeStyle = 'bg-rose-500 text-white font-bold';
            } else {
              cardStyle = lightTheme
                ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60'
                : 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-50';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              disabled={answered}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group shadow-sm ${cardStyle}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${badgeStyle}`}>
                {letter}
              </span>
              <div className="flex-1 text-base">
                <MathText content={opt.text} lightTheme={lightTheme} />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // 3. RENDER MARCAR CASILLAS (Checkboxes)
  const renderCheckboxes = (q: CheckboxesQuestion) => {
    const selectedIds: string[] = currentAnswer || [];

    const toggleOption = (optId: string) => {
      if (answered) return;
      const next = selectedIds.includes(optId)
        ? selectedIds.filter((id) => id !== optId)
        : [...selectedIds, optId];
      updateState({ userAnswer: next });
    };

    const handleVerify = () => {
      const isMatch = 
        selectedIds.length === q.correctOptionIds.length &&
        selectedIds.every((id) => q.correctOptionIds.includes(id));
      
      updateState({
        answered: true,
        isCorrect: isMatch
      });
    };

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {q.options.map((opt) => {
            const isChecked = selectedIds.includes(opt.id);
            const isCorrectOption = q.correctOptionIds.includes(opt.id);

            let cardStyle = lightTheme
              ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800 shadow-sm'
              : 'border-slate-700/80 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200';
            
            if (answered) {
              if (isCorrectOption && isChecked) {
                cardStyle = lightTheme
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                  : 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
              } else if (isCorrectOption && !isChecked) {
                cardStyle = lightTheme
                  ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500/50'
                  : 'border-amber-500/80 bg-amber-950/30 text-amber-200 ring-1 ring-amber-500/50';
              } else if (!isCorrectOption && isChecked) {
                cardStyle = lightTheme
                  ? 'border-rose-500 bg-rose-50 text-rose-950'
                  : 'border-rose-500 bg-rose-950/40 text-rose-200';
              } else {
                cardStyle = lightTheme
                  ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60'
                  : 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-50';
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${cardStyle}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  disabled={answered}
                  className="mt-1 w-5 h-5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-400 bg-white"
                />
                <div className="flex-1 text-base">
                  <MathText content={opt.text} lightTheme={lightTheme} />
                </div>
              </div>
            );
          })}
        </div>

        {!answered && (
          <button
            onClick={handleVerify}
            disabled={selectedIds.length === 0}
            className="w-full py-3 px-6 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg transition-all"
          >
            Verificar Respuestas ({selectedIds.length} seleccionadas)
          </button>
        )}
      </div>
    );
  };

  // 4. RENDER COMPLETAR ORACIONES CON DESPLEGABLES (Fill in the blanks)
  const renderFillBlanks = (q: FillBlanksQuestion) => {
    const blankAnswers: Record<number, string> = currentAnswer || {};

    const handleSelectBlank = (blankIndex: number, val: string) => {
      if (answered) return;
      updateState({
        userAnswer: {
          ...blankAnswers,
          [blankIndex]: val
        }
      });
    };

    const handleCheckAll = () => {
      const allCorrect = q.blanks.every(
        (b) => blankAnswers[b.index] === b.correctValue
      );
      updateState({
        answered: true,
        isCorrect: allCorrect
      });
    };

    const parts = q.templateText.split(/\{(\d+)\}/g);

    return (
      <div className="space-y-5">
        <div className={`p-5 rounded-2xl border leading-relaxed text-lg space-y-2 ${
          lightTheme 
            ? 'bg-white border-slate-200 text-slate-800 shadow-sm' 
            : 'bg-slate-800/80 border-slate-700/80 text-slate-100'
        }`}>
          {parts.map((part, idx) => {
            if (idx % 2 === 1) {
              const blankIdx = parseInt(part, 10);
              const blankConfig = q.blanks.find((b) => b.index === blankIdx);
              if (!blankConfig) return null;

              const val = blankAnswers[blankIdx] || '';
              const isBlankCorrect = val === blankConfig.correctValue;

              let selectStyle = lightTheme
                ? 'border-slate-300 bg-slate-50 text-cyan-900 font-bold focus:border-cyan-600'
                : 'border-slate-600 bg-slate-900 text-cyan-300 focus:border-cyan-500';
              if (answered) {
                if (isBlankCorrect) {
                  selectStyle = lightTheme
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold'
                    : 'border-emerald-500 bg-emerald-950/80 text-emerald-300 font-bold';
                } else {
                  selectStyle = lightTheme
                    ? 'border-rose-500 bg-rose-100 text-rose-950 font-bold'
                    : 'border-rose-500 bg-rose-950/80 text-rose-300 font-bold';
                }
              }

              return (
                <span key={`blank-${blankIdx}`} className="inline-block mx-1 my-1">
                  <select
                    value={val}
                    onChange={(e) => handleSelectBlank(blankIdx, e.target.value)}
                    disabled={answered}
                    className={`py-1.5 px-3 rounded-lg border font-medium text-base outline-none cursor-pointer transition-all shadow-inner ${selectStyle}`}
                  >
                    <option value="" disabled>
                      -- Seleccionar --
                    </option>
                    {blankConfig.options.map((opt, oIdx) => (
                      <option key={oIdx} value={opt} className={lightTheme ? "bg-white text-slate-900" : "bg-slate-900 text-slate-100"}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </span>
              );
            }

            return <MathText key={`text-${idx}`} content={part} lightTheme={lightTheme} />;
          })}
        </div>

        {!answered && (
          <button
            onClick={handleCheckAll}
            disabled={Object.keys(blankAnswers).length < q.blanks.length}
            className="w-full py-3 px-6 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg transition-all"
          >
            Verificar Conceptos Completados
          </button>
        )}
      </div>
    );
  };

  // 5. RENDER EJERCICIO DE DESARROLLO (CON BOTON MOSTRAR/OCULTAR PAUTA)
  const renderDevelopment = (q: DevelopmentQuestion) => {
    return (
      <div className="space-y-6">
        {/* Workspace notes area */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          lightTheme ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider">
            <span className={`flex items-center gap-1.5 font-bold ${
              lightTheme ? 'text-cyan-700' : 'text-cyan-400'
            }`}>
              <Edit3 size={14} /> Espacio de trabajo / Notas del Estudiante
            </span>
            <span className={lightTheme ? 'text-slate-500' : 'text-slate-400'}>
              (Opcional para tus apuntes)
            </span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              updateState({ notesText: e.target.value });
            }}
            placeholder="Escribe tus pasos o resolución aquí..."
            rows={3}
            className={`w-full border rounded-lg p-3 text-sm focus:outline-none font-mono transition-colors ${
              lightTheme 
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600' 
                : 'bg-slate-950/80 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-cyan-500'
            }`}
          />
        </div>

        {/* Pistas si existen */}
        {q.hints && q.hints.length > 0 && (
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                lightTheme ? 'text-amber-700 hover:text-amber-800' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <HelpCircle size={14} /> {showHints ? 'Ocultar Pistas' : 'Ver Pistas de Ayuda'}
            </button>
            {showHints && (
              <div className={`mt-2 p-3 rounded-lg border text-sm space-y-1 ${
                lightTheme ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
              }`}>
                {q.hints.map((hint, idx) => (
                  <div key={idx}>• {hint}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOTÓN PROMINENTE DE MOSTRAR / OCULTAR PAUTA */}
        <div className="pt-2">
          <button
            onClick={() => {
              const next = !showPauta;
              setShowPauta(next);
              updateState({ showPauta: next });
            }}
            className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-98 shadow-xl ${
              showPauta
                ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-amber-600/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/25'
            }`}
          >
            {showPauta ? (
              <>
                <EyeOff size={22} /> Ocultar Pauta de Resolución
              </>
            ) : (
              <>
                <Eye size={22} /> Mostrar Pauta de Resolución Paso a Paso
              </>
            )}
          </button>
        </div>

        {/* DESPLEGABLE DE PAUTA DE RESOLUCIÓN */}
        {showPauta && (
          <div className={`mt-4 p-6 rounded-2xl border-2 space-y-6 shadow-2xl animate-fadeIn ${
            lightTheme 
              ? 'bg-emerald-50/90 border-emerald-400 text-slate-900' 
              : 'bg-slate-900/90 border-emerald-500/40 text-slate-100'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-lg border-b pb-3 ${
              lightTheme ? 'text-emerald-800 border-emerald-200' : 'text-emerald-400 border-slate-800'
            }`}>
              <Sparkles size={20} /> Pauta Oficial de Solución Paso a Paso
            </div>

            <div className="space-y-4">
              {q.solutionPauta.steps.map((step, idx) => (
                <div key={idx} className={`p-4 rounded-xl border space-y-2 ${
                  lightTheme ? 'bg-white border-emerald-200 text-slate-900 shadow-sm' : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                }`}>
                  <h4 className={`font-bold text-base flex items-center gap-2 ${
                    lightTheme ? 'text-cyan-800' : 'text-cyan-300'
                  }`}>
                    <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                      lightTheme ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {idx + 1}
                    </span>
                    {step.title}
                  </h4>
                  <div className={`pl-8 ${lightTheme ? 'text-slate-800' : 'text-slate-200'}`}>
                    <MathText content={step.content} lightTheme={lightTheme} />
                  </div>
                </div>
              ))}
            </div>

            {/* Resultado Final */}
            <div className={`p-4 rounded-xl border ${
              lightTheme ? 'bg-emerald-100 border-emerald-300 text-emerald-950' : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
            }`}>
              <span className={`block text-xs uppercase tracking-wider font-bold mb-1 ${
                lightTheme ? 'text-emerald-800' : 'text-emerald-400'
              }`}>
                Respuesta Final
              </span>
              <MathText content={q.solutionPauta.finalAnswer} lightTheme={lightTheme} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 ${
      lightTheme 
        ? 'bg-slate-50/95 border-slate-200 text-slate-900 shadow-md' 
        : 'bg-slate-900/80 border-slate-800 text-slate-100 shadow-xl backdrop-blur-md'
    } ${standalone ? 'max-w-3xl mx-auto' : ''}`}>
      {/* Header de la Pregunta */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              lightTheme 
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300 font-bold' 
                : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
            }`}>
              {question.type === 'true_false' && 'Verdadero / Falso'}
              {question.type === 'multiple_choice' && 'Alternativas'}
              {question.type === 'checkboxes' && 'Marcar Casillas'}
              {question.type === 'fill_blanks' && 'Completar Oración'}
              {question.type === 'development' && 'Ejercicio de Desarrollo'}
            </span>
          </div>
          <h3 className={`text-xl font-bold ${lightTheme ? 'text-slate-900' : 'text-slate-100'}`}>{question.title}</h3>
        </div>

        {answered && question.type !== 'development' && (
          <button
            onClick={handleReset}
            title="Reiniciar ejercicio"
            className={`p-2 rounded-lg transition-colors ${
              lightTheme 
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      {/* Enunciado Prompt */}
      <div className={`text-lg mb-6 leading-relaxed ${lightTheme ? 'text-slate-800' : 'text-slate-200'}`}>
        <MathText content={question.prompt} lightTheme={lightTheme} />
      </div>

      {/* Renderizado de Tipo Específico */}
      {question.type === 'true_false' && renderTrueFalse(question)}
      {question.type === 'multiple_choice' && renderMultipleChoice(question)}
      {question.type === 'checkboxes' && renderCheckboxes(question)}
      {question.type === 'fill_blanks' && renderFillBlanks(question)}
      {question.type === 'development' && renderDevelopment(question)}

      {/* Retroalimentación Post-Respuesta */}
      {answered && question.type !== 'development' && (
        <div className={`mt-6 p-4 rounded-xl border transition-all animate-fadeIn ${
          isCorrect 
            ? lightTheme ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
            : lightTheme ? 'bg-rose-50 border-rose-400 text-rose-950' : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-bold text-lg mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 className={lightTheme ? "text-emerald-600" : "text-emerald-400"} size={22} /> ¡Respuesta Correcta!
              </>
            ) : (
              <>
                <XCircle className={lightTheme ? "text-rose-600" : "text-rose-400"} size={22} /> Respuesta Incorrecta
              </>
            )}
          </div>
          {question.explanation && (
            <div className={`mt-2 text-sm border-t pt-2 ${
              lightTheme ? 'border-emerald-200 text-slate-800' : 'border-slate-700/50 opacity-90'
            }`}>
              <span className="font-semibold block mb-1">Explicación:</span>
              <MathText content={question.explanation} lightTheme={lightTheme} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
