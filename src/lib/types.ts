export type PromptCategory = string;

export type SortBy = 'latest' | 'oldest' | 'title' | 'usage' | 'favorite';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
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
  /* CATEGORY_DISABLED: selectedCategory: PromptCategory | 'all'; */
  viewMode: 'grid' | 'list';
  sortBy: SortBy;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  setSearchQuery: (query: string) => void;
  /* CATEGORY_DISABLED: setSelectedCategory: (category: PromptCategory | 'all') => void; */
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: SortBy) => void;
  toggleFavorite: (id: string) => Promise<void>;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
}

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