'use client';

// import { Star, Clock } from 'lucide-react';
import { Prompt } from '@/lib/types';
/* CATEGORY_DISABLED: import { findCategoryConfig, LEGACY_CATEGORY_CONFIG } from '@/lib/constants'; */
import { cn } from '@/lib/utils';
// import { PermissionGuard } from '@/components/auth/PermissionGuard';
/* CATEGORY_DISABLED: import { useCategories } from '@/contexts/CategoryContext'; */
/* CATEGORY_DISABLED: import { useMemo } from 'react'; */

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
  /* CATEGORY_DISABLED: 
  const { categories } = useCategories();
  
  // 🔧 수정: useMemo로 카테고리 변경 시 재계산 보장
  const categoryConfig = useMemo(() => {
    console.log('🎯 PromptCard 카테고리 계산:', { 
      promptId: prompt.id,
      promptCategory: prompt.category,
      categoriesLength: categories?.length || 0
    });
    
    const config = findCategoryConfig(categories || [], prompt.category) || 
      LEGACY_CATEGORY_CONFIG[prompt.category] || {
        label: prompt.category,
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
        isDefault: false,
      };
      
    console.log('📋 PromptCard 최종 카테고리 설정:', config);
    return config;
  }, [categories, prompt.category, prompt.id]);
  */

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
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
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                {prompt.title}
              </h3>
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
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
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
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
          {prompt.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
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