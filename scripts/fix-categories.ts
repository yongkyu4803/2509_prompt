import { supabase } from '../src/lib/supabase';
import { CategoryService, DEFAULT_CATEGORIES } from '../src/lib/category-service';

async function fixCategories() {
  console.log('🔧 카테고리 문제 수정 시작...\n');

  try {
    // 1. 현재 데이터베이스의 모든 카테고리 조회
    console.log('📊 현재 카테고리 상태 확인 중...');
    const existingCategories = await CategoryService.getCategories();
    
    console.log(`현재 카테고리 개수: ${existingCategories.length}개`);
    existingCategories.forEach(cat => {
      console.log(`  - ${cat.id}: "${cat.label}" (기본: ${cat.isDefault})`);
    });

    // 2. 필요한 카테고리 정의 (한국어 버전)
    const requiredCategories = [
      {
        id: '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2',
        label: '기본 프롬프트',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200',
        isDefault: true,
      },
      {
        id: '437e1cff-0ec1-4d9f-b37f-7a96d8d2a0ae',
        label: '보도자료',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200',
        isDefault: true,
      },
      {
        id: '960b5ae8-210e-4106-a5a6-e1aba0da0b23',
        label: '이슈분석',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        isDefault: true,
      },
      {
        id: '4bd095c7-261d-40f8-aca2-1b450adf0d37',
        label: '질의서작성',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200',
        isDefault: true,
      },
      {
        id: 'd891db58-09c8-495e-ad9e-453f1d7b4713',
        label: '시각화',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
        isDefault: true,
      }
    ];

    console.log('\n🔍 필요한 카테고리 확인 중...');
    
    // 3. 누락된 카테고리 찾기 및 생성
    for (const requiredCat of requiredCategories) {
      const exists = existingCategories.find(cat => cat.id === requiredCat.id);
      
      if (!exists) {
        console.log(`❌ 누락된 카테고리: ${requiredCat.id} (${requiredCat.label})`);
        console.log('  생성 중...');
        
        try {
          // 직접 Supabase에 삽입 (ID 포함)
          const { data, error } = await supabase
            .from('categories')
            .upsert({
              id: requiredCat.id,
              label: requiredCat.label,
              color: requiredCat.color,
              bg_color: requiredCat.bgColor,
              border_color: requiredCat.borderColor,
              is_default: requiredCat.isDefault,
            })
            .select()
            .single();

          if (error) {
            console.error(`  ❌ 생성 실패:`, error);
          } else {
            console.log(`  ✅ 생성 성공: ${data.id}`);
          }
        } catch (createError) {
          console.error(`  💥 생성 중 오류:`, createError);
        }
      } else {
        console.log(`✅ 존재함: ${requiredCat.id} (${requiredCat.label})`);
      }
    }

    // 4. 카테고리 테스트
    console.log('\n🧪 카테고리 조회 테스트...');
    
    for (const testLabel of ['이슈분석', '기본 프롬프트', '질의서작성']) {
      try {
        // 새로운 방식으로 테스트
        const { data: categories, error } = await supabase
          .from('categories')
          .select('id, label');
        
        if (error) {
          console.error(`❌ ${testLabel} 조회 중 오류:`, error);
        } else {
          const found = categories?.find(cat => cat.label === testLabel);
          if (found) {
            console.log(`✅ ${testLabel}: ${found.id}`);
          } else {
            console.log(`❌ ${testLabel}: 찾을 수 없음`);
          }
        }
      } catch (testError) {
        console.error(`💥 ${testLabel} 테스트 중 오류:`, testError);
      }
    }

    console.log('\n🎉 카테고리 수정 완료!');

  } catch (error) {
    console.error('❌ 카테고리 수정 중 오류 발생:', error);
  }
}

// 스크립트 실행
fixCategories();