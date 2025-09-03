'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { LevelCategory, getSortedCategories } from '@/lib/level-categories';
import PromptCard from './PromptCard';

interface LevelPromptGridProps {
  prompts: Prompt[];
  viewMode: 'grid' | 'list';
  onPromptClick: (prompt: Prompt) => void;
  onFavoriteToggle?: (id: string) => void; // 선택사항으로 변경
}

export default function LevelPromptGrid({
  prompts,
  viewMode,
  onPromptClick,
  // onFavoriteToggle,
}: LevelPromptGridProps) {
  // 레벨별로 프롬프트 그룹핑
  const groupedPrompts = React.useMemo(() => {
    const groups: Record<string, Prompt[]> = {};
    
    // 모든 레벨 초기화
    getSortedCategories().forEach(level => {
      groups[level.id] = [];
    });
    
    // 프롬프트를 레벨별로 분류
    prompts.forEach(prompt => {
      // 제목에서 레벨 태그 추출 ([초급], [중급] 등)
      const levelMatch = prompt.title.match(/^\[([^\]]+)\]/);
      let levelId = 'beginner'; // 기본값
      
      if (levelMatch) {
        const levelText = levelMatch[1];
        const category = getSortedCategories().find(cat => 
          cat.level === levelText || cat.label === levelText
        );
        if (category) {
          levelId = category.id;
        }
      }
      
      groups[levelId].push(prompt);
    });
    
    return groups;
  }, [prompts]);

  // 레벨 섹션 헤더 컴포넌트
  const LevelSection = ({ level, prompts: levelPrompts }: { level: LevelCategory, prompts: Prompt[] }) => (
    <div className="mb-8">
      {/* 레벨 헤더 */}
      <div className={`${level.bgColor} ${level.borderColor} border rounded-lg p-4 mb-4`}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{level.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-bold ${level.color}`}>
                {level.label}
              </h2>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                {levelPrompts.length}개
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{level.description}</p>
          </div>
          <ChevronRight className={`w-5 h-5 ${level.color}`} />
        </div>
      </div>

      {/* 프롬프트 그리드 */}
      {levelPrompts.length > 0 ? (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-3'
        }`}>
          {levelPrompts.map(prompt => (
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
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>아직 {level.label} 프롬프트가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-1">
            새로운 프롬프트를 추가할 때 제목에 [{level.label}]을 포함해보세요.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">

      {/* 레벨별 프롬프트 섹션 */}
      {getSortedCategories().map(level => (
        <LevelSection 
          key={level.id}
          level={level}
          prompts={groupedPrompts[level.id] || []}
        />
      ))}
    </div>
  );
}