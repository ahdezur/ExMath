import React, { useState } from 'react';
import { 
  Question, 
  QuestionType, 
  TrueFalseQuestion, 
  MultipleChoiceQuestion, 
  CheckboxesQuestion, 
  FillBlanksQuestion, 
  DevelopmentQuestion 
} from '../../types';
import { MathText } from '../../utils/katexRenderer';
import { Plus, Trash2, Check, Sparkles, AlertCircle } from 'lucide-react';

interface QuestionEditorProps {
  courseId: string;
  initialQuestion?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  courseId,
  initialQuestion,
  onSave,
  onCancel,
}) => {
  const [type, setType] = useState<QuestionType>(initialQuestion?.type || 'multiple_choice');
  const [title, setTitle] = useState(initialQuestion?.title || '');
  const [prompt, setPrompt] = useState(initialQuestion?.prompt || '');
  const [explanation, setExplanation] = useState(initialQuestion?.explanation || '');

  // Type specific states
  // 1. True/False
  const [tfAnswer, setTfAnswer] = useState<boolean>(
    initialQuestion?.type === 'true_false' ? initialQuestion.correctAnswer : true
  );

  // 2. Multiple choice
  const [mcOptions, setMcOptions] = useState<{ id: string; text: string }[]>(
    initialQuestion?.type === 'multiple_choice'
      ? initialQuestion.options
      : [
          { id: 'opt-1', text: 'Opción 1 con $\\text{LaTeX}$' },
          { id: 'opt-2', text: 'Opción 2' },
        ]
  );
  const [mcCorrectId, setMcCorrectId] = useState<string>(
    initialQuestion?.type === 'multiple_choice' ? initialQuestion.correctOptionId : 'opt-1'
  );

  // 3. Checkboxes
  const [cbOptions, setCbOptions] = useState<{ id: string; text: string }[]>(
    initialQuestion?.type === 'checkboxes'
      ? initialQuestion.options
      : [
          { id: 'cb-1', text: 'Propiedad A' },
          { id: 'cb-2', text: 'Propiedad B' },
        ]
  );
  const [cbCorrectIds, setCbCorrectIds] = useState<string[]>(
    initialQuestion?.type === 'checkboxes' ? initialQuestion.correctOptionIds : ['cb-1']
  );

  // 4. Fill Blanks
  const [fbTemplateText, setFbTemplateText] = useState(
    initialQuestion?.type === 'fill_blanks'
      ? initialQuestion.templateText
      : 'Un espacio vectorial es {0} bajo la suma y {1} bajo la multiplicación escalar.'
  );
  const [fbBlanks, setFbBlanks] = useState<
    { index: number; optionsString: string; correctValue: string }[]
  >(
    initialQuestion?.type === 'fill_blanks'
      ? initialQuestion.blanks.map((b) => ({
          index: b.index,
          optionsString: b.options.join(', '),
          correctValue: b.correctValue,
        }))
      : [
          { index: 0, optionsString: 'cerrado, abierto, infinito', correctValue: 'cerrado' },
          { index: 1, optionsString: 'cerrado, escalar, lineal', correctValue: 'cerrado' },
        ]
  );

  // 5. Development
  const [devSteps, setDevSteps] = useState<{ title: string; content: string }[]>(
    initialQuestion?.type === 'development'
      ? initialQuestion.solutionPauta.steps
      : [
          { title: 'Paso 1: Planteamiento', content: 'Escriba la ecuación diferencial $$y\'\' + y = 0$$' },
          { title: 'Paso 2: Solución General', content: '$$y(x) = C_1 \\cos(x) + C_2 \\sin(x)$$' },
        ]
  );
  const [devFinalAnswer, setDevFinalAnswer] = useState(
    initialQuestion?.type === 'development'
      ? initialQuestion.solutionPauta.finalAnswer
      : 'La solución general es $y(x) = C_1 \\cos(x) + C_2 \\sin(x)$.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    const base = {
      id: initialQuestion?.id || `q-${Date.now()}`,
      courseId,
      title,
      prompt,
      explanation,
    };

    let result: Question;

    if (type === 'true_false') {
      result = {
        ...base,
        type: 'true_false',
        correctAnswer: tfAnswer,
      };
    } else if (type === 'multiple_choice') {
      result = {
        ...base,
        type: 'multiple_choice',
        options: mcOptions,
        correctOptionId: mcCorrectId,
      };
    } else if (type === 'checkboxes') {
      result = {
        ...base,
        type: 'checkboxes',
        options: cbOptions,
        correctOptionIds: cbCorrectIds,
      };
    } else if (type === 'fill_blanks') {
      result = {
        ...base,
        type: 'fill_blanks',
        templateText: fbTemplateText,
        blanks: fbBlanks.map((b) => ({
          index: b.index,
          options: b.optionsString.split(',').map((s) => s.trim()).filter(Boolean),
          correctValue: b.correctValue.trim(),
        })),
      };
    } else {
      result = {
        ...base,
        type: 'development',
        solutionPauta: {
          steps: devSteps,
          finalAnswer: devFinalAnswer,
        },
      };
    }

    onSave(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-100">
      {/* Título y Selección de Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
            Título de la Pregunta
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Ejercicio 1: Integral por Partes"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-medium focus:border-cyan-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
            Tipo de Pregunta
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            disabled={!!initialQuestion}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-cyan-300 font-medium focus:border-cyan-500 outline-none cursor-pointer"
          >
            <option value="true_false">Verdadero / Falso</option>
            <option value="multiple_choice">Alternativas</option>
            <option value="checkboxes">Marcar Casillas Correctas</option>
            <option value="fill_blanks">Completar Oraciones (Desplegables)</option>
            <option value="development">Ejercicio de Desarrollo (Pauta)</option>
          </select>
        </div>
      </div>

      {/* Enunciado Prompt con vista previa KaTeX */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
          Enunciado (Markdown + LaTeX)
        </label>
        <textarea
          required
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escriba el enunciado. Use $...$ para LaTeX inline o $$...$$ para bloques de ecuaciones."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono text-sm focus:border-cyan-500 outline-none"
        />
        {prompt && (
          <div className="mt-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Vista previa LaTeX del Enunciado:
            </span>
            <MathText content={prompt} />
          </div>
        )}
      </div>

      {/* CAMPOS ESPECÍFICOS SEGÚN EL TIPO SELECCIONADO */}
      {/* 1. Verdadero / Falso */}
      {type === 'true_false' && (
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
          <label className="block text-xs font-bold uppercase text-slate-400">
            Respuesta Correcta
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="radio"
                name="tf"
                checked={tfAnswer === true}
                onChange={() => setTfAnswer(true)}
                className="w-4 h-4 text-cyan-500"
              />
              Verdadero
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="radio"
                name="tf"
                checked={tfAnswer === false}
                onChange={() => setTfAnswer(false)}
                className="w-4 h-4 text-cyan-500"
              />
              Falso
            </label>
          </div>
        </div>
      )}

      {/* 2. Alternativas */}
      {type === 'multiple_choice' && (
        <div className="space-y-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-400">
              Opciones de Respuesta (Marque la opción correcta)
            </label>
            <button
              type="button"
              onClick={() =>
                setMcOptions([...mcOptions, { id: `opt-${Date.now()}`, text: 'Nueva opción' }])
              }
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Plus size={14} /> Agregar Opción
            </button>
          </div>

          {mcOptions.map((opt, idx) => (
            <div key={opt.id} className="flex items-center gap-3">
              <input
                type="radio"
                name="mcCorrect"
                checked={mcCorrectId === opt.id}
                onChange={() => setMcCorrectId(opt.id)}
                className="w-5 h-5 text-emerald-500 shrink-0"
                title="Marcar como respuesta correcta"
              />
              <input
                type="text"
                value={opt.text}
                onChange={(e) => {
                  const updated = [...mcOptions];
                  updated[idx].text = e.target.value;
                  setMcOptions(updated);
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:border-cyan-500 outline-none"
              />
              {mcOptions.length > 2 && (
                <button
                  type="button"
                  onClick={() => setMcOptions(mcOptions.filter((o) => o.id !== opt.id))}
                  className="p-2 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. Marcar Casillas */}
      {type === 'checkboxes' && (
        <div className="space-y-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-400">
              Casillas de Selección (Marque las correctas)
            </label>
            <button
              type="button"
              onClick={() =>
                setCbOptions([...cbOptions, { id: `cb-${Date.now()}`, text: 'Nueva propiedad' }])
              }
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Plus size={14} /> Agregar Casilla
            </button>
          </div>

          {cbOptions.map((opt, idx) => {
            const isChecked = cbCorrectIds.includes(opt.id);
            return (
              <div key={opt.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCbCorrectIds([...cbCorrectIds, opt.id]);
                    } else {
                      setCbCorrectIds(cbCorrectIds.filter((id) => id !== opt.id));
                    }
                  }}
                  className="w-5 h-5 text-emerald-500 rounded border-slate-700 shrink-0"
                />
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => {
                    const updated = [...cbOptions];
                    updated[idx].text = e.target.value;
                    setCbOptions(updated);
                  }}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:border-cyan-500 outline-none"
                />
                {cbOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setCbOptions(cbOptions.filter((o) => o.id !== opt.id))}
                    className="p-2 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Completar Oraciones con Desplegables */}
      {type === 'fill_blanks' && (
        <div className="space-y-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
              Plantilla de Texto con marcadores &#123;0&#125;, &#123;1&#125;, etc.
            </label>
            <textarea
              rows={2}
              value={fbTemplateText}
              onChange={(e) => setFbTemplateText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-mono focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-400">
                Listas Desplegables por cada Marcador
              </label>
              <button
                type="button"
                onClick={() =>
                  setFbBlanks([
                    ...fbBlanks,
                    {
                      index: fbBlanks.length,
                      optionsString: 'opción 1, opción 2',
                      correctValue: 'opción 1',
                    },
                  ])
                }
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Plus size={14} /> Agregar Desplegable
              </button>
            </div>

            {fbBlanks.map((b, bIdx) => (
              <div key={bIdx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span>Desplegable &#123;{b.index}&#125;</span>
                  {fbBlanks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setFbBlanks(fbBlanks.filter((_, idx) => idx !== bIdx))}
                      className="text-rose-400"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-slate-400 mb-1">Opciones (separadas por coma)</span>
                    <input
                      type="text"
                      value={b.optionsString}
                      onChange={(e) => {
                        const updated = [...fbBlanks];
                        updated[bIdx].optionsString = e.target.value;
                        setFbBlanks(updated);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 font-mono text-white"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-400 mb-1">Valor Correcto Exacto</span>
                    <input
                      type="text"
                      value={b.correctValue}
                      onChange={(e) => {
                        const updated = [...fbBlanks];
                        updated[bIdx].correctValue = e.target.value;
                        setFbBlanks(updated);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 font-mono text-emerald-300 font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Ejercicio de Desarrollo (Pauta Paso a Paso) */}
      {type === 'development' && (
        <div className="space-y-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
              <Sparkles size={16} /> Pasos de la Pauta Oficial (LaTeX)
            </label>
            <button
              type="button"
              onClick={() =>
                setDevSteps([
                  ...devSteps,
                  { title: `Paso ${devSteps.length + 1}`, content: 'Descripción en LaTeX' },
                ])
              }
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Plus size={14} /> Agregar Paso a la Pauta
            </button>
          </div>

          {devSteps.map((step, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    const updated = [...devSteps];
                    updated[idx].title = e.target.value;
                    setDevSteps(updated);
                  }}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-bold text-cyan-300"
                />
                {devSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setDevSteps(devSteps.filter((_, sIdx) => sIdx !== idx))}
                    className="text-xs text-rose-400"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                value={step.content}
                onChange={(e) => {
                  const updated = [...devSteps];
                  updated[idx].content = e.target.value;
                  setDevSteps(updated);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs font-mono text-white"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold uppercase text-emerald-400 mb-1">
              Respuesta Final (Pauta)
            </label>
            <input
              type="text"
              value={devFinalAnswer}
              onChange={(e) => setDevFinalAnswer(e.target.value)}
              className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg p-2.5 text-sm font-mono text-emerald-200"
            />
          </div>
        </div>
      )}

      {/* Explicación General Opcional */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
          Explicación General Post-Respuesta (Opcional)
        </label>
        <input
          type="text"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Comentarios matemáticos adicionales..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200"
        />
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg transition-all"
        >
          Guardar Pregunta en Banco
        </button>
      </div>
    </form>
  );
};
