import { supabase } from '../src/lib/supabase';

/**
 * 🚀 카테고리 시스템 단순화 마이그레이션
 * 
 * 목표: prompts.category를 레거시 문자열에서 UUID로 변환
 * 
 * 1. 기존 prompts 데이터 백업
 * 2. 레거시 문자열 → UUID 매핑
 * 3. prompts.category 업데이트
 * 4. 검증
 */

// 레거시 → 한국어 라벨 매핑
const LEGACY_TO_LABEL: Record<string, string> = {
  'development': '기본 프롬프트',
  'marketing': '보도자료',
  'analysis': '이슈분석', 
  'creative': '질의서작성',
  'business': '시각화',
};

async function migrateToSimpleCategories() {
  console.log('🚀 카테고리 시스템 단순화 마이그레이션 시작...\n');

  try {
    // 1. 현재 상태 분석
    console.log('📊 현재 데이터 분석 중...');
    
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, label');
    
    if (catError) throw catError;
    
    const { data: prompts, error: promptError } = await supabase
      .from('prompts')
      .select('id, category');
    
    if (promptError) throw promptError;
    
    console.log(`📋 카테고리: ${categories?.length}개`);
    console.log(`📋 프롬프트: ${prompts?.length}개`);
    
    // 2. 매핑 테이블 생성
    const labelToUuid: Record<string, string> = {};
    categories?.forEach(cat => {
      labelToUuid[cat.label] = cat.id;
    });
    
    console.log('\n🔄 매핑 테이블:');
    Object.entries(LEGACY_TO_LABEL).forEach(([legacy, label]) => {
      const uuid = labelToUuid[label];
      console.log(`  ${legacy} → ${label} → ${uuid}`);
    });
    
    // 3. 프롬프트 업데이트
    let updatedCount = 0;
    let errorCount = 0;
    
    console.log('\n🔄 프롬프트 카테고리 업데이트 중...');
    
    for (const prompt of prompts || []) {
      try {
        // UUID인지 확인
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidPattern.test(prompt.category)) {
          console.log(`  ✅ ${prompt.id}: 이미 UUID (${prompt.category})`);
          continue;
        }
        
        // 레거시 문자열을 UUID로 변환
        const label = LEGACY_TO_LABEL[prompt.category];
        if (!label) {
          console.warn(`  ⚠️ ${prompt.id}: 알 수 없는 카테고리 (${prompt.category})`);
          errorCount++;
          continue;
        }
        
        const uuid = labelToUuid[label];
        if (!uuid) {
          console.warn(`  ⚠️ ${prompt.id}: UUID를 찾을 수 없음 (${label})`);
          errorCount++;
          continue;
        }
        
        // 업데이트 실행
        const { error: updateError } = await supabase
          .from('prompts')
          .update({ category: uuid })
          .eq('id', prompt.id);
        
        if (updateError) {
          console.error(`  ❌ ${prompt.id}: 업데이트 실패`, updateError.message);
          errorCount++;
        } else {
          console.log(`  ✅ ${prompt.id}: ${prompt.category} → ${uuid}`);
          updatedCount++;
        }
        
      } catch (error) {
        console.error(`  💥 ${prompt.id}: 처리 중 오류`, error);
        errorCount++;
      }
    }
    
    // 4. 결과 검증
    console.log('\n🔍 마이그레이션 결과 검증...');
    
    const { data: updatedPrompts, error: verifyError } = await supabase
      .from('prompts')
      .select(`
        id, 
        category,
        category_info:categories(label)
      `);
    
    if (verifyError) throw verifyError;
    
    let validCount = 0;
    let invalidCount = 0;
    
    updatedPrompts?.forEach(prompt => {
      if (prompt.category_info) {
        validCount++;
        console.log(`  ✅ ${prompt.id}: ${prompt.category} (${prompt.category_info.label})`);
      } else {
        invalidCount++;
        console.log(`  ❌ ${prompt.id}: 유효하지 않은 카테고리 (${prompt.category})`);
      }
    });
    
    // 5. 최종 요약
    console.log('\n🎉 마이그레이션 완료!');
    console.log(`📊 통계:`);
    console.log(`  - 업데이트됨: ${updatedCount}개`);
    console.log(`  - 오류: ${errorCount}개`);
    console.log(`  - 유효한 참조: ${validCount}개`);
    console.log(`  - 잘못된 참조: ${invalidCount}개`);
    
    if (invalidCount > 0) {
      console.warn('\n⚠️ 잘못된 참조가 있습니다. 수동으로 확인해주세요.');
    }
    
  } catch (error) {
    console.error('💥 마이그레이션 중 오류 발생:', error);
  }
}

// 실행
if (require.main === module) {
  migrateToSimpleCategories();
}