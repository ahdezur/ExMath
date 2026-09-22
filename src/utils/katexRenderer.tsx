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
 * Component that parses a text block containing mixed text and LaTeX:
 * - $$ ... $$ for block/display math
 * - $ ... $ for inline math
 */
export const MathText: React.FC<MathRendererProps> = ({ content, className = '', lightTheme = false }) => {
  if (!content) return null;

  // Split by $$ first for block math, then by $ for inline math
  const parseContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    const blockRegex = /\$\$([\s\S]+?)\$\$/g;
    
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const textSegments: { text: string; isBlock: boolean }[] = [];

    while ((match = blockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        textSegments.push({ text: text.substring(lastIndex, match.index), isBlock: false });
      }
      textSegments.push({ text: match[1], isBlock: true });
      lastIndex = blockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      textSegments.push({ text: text.substring(lastIndex), isBlock: false });
    }

    textSegments.forEach((segment, segIdx) => {
      if (segment.isBlock) {
        const html = renderKatexString(segment.text.trim(), true);
        parts.push(
          <div 
            key={`block-${segIdx}`}
            className={`my-4 overflow-x-auto py-3 px-4 rounded-xl border text-center font-serif text-lg shadow-sm ${
              lightTheme 
                ? 'bg-cyan-50/90 border-cyan-300 text-cyan-950 font-medium' 
                : 'bg-slate-800/60 border-slate-700/60 text-cyan-200 shadow-inner'
            }`}
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        );
      } else {
        const inlineRegex = /\$([^\$]+?)\$/g;
        let inlineLastIndex = 0;
        let inlineMatch: RegExpExecArray | null;

        while ((inlineMatch = inlineRegex.exec(segment.text)) !== null) {
          if (inlineMatch.index > inlineLastIndex) {
            const rawText = segment.text.substring(inlineLastIndex, inlineMatch.index);
            parts.push(<span key={`text-${segIdx}-${inlineLastIndex}`}>{rawText}</span>);
          }
          const html = renderKatexString(inlineMatch[1].trim(), false);
          parts.push(
            <span 
              key={`inline-${segIdx}-${inlineMatch.index}`}
              className={`inline-block px-1 font-serif ${
                lightTheme ? 'text-cyan-800 font-bold' : 'text-cyan-300 font-semibold'
              }`}
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          );
          inlineLastIndex = inlineRegex.lastIndex;
        }

        if (inlineLastIndex < segment.text.length) {
          parts.push(
            <span key={`text-end-${segIdx}`}>
              {segment.text.substring(inlineLastIndex)}
            </span>
          );
        }
      }
    });

    return parts;
  };

  return <div className={`prose-math leading-relaxed ${className}`}>{parseContent(content)}</div>;
};
