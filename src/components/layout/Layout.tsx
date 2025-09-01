'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import { PromptCategory, SortBy } from '@/lib/types';

interface LayoutProps {
  activeMenu: string;
  searchQuery: string;
  selectedCategory: PromptCategory | 'all';
  viewMode: 'grid' | 'list';
  sortBy: SortBy;
  totalPrompts: number;
  onMenuChange: (menu: string) => void;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: PromptCategory | 'all') => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sortBy: SortBy) => void;
  onCategoryManagementOpen?: () => void;
  children: React.ReactNode;
}

export default function Layout({
  activeMenu,
  searchQuery,
  selectedCategory,
  viewMode,
  sortBy,
  totalPrompts,
  onMenuChange,
  onSearchChange,
  onCategoryChange,
  onViewModeChange,
  onSortChange,
  onCategoryManagementOpen,
  children,
}: LayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar 
        activeMenu={activeMenu} 
        onMenuChange={onMenuChange} 
        totalPrompts={totalPrompts}
        onCategoryManagementOpen={onCategoryManagementOpen}
      />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          viewMode={viewMode}
          sortBy={sortBy}
          onSearchChange={onSearchChange}
          onCategoryChange={onCategoryChange}
          onViewModeChange={onViewModeChange}
          onSortChange={onSortChange}
        />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}