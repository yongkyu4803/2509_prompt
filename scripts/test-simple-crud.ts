import { SimpleCategoryService } from '../src/lib/category-service-simple';
import { SimplePromptService } from '../src/lib/database-simple';

async function testSimpleCRUD() {
  console.log('🧪 간단한 CRUD 시스템 테스트 시작...\n');

  try {
    // 1. 카테고리 조회
    console.log('📊 카테고리 조회 테스트:');
    const categories = await SimpleCategoryService.getCategories();
    console.log(`총 ${categories.length}개 카테고리:`);
    categories.forEach(cat => {
      console.log(`  - ${cat.id}: "${cat.label}" (${cat.color})`);
    });

    if (categories.length === 0) {
      console.log('❌ 카테고리가 없습니다. 마이그레이션을 먼저 실행하세요.');
      return;
    }

    // 2. 프롬프트 조회 (카테고리 정보 포함)
    console.log('\n📋 프롬프트 조회 테스트 (JOIN):');
    const prompts = await SimplePromptService.getPrompts();
    console.log(`총 ${prompts.length}개 프롬프트:`);
    
    prompts.slice(0, 3).forEach(prompt => {
      console.log(`  - ${prompt.id}: "${prompt.title}"`);
      console.log(`    카테고리 UUID: ${prompt.category}`);
      console.log(`    카테고리 정보: ${prompt.categoryInfo?.label || '없음'} (${prompt.categoryInfo?.color || 'N/A'})`);
    });

    if (prompts.length === 0) {
      console.log('❌ 프롬프트가 없습니다.');
      return;
    }

    // 3. 카테고리 수정 테스트
    console.log('\n✏️ 카테고리 수정 테스트:');
    const testCategory = categories[0];
    const originalLabel = testCategory.label;
    const testLabel = `${originalLabel} (테스트)`;

    console.log(`  수정 전: "${originalLabel}"`);
    const updatedCategory = await SimpleCategoryService.updateCategory(testCategory.id, {
      label: testLabel,
      color: 'text-orange-700',
    });
    console.log(`  수정 후: "${updatedCategory.label}" (${updatedCategory.color})`);

    // 4. 수정 확인 (JOIN으로 프롬프트 다시 조회)
    console.log('\n🔍 수정 반영 확인:');
    const refreshedPrompts = await SimplePromptService.getPrompts();
    const affectedPrompts = refreshedPrompts.filter(p => p.category === testCategory.id);
    
    console.log(`  해당 카테고리를 사용하는 프롬프트 ${affectedPrompts.length}개:`);
    affectedPrompts.slice(0, 2).forEach(prompt => {
      console.log(`    - ${prompt.title}: ${prompt.categoryInfo?.label}`);
    });

    // 5. 프롬프트 수정 테스트
    console.log('\n✏️ 프롬프트 수정 테스트:');
    const testPrompt = prompts[0];
    const newCategoryId = categories[1]?.id || categories[0].id;
    
    console.log(`  프롬프트: "${testPrompt.title}"`);
    console.log(`  카테고리 변경: ${testPrompt.category} → ${newCategoryId}`);
    
    const updatedPrompt = await SimplePromptService.updatePrompt(testPrompt.id, {
      category: newCategoryId,
      title: `${testPrompt.title} (수정됨)`,
    });
    
    console.log(`  수정 결과: "${updatedPrompt.title}"`);
    console.log(`  카테고리: ${updatedPrompt.categoryInfo?.label}`);

    // 6. 원상 복구
    console.log('\n🔄 원상 복구:');
    
    // 카테고리 복구
    await SimpleCategoryService.updateCategory(testCategory.id, {
      label: originalLabel,
      color: testCategory.color,
    });
    console.log(`  카테고리 복구: "${testLabel}" → "${originalLabel}"`);
    
    // 프롬프트 복구
    await SimplePromptService.updatePrompt(testPrompt.id, {
      category: testPrompt.category,
      title: testPrompt.title,
    });
    console.log(`  프롬프트 복구 완료`);

    console.log('\n🎉 모든 테스트 통과!');
    console.log('\n✨ 장점:');
    console.log('  - 매핑 로직 완전 제거');
    console.log('  - JOIN으로 카테고리 정보 자동 조회');
    console.log('  - UUID 직접 사용으로 성능 향상');
    console.log('  - 코드 복잡도 대폭 감소');

  } catch (error) {
    console.error('💥 테스트 중 오류:', error);
  }
}

// 실행
if (require.main === module) {
  testSimpleCRUD();
}