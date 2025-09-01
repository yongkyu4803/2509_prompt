const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  try {
    console.log('데이터베이스 스키마 확인 중...');
    
    // 프롬프트 테이블 구조 확인
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('스키마 확인 오류:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('테이블에 데이터가 없습니다.');
      return;
    }
    
    console.log('프롬프트 테이블 스키마:');
    const sampleData = data[0];
    Object.keys(sampleData).forEach(key => {
      const value = sampleData[key];
      const type = typeof value;
      console.log(`- ${key}: ${type} (예시: ${JSON.stringify(value).substring(0, 50)})`);
    });
    
  } catch (error) {
    console.error('스키마 확인 실패:', error);
  }
}

checkSchema();