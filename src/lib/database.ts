import { supabase } from './supabase';
import { Prompt, PromptCategory } from './types';

// 익명 사용자 ID 생성 및 저장
function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'user-y2r2japwz';
  
  // 기존 데이터와 호환성을 위해 기존 사용자 ID 사용
  return 'user-y2r2japwz';
}

// 레거시 카테고리 문자열을 UUID 카테고리로 변환 (DB → UI)
async function convertLegacyToCategory(legacyCategory: string): Promise<string> {
  // 이미 UUID 형태인지 확인
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(legacyCategory)) {
    // 🔧 수정: UUID가 실제로 존재하는지 확인
    try {
      const { data: existingCategory, error } = await supabase
        .from('categories')
        .select('id')
        .eq('id', legacyCategory)
        .single();
        
      if (!error && existingCategory) {
        return legacyCategory; // 존재하는 UUID
      }
      
      console.warn('존재하지 않는 UUID 카테고리, 기본값 사용:', legacyCategory);
      return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2'; // 기본 UUID로 폴백
    } catch (verifyError) {
      console.error('UUID 카테고리 검증 중 오류:', verifyError);
      return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2';
    }
  }
  
  try {
    // 레거시 카테고리에서 라벨로 매핑 (실제 DB 라벨과 일치)
    const legacyToLabelMapping: Record<string, string> = {
      'development': '기본 프롬프트',
      'marketing': '보도자료',
      'analysis': '이슈분석',
      'creative': '질의서작성',
      'business': '시각화', // 실제 DB의 카테고리명과 일치
    };
    
    const label = legacyToLabelMapping[legacyCategory];
    if (!label) {
      console.warn('알 수 없는 레거시 카테고리, 기본값 사용:', legacyCategory);
      return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2'; // 프롬프트 기본 UUID
    }
    
    // categories 테이블에서 라벨로 UUID 찾기 (URL 인코딩 문제 방지)
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, label');
    
    if (error) {
      console.warn('카테고리 조회 중 오류:', error);
      return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2';
    }
    
    // 클라이언트 사이드에서 라벨 매칭 (URL 인코딩 문제 방지)
    const categoryData = categories?.find(cat => cat.label === label);
    
    if (!categoryData) {
      console.warn('카테고리 UUID를 찾을 수 없음, 기본값 사용:', label);
      return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2'; // 프롬프트 기본 UUID
    }
    
    console.log(`레거시 카테고리 변환: ${legacyCategory} → ${categoryData.id} (${label})`);
    return categoryData.id;
    
  } catch (error) {
    console.error('레거시 카테고리 변환 중 오류:', error);
    return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2'; // 기본값
  }
}

// UUID 카테고리를 레거시 카테고리 문자열로 변환 (UI → DB)
async function convertCategoryToLegacy(categoryId: string): Promise<string> {
  // UUID 형태인지 확인 (간단한 패턴 매칭)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidPattern.test(categoryId)) {
    // 이미 레거시 문자열 카테고리인 경우
    return categoryId;
  }
  
  try {
    // categories 테이블에서 카테고리 정보 조회
    const { data: categoryData, error } = await supabase
      .from('categories')
      .select('id, label')
      .eq('id', categoryId)
      .single();
    
    if (error || !categoryData) {
      console.warn('카테고리를 찾을 수 없음, 원본 UUID 반환:', categoryId);
      // 🔧 수정: 존재하지 않는 UUID의 경우 원본을 반환하여 정보 보존
      return categoryId;
    }
    
    // 라벨을 기반으로 레거시 카테고리 매핑 (실제 DB 라벨과 일치)
    const categoryMapping: Record<string, string> = {
      '기본 프롬프트': 'development',
      '보도자료': 'marketing', 
      '이슈분석': 'analysis',
      '질의서작성': 'creative',
      '시각화': 'business', // 실제 DB의 카테고리명과 일치
      // 새로 추가된 사용자 정의 카테고리들은 UUID를 직접 반환하도록 함
      // 기존 라벨들도 대응 (하위 호환성)
      '개발': 'development',
      '프롬프트 기본': 'development',
      '마케팅': 'marketing',
      '분석': 'analysis',
      '창작': 'creative',
      '아이데이션': 'creative', // 새로 추가된 카테고리를 creative로 매핑
    };
    
    // 🔧 수정: 매핑되지 않는 새 카테고리의 경우 UUID를 직접 사용
    const legacyCategory = categoryMapping[categoryData.label];
    if (!legacyCategory) {
      console.log(`새 카테고리 매핑 없음, UUID 직접 사용: ${categoryId} (${categoryData.label})`);
      return categoryId; // 원본 UUID 보존 (새로 추가된 사용자 정의 카테고리)
    }
    
    console.log(`카테고리 변환: ${categoryId} (${categoryData.label}) → ${legacyCategory}`);
    return legacyCategory;
    
  } catch (error) {
    console.error('카테고리 변환 중 오류:', error);
    // 🔧 수정: 오류 시에도 원본 UUID 보존
    return categoryId;
  }
}

// Supabase 데이터베이스 타입 정의
interface SupabasePrompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: PromptCategory;
  tags: string[];
  is_favorite: boolean;
  usage_hours: number;
  created_at: string;
  updated_at: string;
}

// Supabase 데이터를 프론트엔드 타입으로 변환 (비동기)
async function transformSupabaseToFrontend(supabasePrompt: SupabasePrompt): Promise<Prompt> {
  return {
    id: supabasePrompt.id,
    title: supabasePrompt.title,
    description: supabasePrompt.description || '',
    content: supabasePrompt.content,
    category: await convertLegacyToCategory(supabasePrompt.category), // 레거시 → UUID 변환
    usageHours: supabasePrompt.usage_hours,
    isFavorite: supabasePrompt.is_favorite,
    tags: supabasePrompt.tags || [],
    createdAt: supabasePrompt.created_at,
    updatedAt: supabasePrompt.updated_at,
  };
}

// 프론트엔드 데이터를 Supabase 타입으로 변환 (비동기)
async function transformFrontendToSupabase(prompt: Partial<Prompt>) {
  const result: Record<string, unknown> = {};
  
  // 필드별로 명시적으로 처리
  if (prompt.id !== undefined) result.id = prompt.id;
  if (prompt.title !== undefined) result.title = prompt.title;
  if (prompt.description !== undefined) result.description = prompt.description || null;
  if (prompt.content !== undefined) result.content = prompt.content;
  
  // 카테고리 변환 (UUID → 레거시 문자열)
  if (prompt.category !== undefined) {
    result.category = await convertCategoryToLegacy(prompt.category);
  }
  
  if (prompt.usageHours !== undefined) result.usage_hours = prompt.usageHours;
  if (prompt.isFavorite !== undefined) result.is_favorite = prompt.isFavorite;
  if (prompt.tags !== undefined) result.tags = prompt.tags || [];
  
  // updatedAt 처리
  if (prompt.updatedAt !== undefined) result.updated_at = prompt.updatedAt;
  
  // user_id는 항상 포함 (업데이트 시 필요)
  result.user_id = getOrCreateUserId();
  
  return result;
}

export class PromptService {
  // 모든 프롬프트 조회
  static async getPrompts(): Promise<Prompt[]> {
    try {
      const userId = getOrCreateUserId();
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
        throw error;
      }

      return data ? await Promise.all(data.map(transformSupabaseToFrontend)) : [];
    } catch (error) {
      console.error('Error in getPrompts:', error);
      return [];
    }
  }

  // 새 프롬프트 생성
  static async createPrompt(promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt> {
    try {
      const supabaseData = await transformFrontendToSupabase({
        ...promptData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from('prompts')
        .insert([supabaseData])
        .select()
        .single();

      if (error) {
        console.error('Error creating prompt:', error);
        throw error;
      }

      return await transformSupabaseToFrontend(data);
    } catch (error) {
      console.error('Error in createPrompt:', error);
      throw error;
    }
  }

  // 프롬프트 수정
  static async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
    try {
      console.log('🔄 PromptService.updatePrompt 호출됨:', { id, updates });
      
      const supabaseData = await transformFrontendToSupabase({
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      
      console.log('📤 Supabase 업데이트 데이터:', supabaseData);

      const { data, error } = await supabase
        .from('prompts')
        .update(supabaseData)
        .eq('id', id)
        .eq('user_id', getOrCreateUserId())
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase 업데이트 오류:', error);
        console.error('오류 코드:', error.code);
        console.error('오류 메시지:', error.message);
        console.error('오류 세부사항:', error.details);
        throw error;
      }

      console.log('✅ Supabase 업데이트 성공:', data);
      const result = transformSupabaseToFrontend(data);
      console.log('📥 변환된 결과 데이터:', result);
      
      return result;
    } catch (error) {
      console.error('💥 updatePrompt 함수 오류:', error);
      throw error;
    }
  }

  // 프롬프트 삭제
  static async deletePrompt(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', getOrCreateUserId());

      if (error) {
        console.error('Error deleting prompt:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deletePrompt:', error);
      throw error;
    }
  }

  // 즐겨찾기 토글
  static async toggleFavorite(id: string): Promise<Prompt> {
    try {
      console.log('⭐ PromptService.toggleFavorite 시작, ID:', id);
      const userId = getOrCreateUserId();
      console.log('👤 사용자 ID:', userId);

      // 먼저 현재 상태를 가져옴
      const { data: currentData, error: fetchError } = await supabase
        .from('prompts')
        .select('is_favorite')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('❌ 현재 즐겨찾기 상태 조회 실패:', fetchError);
        throw fetchError;
      }

      console.log('📋 현재 즐겨찾기 상태:', currentData.is_favorite);
      const newFavoriteStatus = !currentData.is_favorite;
      console.log('📋 새로운 즐겨찾기 상태:', newFavoriteStatus);

      // 상태를 반전시켜서 업데이트
      const { data, error } = await supabase
        .from('prompts')
        .update({ 
          is_favorite: newFavoriteStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ 즐겨찾기 토글 업데이트 실패:', error);
        throw error;
      }

      console.log('✅ Supabase 즐겨찾기 토글 성공');
      const result = await transformSupabaseToFrontend(data);
      console.log('📤 변환된 결과:', result.isFavorite);
      return result;
    } catch (error) {
      console.error('💥 PromptService.toggleFavorite 오류:', error);
      throw error;
    }
  }
}

// 데이터 마이그레이션 함수 (localStorage -> Supabase)
export async function migrateLocalStorageData(): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    
    const localData = localStorage.getItem('prompts');
    if (!localData) return;

    const prompts: Prompt[] = JSON.parse(localData);
    if (!Array.isArray(prompts) || prompts.length === 0) return;

    console.log(`Migrating ${prompts.length} prompts from localStorage to Supabase...`);

    // 기존 Supabase 데이터 확인
    const existingPrompts = await PromptService.getPrompts();
    
    // 중복 방지: 제목이 같은 프롬프트는 마이그레이션하지 않음
    const existingTitles = new Set(existingPrompts.map(p => p.title));
    const newPrompts = prompts.filter(p => !existingTitles.has(p.title));

    if (newPrompts.length === 0) {
      console.log('No new prompts to migrate.');
      return;
    }

    // 배치로 마이그레이션
    for (const prompt of newPrompts) {
      try {
        await PromptService.createPrompt({
          title: prompt.title,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          usageHours: prompt.usageHours,
          isFavorite: prompt.isFavorite,
          tags: prompt.tags,
        });
      } catch (error) {
        console.error(`Failed to migrate prompt: ${prompt.title}`, error);
      }
    }

    console.log(`Successfully migrated ${newPrompts.length} prompts to Supabase.`);
    
    // 마이그레이션 완료 후 localStorage 백업
    localStorage.setItem('prompts_backup', localData);
    
  } catch (error) {
    console.error('Error during migration:', error);
  }
}