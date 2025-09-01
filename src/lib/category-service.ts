import { supabase } from './supabase';
import { CategoryConfig } from './types';

// 데이터베이스 행을 CategoryConfig로 변환
function transformRowToCategory(row: any): CategoryConfig {
  return {
    id: row.id,
    label: row.label,
    color: row.color,
    bgColor: row.bg_color,
    borderColor: row.border_color,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// CategoryConfig를 데이터베이스 삽입용으로 변환
function transformCategoryToInsert(category: Omit<CategoryConfig, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    label: category.label,
    color: category.color,
    bg_color: category.bgColor,
    border_color: category.borderColor,
    is_default: category.isDefault || false,
  };
}

// CategoryConfig를 데이터베이스 업데이트용으로 변환
function transformCategoryToUpdate(category: Partial<CategoryConfig>) {
  const update: any = {};
  if (category.label !== undefined) update.label = category.label;
  if (category.color !== undefined) update.color = category.color;
  if (category.bgColor !== undefined) update.bg_color = category.bgColor;
  if (category.borderColor !== undefined) update.border_color = category.borderColor;
  if (category.isDefault !== undefined) update.is_default = category.isDefault;
  return update;
}

export class CategoryService {
  static async getCategories(): Promise<CategoryConfig[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('카테고리 조회 중 오류:', error);
        throw error;
      }

      return data?.map(transformRowToCategory) || [];
    } catch (error) {
      console.error('카테고리 서비스 오류:', error);
      throw error;
    }
  }

  static async createCategory(category: Omit<CategoryConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategoryConfig> {
    try {
      const insertData = transformCategoryToInsert(category);
      
      const { data, error } = await supabase
        .from('categories')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('카테고리 생성 중 오류:', error);
        throw error;
      }

      return transformRowToCategory(data);
    } catch (error) {
      console.error('카테고리 생성 서비스 오류:', error);
      throw error;
    }
  }

  static async updateCategory(id: string, updates: Partial<CategoryConfig>): Promise<CategoryConfig> {
    try {
      const updateData = transformCategoryToUpdate(updates);
      
      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('카테고리 업데이트 중 오류:', error);
        throw error;
      }

      return transformRowToCategory(data);
    } catch (error) {
      console.error('카테고리 업데이트 서비스 오류:', error);
      throw error;
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    try {
      // 기본 카테고리인지 확인
      const { data: category, error: fetchError } = await supabase
        .from('categories')
        .select('is_default')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      
      if (category?.is_default) {
        throw new Error('기본 카테고리는 삭제할 수 없습니다.');
      }

      // 해당 카테고리를 사용하는 프롬프트가 있는지 확인
      const { data: prompts, error: promptError } = await supabase
        .from('prompts')
        .select('id')
        .eq('category', id);

      if (promptError) throw promptError;

      if (prompts && prompts.length > 0) {
        throw new Error('이 카테고리를 사용하는 프롬프트가 있어 삭제할 수 없습니다.');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('카테고리 삭제 중 오류:', error);
        throw error;
      }
    } catch (error) {
      console.error('카테고리 삭제 서비스 오류:', error);
      throw error;
    }
  }
}

export const DEFAULT_CATEGORIES: Omit<CategoryConfig, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    label: '개발',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    isDefault: true,
  },
  {
    label: '마케팅',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    isDefault: true,
  },
  {
    label: '분석',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    isDefault: true,
  },
  {
    label: '창작',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    isDefault: true,
  },
  {
    label: '비즈니스',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    isDefault: true,
  },
];