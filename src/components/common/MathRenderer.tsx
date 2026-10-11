import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', block = false }) => {
  if (!content) return null;

  // If content is purely a block formula (starts with $$ or has block = true without $$)
  if (block && !content.includes('$')) {
    try {
      const html = katex.renderToString(content, { displayMode: true, throwOnError: false });
      return <div className={`my-2 overflow-x-auto ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <div className={`my-2 font-mono text-sm ${className}`}>{content}</div>;
    }
  }

  // Parse inline and display math tokens: $$...$$ and $...$
  const parts: React.ReactNode[] = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const token = match[0];
    const isDisplay = token.startsWith('$$') && token.endsWith('$$');
    const math = isDisplay ? token.slice(2, -2).trim() : token.slice(1, -1).trim();

    try {
      const html = katex.renderToString(math, {
        displayMode: isDisplay,
        throwOnError: false,
      });
      parts.push(
        <span
          key={match.index}
          className={isDisplay ? 'block my-2 overflow-x-auto text-center' : 'inline-block mx-0.5'}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      parts.push(<span key={match.index} className="font-mono text-sm">{token}</span>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
};
