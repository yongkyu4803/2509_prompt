// 🎯 단계별 학습 카테고리 시스템

export interface LevelCategory {
  id: string;
  level: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  order: number;
  icon: string;
}

// 고정된 4단계 카테고리
export const LEVEL_CATEGORIES: LevelCategory[] = [
  {
    id: 'beginner',
    level: '초급',
    label: '초급',
    description: '프롬프트 작성의 기본기를 익히는 단계',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    order: 1,
    icon: '🌱',
  },
  {
    id: 'intermediate', 
    level: '중급',
    label: '중급',
    description: '실무에 활용 가능한 프롬프트 작성 기법',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    order: 2,
    icon: '📈',
  },
  {
    id: 'advanced',
    level: '고급',
    label: '고급', 
    description: '복잡한 문제 해결을 위한 고급 프롬프트 기법',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50', 
    borderColor: 'border-orange-200',
    order: 3,
    icon: '🚀',
  },
  {
    id: 'expert',
    level: '심화',
    label: '심화',
    description: '전문가 수준의 고도화된 프롬프트 전략',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200', 
    order: 4,
    icon: '💎',
  },
];

// 레벨별 카테고리 조회
export function getCategoryByLevel(level: string): LevelCategory | undefined {
  return LEVEL_CATEGORIES.find(cat => cat.level === level || cat.id === level);
}

// 카테고리 ID로 조회
export function getCategoryById(id: string): LevelCategory | undefined {
  return LEVEL_CATEGORIES.find(cat => cat.id === id);
}

// 정렬된 카테고리 목록
export function getSortedCategories(): LevelCategory[] {
  return [...LEVEL_CATEGORIES].sort((a, b) => a.order - b.order);
}

// 다음 레벨 카테고리 조회
export function getNextLevel(currentLevel: string): LevelCategory | null {
  const current = getCategoryByLevel(currentLevel);
  if (!current || current.order >= 4) return null;
  
  return LEVEL_CATEGORIES.find(cat => cat.order === current.order + 1) || null;
}

// 이전 레벨 카테고리 조회  
export function getPreviousLevel(currentLevel: string): LevelCategory | null {
  const current = getCategoryByLevel(currentLevel);
  if (!current || current.order <= 1) return null;
  
  return LEVEL_CATEGORIES.find(cat => cat.order === current.order - 1) || null;
}