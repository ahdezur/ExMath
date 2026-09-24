import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
  lightTheme?: boolean;
}

/**
 * Helper to safely render KaTeX HTML string
 */
export const renderKatexString = (tex: string, displayMode: boolean = false): string => {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      output: 'html',
    });
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    return `<span class="text-red-500 font-mono text-sm">[LaTeX Error: ${tex}]</span>`;
  }
};

/**
 * Procesador Híbrido: Permite mezclar Código HTML, Animaciones CSS, Clases Tailwind,
 * formato Markdown y Ecuaciones LaTeX ($ ... $ y $$ ... $$).
 */
export const processHybridMathHTML = (rawContent: string, lightTheme: boolean = true): string => {
  if (!rawContent) return '';

  let processed = rawContent;

  // 1. Reemplazar Ecuaciones de Bloque $$ ... $$ por KaTeX HTML
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    const katexHtml = renderKatexString(tex.trim(), true);
    const themeClass = lightTheme
      ? 'bg-cyan-50/90 border-cyan-300 text-cyan-950 font-medium'
      : 'bg-slate-800/60 border-slate-700/60 text-cyan-200 shadow-inner';
    return `<div class="my-4 overflow-x-auto py-3 px-4 rounded-xl border text-center font-serif text-lg shadow-sm ${themeClass}">${katexHtml}</div>`;
  });

  // 2. Reemplazar Ecuaciones en Línea $ ... $ por KaTeX HTML
  processed = processed.replace(/\$([^\$]+?)\$/g, (_, tex) => {
    const katexHtml = renderKatexString(tex.trim(), false);
    const themeClass = lightTheme ? 'text-cyan-800 font-bold' : 'text-cyan-300 font-semibold';
    return `<span class="inline-block px-1 font-serif ${themeClass}">${katexHtml}</span>`;
  });

  // 3. Procesar sintaxis de Markdown común si existe
  // Citas / Blockquotes
  processed = processed.replace(/^>\s*(.+)$/gm, (_, body) => {
    return `<blockquote class="p-3 my-2 border-l-4 border-cyan-500 bg-cyan-50/70 text-slate-800 rounded-r-lg font-medium">${body}</blockquote>`;
  });

  // Encabezados Markdown ###, ##
  processed = processed.replace(/^###\s*(.+)$/gm, '<h3 class="text-xl font-bold text-cyan-900 my-2">$1</h3>');
  processed = processed.replace(/^##\s*(.+)$/gm, '<h2 class="text-2xl font-extrabold text-slate-900 my-3">$1</h2>');

  // Negritas **texto**
  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Cursiva *texto*
  processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');

  return processed;
};

/**
 * Componente principal que renderiza el contenido Híbrido en las diapositivas
 */
export const MathText: React.FC<MathRendererProps> = ({ content, className = '', lightTheme = true }) => {
  if (!content) return null;

  const html = processHybridMathHTML(content, lightTheme);

  return (
    <div
      className={`prose-math leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
