import { supabase } from '../src/lib/supabase';
import { convertLegacyToCategory } from '../src/lib/database';

// 테스트용으로 convertLegacyToCategory 함수를 복사
async function testConvertLegacyToCategory(legacyCategory: string): Promise<string> {
  // 이미 UUID 형태인지 확인
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(legacyCategory)) {
    try {
      const { data: existingCategory, error } = await supabase
        .from('categories')
        .select('id')
        .eq('id', legacyCategory)
        .single();
        
      if (!error && existingCategory) {
        return legacyCategory;
      }
      
      console.warn('존재하지 않는 UUID 카테고리, 기본값 사용:', legacyCategory);
      return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2';
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
      'business': '시각화',
    };
    
    const label = legacyToLabelMapping[legacyCategory];
    if (!label) {
      console.warn('알 수 없는 레거시 카테고리, 기본값 사용:', legacyCategory);
      return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2';
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
      return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2';
    }
    
    console.log(`✅ 레거시 카테고리 변환: ${legacyCategory} → ${categoryData.id} (${label})`);
    return categoryData.id;
    
  } catch (error) {
    console.error('레거시 카테고리 변환 중 오류:', error);
    return '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2';
  }
}

async function testKoreanLookups() {
  console.log('🧪 한국어 카테고리 조회 테스트 시작...\n');

  try {
    // 1. 직접 Supabase 조회 테스트 (기존 방식 - 실패했던 방식)
    console.log('📋 1단계: 직접 eq() 필터링 테스트 (기존 방식)');
    
    for (const testLabel of ['이슈분석', '기본 프롬프트', '질의서작성']) {
      console.log(`  테스트: "${testLabel}"`);
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id')
          .eq('label', testLabel)
          .single();
        
        if (error) {
          console.log(`    ❌ 실패 (${error.code}): ${error.message}`);
        } else {
          console.log(`    ✅ 성공: ${data?.id}`);
        }
      } catch (testError) {
        console.log(`    💥 오류: ${testError}`);
      }
    }

    // 2. 새로운 방식 테스트 (모든 데이터를 가져온 후 클라이언트에서 필터링)
    console.log('\n📋 2단계: 클라이언트 사이드 필터링 테스트 (새로운 방식)');
    
    const { data: allCategories, error: allError } = await supabase
      .from('categories')
      .select('id, label');
    
    if (allError) {
      console.log(`❌ 전체 조회 실패: ${allError.message}`);
    } else {
      console.log(`✅ 전체 조회 성공: ${allCategories?.length}개 카테고리`);
      
      for (const testLabel of ['이슈분석', '기본 프롬프트', '질의서작성']) {
        const found = allCategories?.find(cat => cat.label === testLabel);
        if (found) {
          console.log(`  ✅ "${testLabel}": ${found.id}`);
        } else {
          console.log(`  ❌ "${testLabel}": 찾을 수 없음`);
        }
      }
    }

    // 3. 레거시 변환 함수 테스트
    console.log('\n📋 3단계: 레거시 카테고리 변환 테스트');
    
    const legacyTests = ['development', 'marketing', 'analysis', 'creative', 'business'];
    for (const legacy of legacyTests) {
      console.log(`  테스트: ${legacy}`);
      try {
        const result = await testConvertLegacyToCategory(legacy);
        console.log(`    ✅ 변환 결과: ${result}`);
      } catch (conversionError) {
        console.log(`    ❌ 변환 실패: ${conversionError}`);
      }
    }

    // 4. UUID 직접 조회 테스트
    console.log('\n📋 4단계: UUID 직접 조회 테스트');
    
    const testUUIDs = [
      '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2',
      '960b5ae8-210e-4106-a5a6-e1aba0da0b23',
      '4bd095c7-261d-40f8-aca2-1b450adf0d37'
    ];
    
    for (const uuid of testUUIDs) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, label')
          .eq('id', uuid)
          .single();
        
        if (error) {
          console.log(`  ❌ ${uuid}: ${error.message}`);
        } else {
          console.log(`  ✅ ${uuid}: "${data.label}"`);
        }
      } catch (uuidError) {
        console.log(`  💥 ${uuid}: ${uuidError}`);
      }
    }

    console.log('\n🎉 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  }
}

// 스크립트 실행
testKoreanLookups();