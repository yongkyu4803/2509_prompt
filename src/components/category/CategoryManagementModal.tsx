'use client';

import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Settings, Palette } from 'lucide-react';
import { useCategories } from '@/contexts/CategoryContext';
import { CategoryConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import DatabaseNotice from '@/components/ui/DatabaseNotice';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryFormData {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const COLOR_OPTIONS = [
  { name: '보라색', color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' },
  { name: '분홍색', color: 'text-pink-700', bg: 'bg-pink-100', border: 'border-pink-200' },
  { name: '주황색', color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' },
  { name: '노란색', color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  { name: '초록색', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
  { name: '파란색', color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' },
  { name: '남색', color: 'text-indigo-700', bg: 'bg-indigo-100', border: 'border-indigo-200' },
  { name: '회색', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' },
];

export default function CategoryManagementModal({ isOpen, onClose }: CategoryManagementModalProps) {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  
  console.log('CategoryManagementModal - isOpen:', isOpen);
  console.log('CategoryManagementModal - categories:', categories);
  console.log('CategoryManagementModal - loading:', loading);
  const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    label: '',
    description: '',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      description: '',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
    });
    setEditingCategory(null);
    setIsFormOpen(false);
  };

  const handleEdit = (category: CategoryConfig) => {
    setFormData({
      label: category.label,
      description: category.description || '',
      color: category.color,
      bgColor: category.bgColor,
      borderColor: category.borderColor,
    });
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleColorSelect = (colorOption: typeof COLOR_OPTIONS[0]) => {
    setFormData(prev => ({
      ...prev,
      color: colorOption.color,
      bgColor: colorOption.bg,
      borderColor: colorOption.border,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          label: formData.label,
          description: formData.description || undefined,
          color: formData.color,
          bgColor: formData.bgColor,
          borderColor: formData.borderColor,
        });
      } else {
        await addCategory({
          label: formData.label,
          description: formData.description || undefined,
          color: formData.color,
          bgColor: formData.bgColor,
          borderColor: formData.borderColor,
          isDefault: false,
        });
      }
      resetForm();
    } catch (error) {
      alert(editingCategory ? '카테고리 수정에 실패했습니다.' : '카테고리 추가에 실패했습니다.');
      console.error(error);
    }
  };

  const handleDelete = async (category: CategoryConfig) => {
    if (category.isDefault) {
      alert('기본 카테고리는 삭제할 수 없습니다.');
      return;
    }

    if (confirm(`"${category.label}" 카테고리를 삭제하시겠습니까?`)) {
      try {
        await deleteCategory(category.id);
      } catch (error: unknown) {
        alert((error instanceof Error ? error.message : '카테고리 삭제에 실패했습니다.'));
      }
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">카테고리 관리</h2>
              <p className="text-sm text-gray-500">프롬프트 카테고리를 추가, 수정, 삭제할 수 있습니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Database Notice */}
          {categories.length > 0 && categories[0]?.id.startsWith('temp-') && (
            <DatabaseNotice />
          )}
          
          {/* Add Category Button */}
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors mb-6"
            >
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Plus size={20} />
                <span className="font-medium">새 카테고리 추가</span>
              </div>
            </button>
          )}

          {/* Category Form */}
          {isFormOpen && (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="카테고리 이름을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="카테고리 설명 (선택사항)"
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette size={16} className="inline mr-1" />
                  색상 선택
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.color}
                      type="button"
                      onClick={() => handleColorSelect(option)}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-colors',
                        option.bg,
                        option.border,
                        formData.color === option.color
                          ? 'ring-2 ring-purple-500 border-purple-500'
                          : 'hover:border-gray-400'
                      )}
                      title={option.name}
                    >
                      <div className={cn('w-4 h-4 rounded-full mx-auto', option.bg.replace('bg-', 'bg-').replace('-100', '-500'))} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">미리보기</label>
                <div className={cn(
                  'inline-flex px-3 py-1 rounded-full text-sm font-medium',
                  formData.color,
                  formData.bgColor
                )}>
                  {formData.label || '카테고리 이름'}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {editingCategory ? '수정하기' : '추가하기'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          )}

          {/* Categories List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600">카테고리를 불러오는 중...</p>
              </div>
            ) : !categories || categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings size={48} className="mx-auto mb-2 opacity-50" />
                <p>등록된 카테고리가 없습니다.</p>
              </div>
            ) : (
              categories?.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      category.color,
                      category.bgColor
                    )}>
                      {category.label}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                      {category.isDefault && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 mt-1">
                          기본 카테고리
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="수정"
                    >
                      <Edit2 size={16} />
                    </button>
                    {!category.isDefault && (
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}