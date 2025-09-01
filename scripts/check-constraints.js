const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConstraints() {
  try {
    console.log('📋 prompts 테이블의 제약 조건 확인 중...');
    
    // 제약 조건 확인
    const { data: constraints, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT 
          conname as constraint_name,
          contype as constraint_type,
          pg_get_constraintdef(oid) as constraint_definition,
          confrelid::regclass as referenced_table
        FROM pg_constraint 
        WHERE conrelid = 'prompts'::regclass
        ORDER BY conname;
      `
    });
    
    if (error) {
      console.error('제약 조건 확인 오류:', error);
      
      // 다른 방법으로 시도
      console.log('\n📋 다른 방법으로 prompts 테이블 구조 확인 중...');
      const { data: tableInfo, error: tableError } = await supabase
        .from('information_schema.table_constraints')
        .select('*')
        .eq('table_name', 'prompts');
      
      if (tableError) {
        console.error('테이블 정보 확인 오류:', tableError);
      } else {
        console.log('테이블 제약조건:', tableInfo);
      }
      
      return;
    }
    
    if (constraints && constraints.length > 0) {
      console.log('\n✅ 발견된 제약 조건들:');
      constraints.forEach(constraint => {
        console.log(`- ${constraint.constraint_name} (${constraint.constraint_type}): ${constraint.constraint_definition}`);
        if (constraint.referenced_table) {
          console.log(`  → 참조 테이블: ${constraint.referenced_table}`);
        }
      });
    } else {
      console.log('제약 조건을 찾을 수 없습니다.');
    }
    
    // categories 테이블 존재 확인
    console.log('\n📋 categories 테이블 확인 중...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, label')
      .limit(5);
    
    if (categoriesError) {
      console.error('categories 테이블 확인 오류:', categoriesError);
    } else {
      console.log('✅ categories 테이블 존재 확인');
      console.log('샘플 카테고리:', categoriesData);
    }
    
    // 현재 프롬프트 테이블의 카테고리 값 확인
    console.log('\n📋 현재 prompts 테이블의 카테고리 값 확인 중...');
    const { data: promptsData, error: promptsError } = await supabase
      .from('prompts')
      .select('id, title, category')
      .limit(5);
    
    if (promptsError) {
      console.error('prompts 데이터 확인 오류:', promptsError);
    } else {
      console.log('✅ 현재 프롬프트 카테고리 값:');
      promptsData.forEach(prompt => {
        console.log(`- ${prompt.title}: ${prompt.category}`);
      });
    }
    
  } catch (error) {
    console.error('제약 조건 확인 실패:', error);
  }
}

checkConstraints();