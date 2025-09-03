import { supabase } from '../src/lib/supabase';

/**
 * 🔧 CHECK 제약조건 문제 해결 스크립트
 * 
 * Supabase 콘솔에서 직접 실행해야 할 SQL:
 * 
 * 1. CHECK 제약조건 제거:
 *    ALTER TABLE prompts DROP CONSTRAINT IF EXISTS prompts_category_check;
 * 
 * 2. Foreign Key 추가:
 *    ALTER TABLE prompts 
 *    ADD CONSTRAINT fk_prompts_category 
 *    FOREIGN KEY (category) REFERENCES categories(id);
 */

async function fixConstraintIssue() {
  console.log('🔧 제약조건 문제 해결 시작...\n');

  try {
    // 1. 현재 제약조건 상태 확인
    console.log('📊 현재 제약조건 확인 중...');
    
    const { data: constraints, error: constraintError } = await supabase
      .rpc('get_table_constraints', { table_name: 'prompts' })
      .select();
    
    if (constraintError) {
      console.log('제약조건 조회 실패 (예상됨):', constraintError.message);
    } else {
      console.log('현재 제약조건:', constraints);
    }

    // 2. 현재 카테고리 값들 분석
    console.log('\n📊 현재 prompts.category 값 분석:');
    
    const { data: prompts, error: promptError } = await supabase
      .from('prompts')
      .select('category')
      .limit(10);
    
    if (promptError) throw promptError;
    
    const categoryTypes = new Set();
    prompts?.forEach(p => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.category);
      categoryTypes.add(isUuid ? 'UUID' : 'LEGACY');
      console.log(`  ${p.category} (${isUuid ? 'UUID' : 'LEGACY'})`);
    });
    
    console.log(`\n타입 분석: ${Array.from(categoryTypes).join(', ')}`);

    // 3. 해결 방법 안내
    console.log('\n🔧 해결 방법:');
    console.log('Supabase 콘솔 > SQL Editor에서 다음 명령어 실행:');
    console.log('');
    console.log('-- 1. CHECK 제약조건 제거');
    console.log('ALTER TABLE prompts DROP CONSTRAINT IF EXISTS prompts_category_check;');
    console.log('');
    console.log('-- 2. Foreign Key 추가 (선택사항)');
    console.log('ALTER TABLE prompts');
    console.log('ADD CONSTRAINT fk_prompts_category');
    console.log('FOREIGN KEY (category) REFERENCES categories(id);');
    console.log('');

    // 4. 제약조건 제거 후 테스트용 업데이트 시도
    console.log('\n🧪 테스트 업데이트 시도...');
    
    if (prompts && prompts.length > 0) {
      const testPrompt = prompts[0];
      const { error: testError } = await supabase
        .from('prompts')
        .update({ updated_at: new Date().toISOString() })
        .eq('category', testPrompt.category)
        .limit(1);
      
      if (testError) {
        console.log('❌ 여전히 제약조건 오류:', testError.message);
        console.log('→ Supabase 콘솔에서 수동으로 제약조건을 제거해야 합니다.');
      } else {
        console.log('✅ 테스트 업데이트 성공! 제약조건이 해결되었습니다.');
      }
    }

  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

// 실행
if (require.main === module) {
  fixConstraintIssue();
}