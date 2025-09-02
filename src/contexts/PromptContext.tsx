'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Prompt, PromptCategory, PromptContextType, SortBy } from '@/lib/types';
import { mockPrompts } from '@/data/mockPrompts';
import { PromptService, migrateLocalStorageData } from '@/lib/database';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [localStoragePrompts] = useLocalStorage<Prompt[]>('prompts', mockPrompts);

  // 초기 데이터 로드 및 마이그레이션
  useEffect(() => {
    async function initializeData() {
      try {
        setLoading(true);
        setError(null);
        
        // 데이터베이스 테스트 실행 (개발 환경에서만)
        // if (process.env.NODE_ENV === 'development') {
        //   console.log('🧪 Running database tests...');
        //   await runDatabaseTests();
        // }
        
        // Supabase에서 데이터 로드 시도
        console.log('📥 Supabase에서 프롬프트 데이터 로딩 중...');
        const supabasePrompts = await PromptService.getPrompts();
        console.log(`📊 Supabase에서 ${supabasePrompts.length}개 프롬프트 로드됨`);
        
        if (supabasePrompts.length === 0) {
          // Supabase가 비어있으면 localStorage 데이터 마이그레이션
          console.log('🔄 localStorage 데이터 마이그레이션 시도...');
          await migrateLocalStorageData();
          const migratedPrompts = await PromptService.getPrompts();
          console.log(`✅ 마이그레이션 후 ${migratedPrompts.length}개 프롬프트`);
          setPrompts(migratedPrompts.length > 0 ? migratedPrompts : mockPrompts);
        } else {
          console.log('✅ Supabase 데이터를 상태에 설정');
          setPrompts(supabasePrompts);
        }
      } catch (err) {
        console.error('Failed to load prompts from Supabase, falling back to localStorage:', err);
        setError('데이터베이스 연결에 실패했습니다. 로컬 데이터를 사용합니다.');
        setPrompts(localStoragePrompts);
      } finally {
        setLoading(false);
      }
    }

    initializeData();
  }, [localStoragePrompts]);

  // Filter and sort prompts based on search query, selected category, and sort option
  useEffect(() => {
    let filtered = prompts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort prompts with favorites first
    const sortedFiltered = filtered.sort((a, b) => {
      // First priority: favorites come first
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      // Second priority: sort by selected criteria
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'usage':
          return b.usageHours - a.usageHours;
        case 'favorite':
          // For favorite sort, we already handled the primary sort above
          // Secondary sort by creation date (latest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredPrompts(sortedFiltered);
  }, [prompts, searchQuery, selectedCategory, sortBy]);

  const toggleFavorite = async (id: string) => {
    try {
      console.log('⭐ PromptContext.toggleFavorite 시작, ID:', id);
      const currentPrompt = prompts.find(p => p.id === id);
      console.log('📋 현재 즐겨찾기 상태:', currentPrompt?.isFavorite);
      
      const updatedPrompt = await PromptService.toggleFavorite(id);
      console.log('✅ PromptService 즐겨찾기 토글 성공');
      console.log('📋 업데이트된 즐겨찾기 상태:', updatedPrompt.isFavorite);
      
      setPrompts(prevPrompts =>
        prevPrompts.map(prompt =>
          prompt.id === id ? updatedPrompt : prompt
        )
      );
      console.log('✅ 로컬 상태 업데이트 완료');
    } catch (error) {
      console.error('❌ PromptContext.toggleFavorite 실패:', error);
      setError('즐겨찾기 업데이트에 실패했습니다.');
      
      // Fallback to local update
      console.log('🔄 로컬 즐겨찾기 토글 폴백 실행');
      setPrompts(prevPrompts =>
        prevPrompts.map(prompt =>
          prompt.id === id
            ? { ...prompt, isFavorite: !prompt.isFavorite }
            : prompt
        )
      );
    }
  };

  const addPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPrompt = await PromptService.createPrompt(promptData);
      setPrompts(prevPrompts => [newPrompt, ...prevPrompts]);
    } catch (error) {
      console.error('Failed to create prompt:', error);
      setError('프롬프트 추가에 실패했습니다.');
      
      // Fallback to local creation
      const fallbackPrompt: Prompt = {
        ...promptData,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPrompts(prevPrompts => [fallbackPrompt, ...prevPrompts]);
    }
  };

  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    try {
      console.log('🚀 PromptContext.updatePrompt 시작');
      console.log('📋 업데이트 ID:', id);
      console.log('📋 업데이트 데이터:', JSON.stringify(updates, null, 2));
      
      const updatedPrompt = await PromptService.updatePrompt(id, updates);
      console.log('✅ PromptService 업데이트 성공');
      console.log('📤 업데이트된 프롬프트:', JSON.stringify(updatedPrompt, null, 2));
      
      setPrompts(prevPrompts => {
        console.log('🔄 상태 업데이트 중...');
        const beforeUpdate = prevPrompts.find(p => p.id === id);
        console.log('📋 업데이트 전 데이터:', beforeUpdate ? JSON.stringify(beforeUpdate, null, 2) : 'null');
        
        const newPrompts = prevPrompts.map(prompt =>
          prompt.id === id ? updatedPrompt : prompt
        );
        
        const afterUpdate = newPrompts.find(p => p.id === id);
        console.log('📋 업데이트 후 데이터:', afterUpdate ? JSON.stringify(afterUpdate, null, 2) : 'null');
        console.log('✅ 프롬프트 상태 업데이트 완료');
        
        return newPrompts;
      });
    } catch (error) {
      console.error('❌ PromptContext.updatePrompt 실패:', error);
      setError('프롬프트 수정에 실패했습니다.');
      
      // Fallback to local update
      console.log('🔄 로컬 업데이트로 폴백...');
      setPrompts(prevPrompts =>
        prevPrompts.map(prompt =>
          prompt.id === id
            ? { ...prompt, ...updates, updatedAt: new Date().toISOString() }
            : prompt
        )
      );
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      console.log('🗑️ PromptContext.deletePrompt 시작, ID:', id);
      console.log('📊 삭제 전 프롬프트 수:', prompts.length);
      
      await PromptService.deletePrompt(id);
      console.log('✅ PromptService 삭제 성공');
      
      setPrompts(prevPrompts => {
        const newPrompts = prevPrompts.filter(prompt => prompt.id !== id);
        console.log('📊 삭제 후 프롬프트 수:', newPrompts.length);
        console.log('✅ 로컬 상태에서 프롬프트 제거 완료');
        return newPrompts;
      });
    } catch (error) {
      console.error('❌ PromptContext.deletePrompt 실패:', error);
      setError('프롬프트 삭제에 실패했습니다.');
      
      // Fallback to local deletion
      console.log('🔄 로컬 삭제 폴백 실행');
      setPrompts(prevPrompts => prevPrompts.filter(prompt => prompt.id !== id));
    }
  };

  const clearError = () => {
    console.log('🧹 에러 메시지 클리어');
    setError(null);
  };

  const contextValue: PromptContextType = {
    prompts,
    filteredPrompts,
    searchQuery,
    selectedCategory,
    viewMode,
    sortBy,
    loading,
    error,
    clearError,
    setSearchQuery,
    setSelectedCategory,
    setViewMode,
    setSortBy,
    toggleFavorite,
    addPrompt,
    updatePrompt,
    deletePrompt,
  };

  return (
    <PromptContext.Provider value={contextValue}>
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
}