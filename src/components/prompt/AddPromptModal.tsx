'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { PromptCategory } from '@/lib/types';
import { createCategoryOptions, DEFAULT_CATEGORY_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useCategories } from '@/contexts/CategoryContext';
import { usePermissions } from '@/hooks/usePermissions';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: {
    title: string;
    description: string;
    content: string;
    category: PromptCategory;
    tags: string[];
    usageHours: number;
    isFavorite: boolean;
  }) => void;
  initialData?: {
    title: string;
    description: string;
    content: string;
    category: PromptCategory;
    tags: string[];
    usageHours: number;
    isFavorite: boolean;
  } | null;
}

export default function AddPromptModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddPromptModalProps) {
  const { categories } = useCategories();
  const { hasPermission } = usePermissions();
  
  // 권한 체크
  const canUpdate = hasPermission('canUpdate');
  const isReadOnly = !canUpdate;
  
  
  // 카테고리 옵션 생성 (로딩 중이면 기본 옵션 사용)
  const categoryOptions = (categories && categories.length > 0) 
    ? createCategoryOptions(categories).filter(opt => opt.value !== 'all')
    : DEFAULT_CATEGORY_OPTIONS.filter(opt => opt.value !== 'all');


  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    category: initialData?.category || 'development' as PromptCategory,
    tags: initialData?.tags || [],
    usageHours: initialData?.usageHours || 0,
    isFavorite: initialData?.isFavorite || false,
  }));
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // initialData가 변경될 때만 formData 업데이트 (categoryOptions 의존성 제거)
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        content: initialData?.content || '',
        category: initialData?.category || 'development',
        tags: initialData?.tags || [],
        usageHours: initialData?.usageHours || 0,
        isFavorite: initialData?.isFavorite || false,
      });
      setTagInput('');
      setErrors({});
    }
  }, [isOpen, initialData]);


  // 폼 데이터 변경 여부 확인
  const hasChanges = () => {
    const originalData = {
      title: initialData?.title || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      category: initialData?.category || 'development' as PromptCategory,
      tags: initialData?.tags || [],
      usageHours: initialData?.usageHours || 0,
      isFavorite: initialData?.isFavorite || false,
    };
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요.';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '프롬프트 내용을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 AddPromptModal handleSubmit 호출됨');
    console.log('📋 현재 formData:', JSON.stringify(formData, null, 2));
    console.log('📋 initialData:', JSON.stringify(initialData, null, 2));
    
    if (validateForm()) {
      console.log('✅ 폼 검증 통과, onSave 호출 중...');
      onSave(formData);
      handleClose();
    } else {
      console.log('❌ 폼 검증 실패');
    }
  };

  const handleClose = () => {
    // 변경사항이 있을 때 확인 모달 표시
    if (hasChanges()) {
      setShowCancelConfirm(true);
    } else {
      confirmClose();
    }
  };

  const confirmClose = () => {
    // 폼 상태 초기화 (모달이 닫힐 때)
    setTagInput('');
    setErrors({});
    setShowCancelConfirm(false);
    onClose();
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? '프롬프트 수정' : '새 프롬프트 추가'}
            </h2>
            {isReadOnly && (
              <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                읽기 전용 모드 - 수정하려면 관리자로 로그인하세요
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isReadOnly}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500',
                  errors.title ? 'border-red-300' : 'border-gray-300',
                  isReadOnly && 'bg-gray-50 cursor-not-allowed'
                )}
                placeholder="프롬프트 제목을 입력하세요"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as PromptCategory })}
                disabled={isReadOnly}
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                  isReadOnly && 'bg-gray-50 cursor-not-allowed'
                )}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isReadOnly}
                rows={3}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none',
                  errors.description ? 'border-red-300' : 'border-gray-300',
                  isReadOnly && 'bg-gray-50 cursor-not-allowed'
                )}
                placeholder="프롬프트에 대한 간단한 설명을 입력하세요"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프롬프트 내용 *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                disabled={isReadOnly}
                rows={10}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm',
                  errors.content ? 'border-red-300' : 'border-gray-300',
                  isReadOnly && 'bg-gray-50 cursor-not-allowed'
                )}
                placeholder="실제 사용할 프롬프트 내용을 입력하세요"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isReadOnly}
                  className={cn(
                    "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
                    isReadOnly && 'bg-gray-50 cursor-not-allowed'
                  )}
                  placeholder="태그를 입력하고 Enter를 누르세요"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={isReadOnly}
                  className={cn(
                    "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors",
                    isReadOnly && 'bg-gray-300 cursor-not-allowed hover:bg-gray-300'
                  )}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      #{tag}
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-purple-500 hover:text-purple-700"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                  disabled={isReadOnly}
                  className={cn(
                    "rounded text-purple-600 focus:ring-purple-500",
                    isReadOnly && 'cursor-not-allowed'
                  )}
                />
                <span className={cn(
                  "text-sm text-gray-700",
                  isReadOnly && 'text-gray-400'
                )}>즐겨찾기에 추가</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isReadOnly ? '닫기' : '취소'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {initialData ? '수정하기' : '추가하기'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-10 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                변경사항이 저장되지 않습니다
              </h3>
              <p className="text-gray-600 mb-6">
                {initialData ? '수정한 내용이 저장되지 않습니다.' : '작성한 내용이 저장되지 않습니다.'} 정말로 취소하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  계속 작성
                </button>
                <button
                  onClick={confirmClose}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  취소하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}