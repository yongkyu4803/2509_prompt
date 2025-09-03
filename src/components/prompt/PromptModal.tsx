'use client';

import { X, Star, Clock, Edit2, Trash2 } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { findCategoryConfig, LEGACY_CATEGORY_CONFIG } from '@/lib/constants';
import { cn, formatUsageTime, formatDate } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { CopyButton } from '@/components/ui/CopyButton';
import { useCategories } from '@/contexts/CategoryContext';
import { useMemo } from 'react';

interface PromptModalProps {
  prompt: Prompt;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFavoriteToggle?: () => void; // 선택사항으로 변경
}

export default function PromptModal({
  prompt,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  // onFavoriteToggle,
}: PromptModalProps) {
  const { categories } = useCategories();
  
  // 🔧 수정: useMemo로 카테고리 변경 시 재계산 보장
  const categoryConfig = useMemo(() => {
    console.log('🎯 PromptModal 카테고리 계산:', { 
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
      
    console.log('📋 PromptModal 최종 카테고리 설정:', config);
    return config;
  }, [categories, prompt.category, prompt.id]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                categoryConfig.color,
                categoryConfig.bgColor
              )}
            >
              {categoryConfig.label}
            </div>
            {/* 사용시간 표시 - 제거됨
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>{formatUsageTime(prompt.usageHours)}</span>
            </div>
            */}
          </div>
          
          <div className="flex items-center gap-2">
            {/* 즐겨찾기 버튼 - 주석처리됨
            <PermissionGuard permission="canUpdate">
              <button
                onClick={onFavoriteToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={prompt.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              >
                <Star
                  size={20}
                  className={cn(
                    'transition-colors',
                    prompt.isFavorite 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-400 hover:text-yellow-400'
                  )}
                />
              </button>
            </PermissionGuard>
            */}
            
            <PermissionGuard permission="canUpdate">
              <button
                onClick={onEdit}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="수정"
              >
                <Edit2 size={20} className="text-gray-600" />
              </button>
            </PermissionGuard>
            
            <PermissionGuard permission="canDelete">
              <button
                onClick={onDelete}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="삭제"
              >
                <Trash2 size={20} className="text-red-500" />
              </button>
            </PermissionGuard>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-2"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Title & Description */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {prompt.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {prompt.description}
            </p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt Content */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">프롬프트 내용</h3>
              <CopyButton 
                text={prompt.content} 
                size="md" 
                variant="default" 
                showLabel={true}
                className="bg-purple-600 text-white hover:bg-purple-700"
              />
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {prompt.content}
              </pre>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">생성일:</span> {formatDate(prompt.createdAt)}
            </div>
            <div>
              <span className="font-medium">수정일:</span> {formatDate(prompt.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}