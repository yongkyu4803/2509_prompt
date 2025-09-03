import { supabase } from './supabase';
import { CategoryConfig } from './types';

// 데이터베이스 행을 CategoryConfig로 변환
function transformRowToCategory(row: Record<string, unknown>): CategoryConfig {
  return {
    id: row.id as string,
    label: row.label as string,
    description: row.description as string | undefined, // 컬럼이 없으면 undefined
    color: row.color as string,
    bgColor: row.bg_color as string,
    borderColor: row.border_color as string,
    isDefault: row.is_default as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// CategoryConfig를 데이터베이스 삽입용으로 변환
function transformCategoryToInsert(category: Omit<CategoryConfig, 'id' | 'createdAt' | 'updatedAt'>) {
  const insertData: Record<string, unknown> = {
    label: category.label,
    color: category.color,
    bg_color: category.bgColor,
    border_color: category.borderColor,
    is_default: category.isDefault || false,
  };
  
  // description 컬럼이 있으면 추가 (없으면 무시)
  if (category.description !== undefined) {
    insertData.description = category.description || null;
  }
  
  return insertData;
}

// CategoryConfig를 데이터베이스 업데이트용으로 변환
function transformCategoryToUpdate(category: Partial<CategoryConfig>) {
  const update: Record<string, unknown> = {};
  if (category.label !== undefined) update.label = category.label;
  if (category.color !== undefined) update.color = category.color;
  if (category.bgColor !== undefined) update.bg_color = category.bgColor;
  if (category.borderColor !== undefined) update.border_color = category.borderColor;
  if (category.isDefault !== undefined) update.is_default = category.isDefault;
  
  // description 컬럼이 있을 때만 업데이트 시도 (나중에 추가되면 활성화)
  // if (category.description !== undefined) update.description = category.description || null;
  
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
      console.log('🔄 CategoryService.updateCategory 시작:', { id, updates });
      
      const updateData = transformCategoryToUpdate(updates);
      console.log('📤 Supabase 업데이트 데이터:', updateData);
      
      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase 카테고리 업데이트 오류:', error);
        console.error('❌ 오류 상세:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          id,
          updateData
        });
        throw error;
      }

      if (!data) {
        console.error('❌ 업데이트 후 데이터가 null입니다:', { id, updateData });
        throw new Error('카테고리 업데이트 후 데이터를 가져올 수 없습니다.');
      }

      console.log('✅ Supabase 업데이트 성공:', data);
      const transformedData = transformRowToCategory(data);
      console.log('✅ 변환된 카테고리 데이터:', transformedData);
      
      return transformedData;
    } catch (error) {
      console.error('💥 CategoryService.updateCategory 오류:', error);
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