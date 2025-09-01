'use client';

import { useEffect, useRef } from 'react';

interface MarkdownRendererProps {
  htmlContent: string;
  className?: string;
}

export default function MarkdownRenderer({ htmlContent, className = '' }: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // 마크다운 컨텐츠의 링크에 스타일 적용
      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.className = 'text-purple-600 hover:text-purple-800 underline';
        // 외부 링크인 경우 새 탭에서 열기
        if (link.href.startsWith('http')) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      });

      // 코드 블록 스타일링
      const codeBlocks = contentRef.current.querySelectorAll('pre');
      codeBlocks.forEach(block => {
        block.className = 'bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm';
      });

      // 인라인 코드 스타일링
      const inlineCodes = contentRef.current.querySelectorAll('code:not(pre code)');
      inlineCodes.forEach(code => {
        code.className = 'bg-gray-100 text-purple-600 px-2 py-1 rounded text-sm font-mono';
      });

      // 테이블 스타일링
      const tables = contentRef.current.querySelectorAll('table');
      tables.forEach(table => {
        table.className = 'min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden';
        
        const thead = table.querySelector('thead');
        if (thead) {
          thead.className = 'bg-gray-50';
          const ths = thead.querySelectorAll('th');
          ths.forEach(th => {
            th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
          });
        }

        const tbody = table.querySelector('tbody');
        if (tbody) {
          tbody.className = 'bg-white divide-y divide-gray-200';
          const tds = tbody.querySelectorAll('td');
          tds.forEach(td => {
            td.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
          });
        }
      });

      // 블록쿼트 스타일링
      const blockquotes = contentRef.current.querySelectorAll('blockquote');
      blockquotes.forEach(blockquote => {
        blockquote.className = 'border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 italic text-gray-700 my-4';
      });
    }
  }, [htmlContent]);

  return (
    <div 
      ref={contentRef}
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        // 커스텀 프로즈 스타일
        '--tw-prose-headings': 'rgb(17 24 39)', // gray-900
        '--tw-prose-lead': 'rgb(75 85 99)', // gray-600
        '--tw-prose-links': 'rgb(124 58 237)', // purple-600
        '--tw-prose-bold': 'rgb(17 24 39)', // gray-900
        '--tw-prose-counters': 'rgb(107 114 128)', // gray-500
        '--tw-prose-bullets': 'rgb(209 213 219)', // gray-300
        '--tw-prose-hr': 'rgb(229 231 235)', // gray-200
        '--tw-prose-quotes': 'rgb(17 24 39)', // gray-900
        '--tw-prose-quote-borders': 'rgb(124 58 237)', // purple-600
        '--tw-prose-captions': 'rgb(107 114 128)', // gray-500
        '--tw-prose-code': 'rgb(124 58 237)', // purple-600
        '--tw-prose-pre-code': 'rgb(243 244 246)', // gray-100
        '--tw-prose-pre-bg': 'rgb(17 24 39)', // gray-900
        '--tw-prose-th-borders': 'rgb(209 213 219)', // gray-300
        '--tw-prose-td-borders': 'rgb(229 231 235)', // gray-200
      } as React.CSSProperties}
    />
  );
}