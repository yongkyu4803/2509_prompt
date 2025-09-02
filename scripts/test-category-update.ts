import { CategoryService } from '../src/lib/category-service';

async function testCategoryUpdate() {
  console.log('🧪 카테고리 수정 기능 테스트 시작...\n');

  try {
    // 1. 현재 카테고리 목록 조회
    console.log('📊 현재 카테고리 목록:');
    const categories = await CategoryService.getCategories();
    
    categories.forEach(cat => {
      console.log(`  ${cat.id}: "${cat.label}" (${cat.color})`);
    });

    if (categories.length === 0) {
      console.log('❌ 카테고리가 없습니다.');
      return;
    }

    // 2. 첫 번째 카테고리를 테스트용으로 수정
    const testCategory = categories[0];
    const originalLabel = testCategory.label;
    const testLabel = `${originalLabel} (테스트)`;

    console.log(`\n🔄 카테고리 수정 테스트: "${originalLabel}" → "${testLabel}"`);

    // 3. 카테고리 수정 실행
    const updatedCategory = await CategoryService.updateCategory(testCategory.id, {
      label: testLabel,
      color: 'text-orange-700',  // 색상도 변경
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
    });

    console.log('✅ 수정 성공:', {
      id: updatedCategory.id,
      label: updatedCategory.label,
      color: updatedCategory.color,
      bgColor: updatedCategory.bgColor,
    });

    // 4. 수정된 내용 확인
    console.log('\n🔍 수정 후 전체 카테고리 목록:');
    const updatedCategories = await CategoryService.getCategories();
    
    updatedCategories.forEach(cat => {
      const isChanged = cat.id === testCategory.id;
      console.log(`  ${cat.id}: "${cat.label}" (${cat.color}) ${isChanged ? '← 변경됨' : ''}`);
    });

    // 5. 원래 상태로 복구
    console.log(`\n🔄 원래 상태로 복구: "${testLabel}" → "${originalLabel}"`);
    
    await CategoryService.updateCategory(testCategory.id, {
      label: originalLabel,
      color: testCategory.color,
      bgColor: testCategory.bgColor,
      borderColor: testCategory.borderColor,
    });

    console.log('✅ 복구 완료');

    // 6. 복구 확인
    console.log('\n🔍 복구 후 전체 카테고리 목록:');
    const restoredCategories = await CategoryService.getCategories();
    
    restoredCategories.forEach(cat => {
      const isRestored = cat.id === testCategory.id;
      console.log(`  ${cat.id}: "${cat.label}" (${cat.color}) ${isRestored ? '← 복구됨' : ''}`);
    });

    console.log('\n🎉 카테고리 수정 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  }
}

// 스크립트 실행
testCategoryUpdate();