import { PromptCategory, CategoryConfig } from './types';

// 기본 카테고리 정보 (하위 호환성을 위해 유지)
export const LEGACY_CATEGORY_CONFIG: Record<string, Omit<CategoryConfig, 'id' | 'createdAt' | 'updatedAt'>> = {
  development: {
    label: '개발',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    isDefault: true,
  },
  marketing: {
    label: '마케팅',
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200',
    isDefault: true,
  },
  analysis: {
    label: '분석',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    isDefault: true,
  },
  creative: {
    label: '창작',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    isDefault: true,
  },
  business: {
    label: '비즈니스',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    isDefault: true,
  },
};

// 카테고리 옵션을 생성하는 유틸리티 함수
export function createCategoryOptions(categories: CategoryConfig[]) {
  return [
    { value: 'all' as const, label: '전체' },
    ...categories.map(category => ({
      value: category.id as PromptCategory,
      label: category.label,
    })),
  ];
}

// 카테고리 설정을 찾는 유틸리티 함수
export function findCategoryConfig(categories: CategoryConfig[], categoryId: string): CategoryConfig | null {
  return categories.find(cat => cat.id === categoryId) || null;
}

// 기본 카테고리 옵션 (카테고리가 로드되지 않은 경우 사용)
export const DEFAULT_CATEGORY_OPTIONS = [
  { value: 'all' as const, label: '전체' },
  { value: 'development' as const, label: '개발' },
  { value: 'marketing' as const, label: '마케팅' },
  { value: 'analysis' as const, label: '분석' },
  { value: 'creative' as const, label: '창작' },
  { value: 'business' as const, label: '비즈니스' },
];