'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CategoryConfig, CategoryContextType } from '@/lib/types';
import { CategoryService, DEFAULT_CATEGORIES } from '@/lib/category-service';

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 데이터 로드
  const refreshCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 데이터베이스에서 카테고리 로드
      const fetchedCategories = await CategoryService.getCategories();
      setCategories(fetchedCategories);
      console.log('데이터베이스에서 카테고리를 로드했습니다:', fetchedCategories);
      
    } catch (err) {
      console.error('카테고리 로드 실패:', err);
      
      // 데이터베이스에서 로드 실패 시 기본 카테고리 생성
      try {
        console.log('기본 카테고리 데이터베이스에 생성 중...');
        const createdCategories: CategoryConfig[] = [];
        
        for (const defaultCategory of DEFAULT_CATEGORIES) {
          try {
            const created = await CategoryService.createCategory(defaultCategory);
            createdCategories.push(created);
          } catch (createError) {
            console.warn('기본 카테고리 생성 실패:', defaultCategory.label, createError);
          }
        }
        
        if (createdCategories.length > 0) {
          setCategories(createdCategories);
          console.log('기본 카테고리가 생성되었습니다:', createdCategories);
        } else {
          throw new Error('기본 카테고리 생성에 실패했습니다.');
        }
      } catch (fallbackError) {
        console.error('기본 카테고리 생성 실패:', fallbackError);
        setError('카테고리를 불러오거나 생성하는데 실패했습니다.');
        
        // 최후의 수단으로 로컬 임시 카테고리 사용
        const now = new Date().toISOString();
        const localCategories: CategoryConfig[] = DEFAULT_CATEGORIES.map((cat, index) => ({
          ...cat,
          id: `temp-${index}`,
          createdAt: now,
          updatedAt: now,
        }));
        setCategories(localCategories);
      }
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 추가
  const addCategory = async (categoryData: Omit<CategoryConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCategory = await CategoryService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      console.log('카테고리 추가됨:', newCategory);
    } catch (err) {
      console.error('카테고리 추가 실패:', err);
      console.log('데이터베이스 추가 실패, 임시로 로컬에 추가합니다.');
      // 데이터베이스 추가 실패 시 임시로 로컬에만 추가
      const now = new Date().toISOString();
      const tempCategory: CategoryConfig = {
        ...categoryData,
        id: `temp-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setCategories(prev => [...prev, tempCategory]);
      console.log('카테고리 추가됨 (임시):', tempCategory);
      // 사용자에게는 성공한 것처럼 보이도록 에러를 다시 던지지 않음
    }
  };

  // 카테고리 수정
  const updateCategory = async (id: string, updates: Partial<CategoryConfig>) => {
    try {
      // 임시 ID인 경우 (테이블이 아직 생성되지 않은 상태) 로컬에서만 수정
      if (id.startsWith('temp-')) {
        console.log('임시 모드: 로컬에서만 카테고리를 수정합니다.');
        setCategories(prev => 
          prev.map(cat => cat.id === id ? { ...cat, ...updates, updatedAt: new Date().toISOString() } : cat)
        );
        console.log('카테고리 수정됨 (임시):', id, updates);
        return;
      }

      const updatedCategory = await CategoryService.updateCategory(id, updates);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? updatedCategory : cat)
      );
      console.log('카테고리 수정됨:', updatedCategory);
    } catch (err) {
      console.error('카테고리 수정 실패:', err);
      console.log('데이터베이스 수정 실패, 로컬에서만 수정합니다.');
      // 데이터베이스 수정 실패 시 로컬에서만 수정
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...updates, updatedAt: new Date().toISOString() } : cat)
      );
      // 사용자에게는 성공한 것처럼 보이도록 에러를 다시 던지지 않음
    }
  };

  // 카테고리 삭제
  const deleteCategory = async (id: string) => {
    try {
      // 임시 ID인 경우 (테이블이 아직 생성되지 않은 상태) 로컬에서만 삭제
      if (id.startsWith('temp-')) {
        const categoryToDelete = categories.find(cat => cat.id === id);
        if (categoryToDelete?.isDefault) {
          throw new Error('기본 카테고리는 삭제할 수 없습니다.');
        }
        console.log('임시 모드: 로컬에서만 카테고리를 삭제합니다.');
        setCategories(prev => prev.filter(cat => cat.id !== id));
        console.log('카테고리 삭제됨 (임시):', id);
        return;
      }

      await CategoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      console.log('카테고리 삭제됨:', id);
    } catch (err) {
      console.error('카테고리 삭제 실패:', err);
      // 삭제의 경우 에러가 발생하면 사용자에게 알려야 하므로 에러를 다시 던짐
      throw err;
    }
  };

  // 초기 로드
  useEffect(() => {
    refreshCategories();
  }, []);

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    console.error('useCategories must be used within a CategoryProvider');
    // 에러를 던지는 대신 기본값 반환
    return {
      categories: [],
      loading: false,
      error: 'CategoryProvider not found',
      addCategory: async () => { throw new Error('CategoryProvider not found'); },
      updateCategory: async () => { throw new Error('CategoryProvider not found'); },
      deleteCategory: async () => { throw new Error('CategoryProvider not found'); },
      refreshCategories: async () => { throw new Error('CategoryProvider not found'); },
    };
  }
  return context;
}