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
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  // 초기 데이터 로드 및 마이그레이션
  useEffect(() => {
    async function initializeData() {
      try {
        setLoading(true);
        setError(null);
        
        // 🔗 Supabase 연결 테스트
        console.log('🔗 Supabase 연결 상태 테스트...');
        await PromptService.testConnection();
        
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

  // 페이지 가시성 변화 시 데이터 새로고침 (새로고침 후 데이터 동기화)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && Date.now() - lastRefreshTime > 5000) { // 5초 이상 경과 시에만
        try {
          console.log('👀 페이지 포커스 복원 - 데이터 동기화 확인');
          setLoading(true);
          const refreshedPrompts = await PromptService.refreshPrompts();
          setPrompts(refreshedPrompts);
          setLastRefreshTime(Date.now());
          console.log('✅ 페이지 포커스 복원 후 데이터 동기화 완료');
        } catch (error) {
          console.warn('⚠️ 페이지 포커스 복원 후 데이터 동기화 실패:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastRefreshTime]);

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

  const addPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      console.log('🚀 PromptContext.addPrompt 시작');
      console.log('📋 추가할 프롬프트 데이터:', JSON.stringify(promptData, null, 2));
      
      // 데이터베이스에 먼저 저장
      const newPrompt = await PromptService.createPrompt(promptData);
      console.log('✅ PromptService.createPrompt 성공');
      console.log('📤 생성된 프롬프트:', JSON.stringify(newPrompt, null, 2));
      
      // 저장 성공 후 전체 데이터 새로고침으로 확정적 상태 보장
      console.log('🔄 프롬프트 추가 후 전체 데이터 새로고침');
      const refreshedPrompts = await PromptService.refreshPrompts();
      setPrompts(refreshedPrompts);
      setLastRefreshTime(Date.now());
      
      console.log('✅ addPrompt 완료 - 확정적 상태 업데이트');
      
    } catch (error) {
      console.error('❌ PromptContext.addPrompt 실패:', error);
      setError('프롬프트 추가에 실패했습니다.');
      
      // 🔧 중요: 데이터베이스 오류 시 로컬 폴백을 하지 않고 바로 에러를 던집니다
      // 사용자가 저장되었다고 착각하지 않도록 합니다
      console.log('🚨 데이터베이스 저장 실패 - 로컬 폴백 없이 에러 전파');
      
      // 에러를 다시 throw하여 호출자가 에러를 처리할 수 있게 함
      throw error;
    }
  };

  const updatePrompt = async (id: string, updates: Partial<Prompt>): Promise<void> => {
    try {
      console.log('🚀 PromptContext.updatePrompt 시작');
      console.log('📋 업데이트 ID:', id);
      console.log('📋 업데이트 데이터:', JSON.stringify(updates, null, 2));
      
      // 데이터베이스에 먼저 업데이트
      const updatedPrompt = await PromptService.updatePrompt(id, updates);
      console.log('✅ PromptService 업데이트 성공');
      console.log('📤 업데이트된 프롬프트:', JSON.stringify(updatedPrompt, null, 2));
      
      // 업데이트 성공 후 전체 데이터 새로고침으로 확정적 상태 보장
      console.log('🔄 프롬프트 업데이트 후 전체 데이터 새로고침');
      const refreshedPrompts = await PromptService.refreshPrompts();
      setPrompts(refreshedPrompts);
      setLastRefreshTime(Date.now());
      
      console.log('✅ updatePrompt 완료 - 확정적 상태 업데이트');
      
    } catch (error) {
      console.error('❌ PromptContext.updatePrompt 실패:', error);
      setError('프롬프트 수정에 실패했습니다.');
      
      // 🔧 중요: 데이터베이스 오류 시 로컬 폴백을 하지 않고 바로 에러를 던집니다
      console.log('🚨 데이터베이스 수정 실패 - 로컬 폴백 없이 에러 전파');
      
      // 에러를 다시 throw하여 호출자가 에러를 처리할 수 있게 함
      throw error;
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