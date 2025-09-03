'use client';

import { Prompt } from '@/lib/types';
import PromptCard from './PromptCard';

interface PromptGridProps {
  prompts: Prompt[];
  viewMode: 'grid' | 'list';
  onPromptClick: (prompt: Prompt) => void;
  onFavoriteToggle: (id: string) => void;
}

export default function PromptGrid({
  prompts,
  viewMode,
  onPromptClick,
  onFavoriteToggle,
}: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
        <p className="text-gray-500 text-center max-w-md">
          검색어를 다시 확인하거나 다른 카테고리를 선택해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          총 <span className="font-semibold text-purple-600">{prompts.length}개</span>의 프롬프트를 찾았습니다
        </p>
      </div>

      {/* Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            viewMode={viewMode}
            onClick={() => onPromptClick(prompt)}
            // onFavoriteClick={(e) => {
            //   e.stopPropagation();
            //   onFavoriteToggle(prompt.id);
            // }}
          />
        ))}
      </div>
    </div>
  );
}