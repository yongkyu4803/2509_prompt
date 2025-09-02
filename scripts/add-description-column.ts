import { supabase } from '../src/lib/supabase';

async function addDescriptionColumn() {
  console.log('📊 categories 테이블에 description 컬럼 추가 중...\n');

  try {
    // 1. 현재 테이블 구조 확인
    console.log('🔍 현재 테이블 구조 확인 중...');
    const { data: currentData, error: selectError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ 테이블 조회 실패:', selectError);
      return;
    }

    console.log('✅ 현재 테이블 구조:', Object.keys(currentData?.[0] || {}));

    // 2. description 컬럼이 이미 있는지 확인
    if (currentData?.[0] && 'description' in currentData[0]) {
      console.log('✅ description 컬럼이 이미 존재합니다.');
      return;
    }

    console.log('⚠️  description 컬럼이 없습니다. 수동으로 Supabase 대시보드에서 추가해야 합니다.');
    console.log('\n📋 수동 작업 가이드:');
    console.log('1. https://supabase.com/dashboard 접속');
    console.log('2. 프로젝트 선택');
    console.log('3. Table Editor > categories 테이블 선택');
    console.log('4. "+" 버튼으로 새 컬럼 추가:');
    console.log('   - Name: description');
    console.log('   - Type: text');
    console.log('   - Default value: (비워둠)');
    console.log('   - Is nullable: 체크됨');
    console.log('5. Save 버튼 클릭');

    console.log('\n🧪 대신 기존 카테고리들을 업데이트해서 테스트해보겠습니다...');
    
    // 3. 기존 카테고리 업데이트 테스트 (description 없이)
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*');

    if (categoryError) {
      console.error('❌ 카테고리 조회 실패:', categoryError);
      return;
    }

    console.log(`📊 현재 ${categories?.length}개의 카테고리가 있습니다.`);
    categories?.forEach(cat => {
      console.log(`  - ${cat.id}: "${cat.label}"`);
    });

  } catch (error) {
    console.error('❌ 컬럼 추가 중 오류 발생:', error);
  }
}

// 스크립트 실행
addDescriptionColumn();