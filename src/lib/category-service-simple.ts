import { supabase } from './supabase';
import { CategoryConfig } from './types-simple';

export class SimpleCategoryService {
  // 📖 모든 카테고리 조회
  static async getCategories(): Promise<CategoryConfig[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // ➕ 카테고리 생성
  static async createCategory(category: Omit<CategoryConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategoryConfig> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        label: category.label,
        color: category.color,
        bg_color: category.bgColor,
        border_color: category.borderColor,
        is_default: category.isDefault || false,
        description: category.description || null,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      label: data.label,
      color: data.color,
      bgColor: data.bg_color,
      borderColor: data.border_color,
      isDefault: data.is_default,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // ✏️ 카테고리 수정
  static async updateCategory(id: string, updates: Partial<CategoryConfig>): Promise<CategoryConfig> {
    const updateData: Record<string, unknown> = {};
    
    if (updates.label !== undefined) updateData.label = updates.label;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.bgColor !== undefined) updateData.bg_color = updates.bgColor;
    if (updates.borderColor !== undefined) updateData.border_color = updates.borderColor;
    if (updates.isDefault !== undefined) updateData.is_default = updates.isDefault;
    if (updates.description !== undefined) updateData.description = updates.description;

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      label: data.label,
      color: data.color,
      bgColor: data.bg_color,
      borderColor: data.border_color,
      isDefault: data.is_default,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // 🗑️ 카테고리 삭제
  static async deleteCategory(id: string): Promise<void> {
    // 기본 카테고리 삭제 방지
    const { data: category } = await supabase
      .from('categories')
      .select('is_default')
      .eq('id', id)
      .single();

    if (category?.is_default) {
      throw new Error('기본 카테고리는 삭제할 수 없습니다.');
    }

    // 사용 중인 프롬프트 확인
    const { data: prompts } = await supabase
      .from('prompts')
      .select('id')
      .eq('category', id); // 🎯 이제 UUID로 직접 비교

    if (prompts && prompts.length > 0) {
      throw new Error('이 카테고리를 사용하는 프롬프트가 있어 삭제할 수 없습니다.');
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

// 🏗️ 기본 카테고리 (초기 설치용)
export const DEFAULT_CATEGORIES = [
  {
    label: '기본 프롬프트',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    isDefault: true,
  },
  {
    label: '보도자료',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    isDefault: true,
  },
  {
    label: '이슈분석',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    isDefault: true,
  },
  {
    label: '질의서작성',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    isDefault: true,
  },
  {
    label: '시각화',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    isDefault: true,
  },
];