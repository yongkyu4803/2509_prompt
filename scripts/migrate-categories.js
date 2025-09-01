const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  try {
    console.log('카테고리 테이블 마이그레이션을 시작합니다...');
    
    // SQL 파일 읽기
    const sql = fs.readFileSync('categories-migration.sql', 'utf8');
    
    // SQL을 개별 문장으로 분리
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`${statements.length}개의 SQL 문을 실행합니다.`);
    
    // 각 SQL 문 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`실행 중 (${i + 1}/${statements.length}): ${statement.substring(0, 50)}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`SQL 실행 오류 (${i + 1}):`, error);
          // 테이블이 이미 존재하는 경우는 무시
          if (!error.message.includes('already exists')) {
            throw error;
          }
        }
      }
    }
    
    console.log('마이그레이션이 완료되었습니다!');
    
    // 테이블 확인
    const { data: categories, error: selectError } = await supabase
      .from('categories')
      .select('*');
    
    if (selectError) {
      console.error('카테고리 조회 오류:', selectError);
    } else {
      console.log(`생성된 카테고리 수: ${categories?.length || 0}`);
      if (categories && categories.length > 0) {
        console.log('카테고리 목록:');
        categories.forEach(cat => {
          console.log(`- ${cat.label} (${cat.is_default ? '기본' : '사용자정의'})`);
        });
      }
    }
    
  } catch (error) {
    console.error('마이그레이션 실패:', error);
    process.exit(1);
  }
}

runMigration();