'use client';

// import { Star, Clock } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { findCategoryConfig, LEGACY_CATEGORY_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
// import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { useCategories } from '@/contexts/CategoryContext';
import { useMemo } from 'react';

interface PromptCardProps {
  prompt: Prompt;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  // onFavoriteClick: (e: React.MouseEvent) => void;
}

export default function PromptCard({
  prompt,
  viewMode,
  onClick,
  // onFavoriteClick,
}: PromptCardProps) {
  const { categories } = useCategories();
  
  // 카테고리 설정과 그라디에이션 매핑
  const categoryConfig = useMemo(() => {
    const config = findCategoryConfig(categories || [], prompt.category) || 
      LEGACY_CATEGORY_CONFIG[prompt.category] || {
        label: prompt.category,
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
        isDefault: false,
      };
    return config;
  }, [categories, prompt.category, prompt.id]);

  // LEVEL_TAG_DISABLED: 레벨 태그 결정 함수
  /* const getLevelTag = (prompt: Prompt) => {
    const title = prompt.title.toLowerCase();
    const category = prompt.category.toLowerCase();
    
    // 카테고리 기반 레벨 결정
    if (category.includes('기초') || category.includes('basic') || category.includes('입문')) {
      return '[초급]';
    }
    if (category.includes('중급') || category.includes('intermediate') || category.includes('응용')) {
      return '[중급]';
    }
    if (category.includes('고급') || category.includes('advanced') || category.includes('전문')) {
      return '[고급]';
    }
    
    // 제목 기반 레벨 결정
    if (title.includes('기초') || title.includes('입문') || title.includes('시작')) {
      return '[초급]';
    }
    if (title.includes('활용') || title.includes('응용') || title.includes('실무')) {
      return '[중급]';
    }
    if (title.includes('고급') || title.includes('전문') || title.includes('마스터')) {
      return '[고급]';
    }
    
    // 프롬프트 유형별 기본 태그
    if (category.includes('프롬프트')) {
      return '[초급기본 프롬프트]';
    }
    if (category.includes('문서') || category.includes('작성')) {
      return '[초급]';
    }
    
    // 기본값
    return '[초급]';
  };

  const levelTag = getLevelTag(prompt); */


  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
        style={{padding: '0.375rem'}}
      >
        {/* CATEGORY_DISABLED: Category Badge
        <div
          className={cn(
            'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium',
            categoryConfig.color,
            categoryConfig.bgColor
          )}
        >
          {categoryConfig.label}
        </div>
        */}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div 
                className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-lg mb-2 flex items-center gap-2"
                style={{paddingLeft: '0.4rem', paddingRight: '0.4rem', paddingTop: '0.3rem', paddingBottom: '0.3rem'}}
              >
                <span className="text-white opacity-80">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="3"/>
                  </svg>
                </span>
                <h3 
                  className="text-white"
                  style={{
                    fontSize: '0.92rem', // 110% of text-sm (0.875rem)
                    fontWeight: '600',    // 120% heavier than font-medium (500)
                  }}
                >
                  {prompt.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {prompt.description}
              </p>
            </div>

            {/* Actions - 주석처리됨
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>{formatUsageTime(prompt.usageHours)}</span>
              </div>
              
              <PermissionGuard permission="canUpdate">
                <button
                  onClick={onFavoriteClick}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Star
                    size={16}
                    className={cn(
                      'transition-colors',
                      prompt.isFavorite 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-400 hover:text-yellow-400'
                    )}
                  />
                </button>
              </PermissionGuard>
            </div>
            */}
          </div>

          {/* Tags - 제거됨
          <div className="flex flex-wrap gap-1 mt-2">
            {prompt.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
          */}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
      style={{padding: '0.375rem'}}
    >
      {/* CATEGORY_DISABLED: Header */}
      {/* <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            categoryConfig.color,
            categoryConfig.bgColor
          )}
        >
          {categoryConfig.label}
        </div>
        
        <PermissionGuard permission="canUpdate">
          <button
            onClick={onFavoriteClick}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Star
              size={18}
              className={cn(
                'transition-colors',
                prompt.isFavorite 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-400 hover:text-yellow-400'
              )}
            />
          </button>
        </PermissionGuard>
      </div> */}

      {/* Content */}
      <div className="mb-4">
        <div 
          className="bg-gradient-to-r from-indigo-600 to-purple-400 text-white rounded-lg mb-3 flex items-center gap-2"
          style={{paddingLeft: '0.6rem', paddingRight: '0.6rem', paddingTop: '0.4rem', paddingBottom: '0.4rem'}}
        >
          <span className="text-white opacity-90">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3"/>
            </svg>
          </span>
          <h3 
            className="text-white"
            style={{
              fontSize: '1.1rem', // 110% of text-base (1rem)
              fontWeight: '600',   // 120% heavier than font-medium (500)
            }}
          >
            {prompt.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3 px-1">
          {prompt.description}
        </p>
      </div>

      {/* Footer - 제거됨 (사용시간, 태그)
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={12} />
          <span>{formatUsageTime(prompt.usageHours)}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {prompt.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
            >
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 2 && (
            <span className="text-xs text-gray-400">+{prompt.tags.length - 2}</span>
          )}
        </div>
      </div>
      */}
    </div>
  );
}