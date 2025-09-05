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
  try {
    console.log('🔄 convertCategoryToLegacy 시작, 입력:', categoryId);
    
    // 입력 값 검증
    if (!categoryId || typeof categoryId !== 'string') {
      console.warn('❌ 유효하지 않은 카테고리 ID:', categoryId);
      return 'development'; // 기본값
    }
    
    // UUID 형태인지 확인 (간단한 패턴 매칭)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidPattern.test(categoryId)) {
      // 이미 레거시 문자열 카테고리인 경우
      console.log('✅ 이미 레거시 카테고리:', categoryId);
      return categoryId;
    }
    
    // categories 테이블에서 카테고리 정보 조회
    console.log('🔍 카테고리 정보 조회 중:', categoryId);
    const { data: categoryData, error } = await supabase
      .from('categories')
      .select('id, label')
      .eq('id', categoryId)
      .single();
    
    if (error) {
      console.warn('⚠️ 카테고리 조회 오류:', error);
      console.warn('기본값(development)으로 폴백');
      return 'development';
    }
    
    if (!categoryData) {
      console.warn('⚠️ 카테고리를 찾을 수 없음:', categoryId);
      console.warn('기본값(development)으로 폴백');
      return 'development';
    }
    
    console.log('✅ 카테고리 정보 조회 성공:', categoryData);
    
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
      console.log(`📝 새 카테고리 매핑 없음, development로 폴백: ${categoryId} (${categoryData.label})`);
      return 'development'; // 안전한 기본값으로 폴백
    }
    
    console.log(`✅ 카테고리 변환 완료: ${categoryId} (${categoryData.label}) → ${legacyCategory}`);
    return legacyCategory;
    
  } catch (error) {
    console.error('❌ convertCategoryToLegacy 전체 오류:', error);
    console.warn('🔄 기본값(development)으로 폴백');
    return 'development'; // 안전한 기본값
  }
}

// Supabase 데이터베이스 타입 정의
interface SupabasePrompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string; // UUID 문자열 저장
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
    category: await convertCategoryToLegacy(supabasePrompt.category), // UUID → 레거시 문자열 변환
    usageHours: supabasePrompt.usage_hours,
    isFavorite: supabasePrompt.is_favorite,
    tags: supabasePrompt.tags || [],
    createdAt: supabasePrompt.created_at,
    updatedAt: supabasePrompt.updated_at,
  };
}

// 프론트엔드 데이터를 Supabase 타입으로 변환 (비동기)
async function transformFrontendToSupabase(prompt: Partial<Prompt>) {
  try {
    console.log('🔄 transformFrontendToSupabase 시작');
    console.log('📥 입력 데이터:', JSON.stringify(prompt, null, 2));
    
    const result: Record<string, unknown> = {};
    
    // 필드별로 명시적으로 처리
    if (prompt.id !== undefined) result.id = prompt.id;
    if (prompt.title !== undefined) {
      result.title = prompt.title;
      if (!prompt.title.trim()) {
        throw new Error('제목은 비어있을 수 없습니다.');
      }
    }
    if (prompt.description !== undefined) result.description = prompt.description || null;
    if (prompt.content !== undefined) {
      result.content = prompt.content;
      if (!prompt.content.trim()) {
        throw new Error('프롬프트 내용은 비어있을 수 없습니다.');
      }
    }
    
    // 카테고리 변환 (레거시 문자열 → UUID)  
    if (prompt.category !== undefined) {
      console.log('🔄 카테고리 변환 중 (문자열 → UUID):', prompt.category);
      result.category = await convertLegacyToCategory(prompt.category);
      console.log('✅ 카테고리 변환 완료 (UUID):', result.category);
    }
    
    if (prompt.usageHours !== undefined) result.usage_hours = prompt.usageHours;
    if (prompt.isFavorite !== undefined) result.is_favorite = prompt.isFavorite;
    if (prompt.tags !== undefined) result.tags = prompt.tags || [];
    
    // 타임스탬프 처리
    if (prompt.createdAt !== undefined) result.created_at = prompt.createdAt;
    if (prompt.updatedAt !== undefined) result.updated_at = prompt.updatedAt;
    
    // user_id는 항상 포함 (업데이트 시 필요)
    const userId = getOrCreateUserId();
    result.user_id = userId;
    console.log('👤 사용자 ID 설정:', userId);
    
    console.log('✅ transformFrontendToSupabase 완료');
    console.log('📤 변환 결과:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('❌ transformFrontendToSupabase 오류:', error);
    throw error;
  }
}

export class PromptService {
  // Supabase 연결 상태 테스트
  static async testConnection(): Promise<void> {
    try {
      console.log('🔗 Supabase 연결 테스트 시작');
      console.log('🔧 Environment variables:');
      console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 설정됨' : '❌ 없음');
      console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 없음');
      
      // 단순 테이블 조회로 연결 테스트
      const { data, error } = await supabase
        .from('prompts')
        .select('count')
        .limit(1);
        
      if (error) {
        console.error('❌ Supabase 연결 테스트 실패:', error);
        throw error;
      }
      
      console.log('✅ Supabase 연결 테스트 성공');
    } catch (error) {
      console.error('💥 Supabase 연결 테스트 오류:', error);
      throw error;
    }
  }

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
      console.log('🚀 PromptService.createPrompt 시작');
      console.log('📋 입력 데이터:', JSON.stringify(promptData, null, 2));
      
      const supabaseData = await transformFrontendToSupabase({
        ...promptData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      console.log('📤 Supabase로 전송할 데이터:', JSON.stringify(supabaseData, null, 2));
      
      // Supabase 연결 상태 확인
      console.log('🔗 Supabase 클라이언트 확인:', {
        supabaseUrl: supabase.supabaseUrl,
        supabaseKey: supabase.supabaseKey ? '***설정됨***' : '❌ 없음',
      });

      const { data, error } = await supabase
        .from('prompts')
        .insert([supabaseData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase 삽입 오류:');
        console.error('오류 코드:', error.code);
        console.error('오류 메시지:', error.message);
        console.error('오류 세부사항:', error.details);
        console.error('오류 힌트:', error.hint);
        console.error('전체 오류 객체:', JSON.stringify(error, null, 2));
        
        // 일반적인 오류 패턴 분석 및 해결 제안
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
          console.error('🚨 RLS 정책 오류 가능성 - 테이블 권한을 확인하세요');
          console.error('해결방법: Supabase 대시보드에서 prompts 테이블의 RLS 정책을 확인하고');
          console.error('익명 사용자의 INSERT 권한을 허용하거나, 인증 시스템을 구현하세요');
        } else if (error.code === '23505') {
          console.error('🚨 중복 키 오류 - ID가 이미 존재합니다');
        } else if (error.code === '23502') {
          console.error('🚨 NOT NULL 제약조건 위반 - 필수 필드가 누락되었습니다');
        } else if (error.code === '23503') {
          console.error('🚨 외래키 제약조건 위반 - 참조된 데이터가 존재하지 않습니다');
        } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          console.error('🚨 테이블이 존재하지 않습니다 - 데이터베이스 스키마를 확인하세요');
        }
        
        throw error;
      }

      if (!data) {
        console.error('❌ Supabase에서 데이터를 반환하지 않음');
        throw new Error('No data returned from Supabase');
      }

      console.log('✅ Supabase 삽입 성공:', JSON.stringify(data, null, 2));
      const result = await transformSupabaseToFrontend(data);
      console.log('📥 변환된 결과:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error('💥 createPrompt 함수 전체 오류:', error);
      console.error('오류 타입:', typeof error);
      console.error('오류 생성자:', error?.constructor?.name);
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
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

  // 데이터베이스에서 최신 데이터 강제 새로고침
  static async refreshPrompts(): Promise<Prompt[]> {
    try {
      console.log('🔄 데이터베이스에서 최신 프롬프트 데이터 강제 새로고침');
      const userId = getOrCreateUserId();
      
      // 캐시 무효화를 위해 타임스탬프 추가
      const timestamp = new Date().getTime();
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 데이터베이스 새로고침 오류:', error);
        throw error;
      }

      const refreshedPrompts = data ? await Promise.all(data.map(transformSupabaseToFrontend)) : [];
      console.log(`✅ 데이터베이스에서 ${refreshedPrompts.length}개 프롬프트 새로고침 완료`);
      return refreshedPrompts;
    } catch (error) {
      console.error('❌ refreshPrompts 오류:', error);
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