export type PromptCategory = string; // UUID string

export type SortBy = 'latest' | 'oldest' | 'title' | 'usage' | 'favorite';

// 🎯 단순화된 Prompt 인터페이스
export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string; // UUID (categories.id 직접 참조)
  categoryInfo?: {   // JOIN으로 가져온 카테고리 정보 (옵션)
    id: string;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  usageHours: number;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptContextType {
  prompts: Prompt[];
  filteredPrompts: Prompt[];
  searchQuery: string;
  selectedCategory: string | 'all'; // UUID or 'all'
  viewMode: 'grid' | 'list';
  sortBy: SortBy;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | 'all') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: SortBy) => void;
  toggleFavorite: (id: string) => Promise<void>;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
}

// 🎯 CategoryConfig는 그대로 (이미 깔끔함)
export interface CategoryConfig {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryContextType {
  categories: CategoryConfig[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<CategoryConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<CategoryConfig>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}