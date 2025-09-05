'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import { PromptCategory, SortBy } from '@/lib/types';

interface LayoutProps {
  activeMenu: string;
  searchQuery: string;
  /* CATEGORY_DISABLED: selectedCategory: PromptCategory | 'all'; */
  viewMode: 'grid' | 'list';
  sortBy: SortBy;
  totalPrompts: number;
  onMenuChange: (menu: string) => void;
  onSearchChange: (query: string) => void;
  /* CATEGORY_DISABLED: onCategoryChange: (category: PromptCategory | 'all') => void; */
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sortBy: SortBy) => void;
  /* CATEGORY_DISABLED: onCategoryManagementOpen?: () => void; */
  children: React.ReactNode;
}

export default function Layout({
  activeMenu,
  searchQuery,
  /* CATEGORY_DISABLED: selectedCategory, */
  viewMode,
  sortBy,
  totalPrompts,
  onMenuChange,
  onSearchChange,
  /* CATEGORY_DISABLED: onCategoryChange, */
  onViewModeChange,
  onSortChange,
  /* CATEGORY_DISABLED: onCategoryManagementOpen, */
  children,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white shadow-lg min-h-screen">
        <div className="flex h-screen">
          <Sidebar 
            activeMenu={activeMenu} 
            onMenuChange={onMenuChange} 
            totalPrompts={totalPrompts}
            // CATEGORY_DISABLED: onCategoryManagementOpen={onCategoryManagementOpen}
          />
          
          <div className="flex-1 flex flex-col lg:ml-0">
            <Header
              searchQuery={searchQuery}
              // CATEGORY_DISABLED: selectedCategory={selectedCategory}
              viewMode={viewMode}
              sortBy={sortBy}
              onSearchChange={onSearchChange}
              // CATEGORY_DISABLED: onCategoryChange={onCategoryChange}
              onViewModeChange={onViewModeChange}
              onSortChange={onSortChange}
            />
            
            <main className="flex-1 overflow-auto bg-gray-50">
              <div className="px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}