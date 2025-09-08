'use client';

import { Search, Filter, Grid3X3, List, ArrowUpDown, Crown, Eye, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createCategoryOptions, DEFAULT_CATEGORY_OPTIONS } from '@/lib/constants';
import { PromptCategory, SortBy } from '@/lib/types';
import { RoleDisplay } from '@/components/ui/ReadOnlyBadge';
import { useCategories } from '@/contexts/CategoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import LoginModal from '@/components/auth/LoginModal';

interface HeaderProps {
  searchQuery: string;
  /* CATEGORY_DISABLED: selectedCategory: PromptCategory | 'all'; */
  viewMode: 'grid' | 'list';
  sortBy: SortBy;
  onSearchChange: (query: string) => void;
  /* CATEGORY_DISABLED: onCategoryChange: (category: PromptCategory | 'all') => void; */
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sortBy: SortBy) => void;
}

export default function Header({
  searchQuery,
  /* CATEGORY_DISABLED: selectedCategory, */
  viewMode,
  sortBy,
  onSearchChange,
  /* CATEGORY_DISABLED: onCategoryChange, */
  onViewModeChange,
  onSortChange,
}: HeaderProps) {
  /* CATEGORY_DISABLED: 
  const { categories } = useCategories();
  
  // 카테고리 옵션 생성 (로딩 중이면 기본 옵션 사용)
  const categoryOptions = (categories && categories.length > 0) 
    ? createCategoryOptions(categories) 
    : DEFAULT_CATEGORY_OPTIONS;
  */

  // 권한 관리
  const { isAdmin, isLoggedIn, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // 정렬 옵션
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'title', label: '제목순' },
    { value: 'usage', label: '사용량순' },
    { value: 'favorite', label: '즐겨찾기순' },
  ];
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 lg:p-6">
        {/* Role Display - 모바일에서만 표시 */}
        <div className="lg:hidden">
          <RoleDisplay />
        </div>
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="프롬프트 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center gap-4">
          {/* CATEGORY_DISABLED: Category Filter
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as PromptCategory | 'all')}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer min-w-[120px]"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          */}

          {/* Sort Filter */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer min-w-[120px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              title="그리드 뷰"
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              title="리스트 뷰"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* 권한 상태 표시 - 가장 오른쪽 */}
        <div className="hidden lg:flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
            isAdmin 
              ? "bg-purple-100 text-purple-700 border border-purple-200" 
              : "bg-gray-100 text-gray-600 border border-gray-200"
          )}>
            {isAdmin ? <Crown size={14} /> : <Eye size={14} />}
            <span>{isAdmin ? '관리자' : '읽기전용'}</span>
          </div>
          
          <button
            onClick={handleAuthAction}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isLoggedIn
                ? "text-red-600 hover:bg-red-50"
                : "text-purple-600 hover:bg-purple-50"
            )}
          >
            {isLoggedIn ? (
              <>
                <LogOut size={16} />
                <span className="hidden sm:inline">로그아웃</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span className="hidden sm:inline">관리자</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
}