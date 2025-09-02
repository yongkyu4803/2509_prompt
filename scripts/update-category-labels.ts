import { supabase } from '../src/lib/supabase';

async function updateCategoryLabels() {
  console.log('🏷️  카테고리 라벨 업데이트 시작...\n');

  try {
    // 현재 카테고리들과 업데이트할 라벨들
    const categoryUpdates = [
      {
        id: '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2',
        currentLabel: '[고급]',
        newLabel: '기본 프롬프트'
      },
      {
        id: '960b5ae8-210e-4106-a5a6-e1aba0da0b23',
        currentLabel: '[심화]',
        newLabel: '이슈분석'
      },
      {
        id: 'd891db58-09c8-495e-ad9e-453f1d7b4713',
        currentLabel: '[중급]',
        newLabel: '시각화'
      }
    ];

    console.log('📝 카테고리 라벨 업데이트 중...');
    
    for (const update of categoryUpdates) {
      console.log(`  ${update.currentLabel} → ${update.newLabel} (${update.id})`);
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .update({ label: update.newLabel })
          .eq('id', update.id)
          .select()
          .single();

        if (error) {
          console.error(`    ❌ 업데이트 실패:`, error);
        } else {
          console.log(`    ✅ 업데이트 성공`);
        }
      } catch (updateError) {
        console.error(`    💥 업데이트 중 오류:`, updateError);
      }
    }

    // 최종 상태 확인
    console.log('\n📊 최종 카테고리 상태:');
    const { data: finalCategories, error } = await supabase
      .from('categories')
      .select('id, label, is_default')
      .order('is_default', { ascending: false });

    if (error) {
      console.error('❌ 최종 상태 조회 실패:', error);
    } else {
      finalCategories?.forEach(cat => {
        console.log(`  ${cat.id}: "${cat.label}" (기본: ${cat.is_default})`);
      });
    }

    // 테스트 조회
    console.log('\n🧪 업데이트된 카테고리 조회 테스트...');
    
    for (const testLabel of ['이슈분석', '기본 프롬프트', '시각화']) {
      const { data: categories } = await supabase
        .from('categories')
        .select('id, label');
      
      const found = categories?.find(cat => cat.label === testLabel);
      if (found) {
        console.log(`✅ ${testLabel}: ${found.id}`);
      } else {
        console.log(`❌ ${testLabel}: 찾을 수 없음`);
      }
    }

    console.log('\n🎉 라벨 업데이트 완료!');

  } catch (error) {
    console.error('❌ 라벨 업데이트 중 오류 발생:', error);
  }
}

// 스크립트 실행
updateCategoryLabels();