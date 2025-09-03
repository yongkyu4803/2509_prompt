import { supabase } from './supabase';
import { Prompt } from './types';

// 익명 사용자 ID
function getOrCreateUserId(): string {
  return 'user-y2r2japwz';
}

export class SimplePromptService {
  // 📖 모든 프롬프트 조회 (카테고리 정보 포함)
  static async getPrompts(): Promise<Prompt[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        *,
        category_info:categories(id, label, color, bg_color, border_color)
      `)
      .eq('user_id', getOrCreateUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      content: item.content,
      category: item.category, // 🎯 이제 UUID 그대로 사용
      categoryInfo: item.category_info ? {
        id: item.category_info.id,
        label: item.category_info.label,
        color: item.category_info.color,
        bgColor: item.category_info.bg_color,
        borderColor: item.category_info.border_color,
      } : null,
      usageHours: item.usage_hours,
      isFavorite: item.is_favorite,
      tags: item.tags || [],
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  }

  // ➕ 새 프롬프트 생성
  static async createPrompt(promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt> {
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        title: promptData.title,
        description: promptData.description || null,
        content: promptData.content,
        category: promptData.category, // 🎯 UUID 직접 저장
        usage_hours: promptData.usageHours || 0,
        is_favorite: promptData.isFavorite || false,
        tags: promptData.tags || [],
        user_id: getOrCreateUserId(),
      })
      .select(`
        *,
        category_info:categories(id, label, color, bg_color, border_color)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      content: data.content,
      category: data.category,
      categoryInfo: data.category_info,
      usageHours: data.usage_hours,
      isFavorite: data.is_favorite,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // ✏️ 프롬프트 수정
  static async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
    const updateData: Record<string, unknown> = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description || null;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.category !== undefined) updateData.category = updates.category; // 🎯 UUID 직접 사용
    if (updates.usageHours !== undefined) updateData.usage_hours = updates.usageHours;
    if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('prompts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', getOrCreateUserId())
      .select(`
        *,
        category_info:categories(id, label, color, bg_color, border_color)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      content: data.content,
      category: data.category,
      categoryInfo: data.category_info,
      usageHours: data.usage_hours,
      isFavorite: data.is_favorite,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // 🗑️ 프롬프트 삭제
  static async deletePrompt(id: string): Promise<void> {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)
      .eq('user_id', getOrCreateUserId());

    if (error) throw error;
  }

  // ⭐ 즐겨찾기 토글
  static async toggleFavorite(id: string): Promise<Prompt> {
    // 현재 상태 조회
    const { data: currentData, error: fetchError } = await supabase
      .from('prompts')
      .select('is_favorite')
      .eq('id', id)
      .eq('user_id', getOrCreateUserId())
      .single();

    if (fetchError) throw fetchError;

    // 상태 반전
    const { data, error } = await supabase
      .from('prompts')
      .update({ 
        is_favorite: !currentData.is_favorite,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', getOrCreateUserId())
      .select(`
        *,
        category_info:categories(id, label, color, bg_color, border_color)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      content: data.content,
      category: data.category,
      categoryInfo: data.category_info,
      usageHours: data.usage_hours,
      isFavorite: data.is_favorite,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}