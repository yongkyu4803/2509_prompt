import { PromptService } from '../src/lib/database';

async function testPromptUpdate() {
  console.log('🧪 프롬프트 수정 기능 테스트 시작...\n');

  try {
    // 1. 현재 프롬프트 목록 조회
    console.log('📊 현재 프롬프트 목록 조회 중...');
    const prompts = await PromptService.getPrompts();
    
    console.log(`총 ${prompts.length}개의 프롬프트가 있습니다.`);
    
    if (prompts.length === 0) {
      console.log('❌ 프롬프트가 없습니다.');
      return;
    }

    // 처음 3개만 표시
    console.log('📝 첫 3개 프롬프트:');
    prompts.slice(0, 3).forEach((prompt, index) => {
      console.log(`  ${index + 1}. ${prompt.title}`);
      console.log(`     설명: ${prompt.description}`);
      console.log(`     카테고리: ${prompt.category}`);
      console.log(`     즐겨찾기: ${prompt.isFavorite}`);
    });

    // 2. 첫 번째 프롬프트를 테스트용으로 수정
    const testPrompt = prompts[0];
    const originalTitle = testPrompt.title;
    const originalDescription = testPrompt.description;
    const testTitle = `${originalTitle} (수정 테스트)`;
    const testDescription = `${originalDescription} (수정됨)`;

    console.log(`\n🔄 프롬프트 수정 테스트:`);
    console.log(`  제목: "${originalTitle}" → "${testTitle}"`);
    console.log(`  설명: "${originalDescription}" → "${testDescription}"`);

    // 3. 프롬프트 수정 실행
    const updatedPrompt = await PromptService.updatePrompt(testPrompt.id, {
      title: testTitle,
      description: testDescription,
      isFavorite: !testPrompt.isFavorite, // 즐겨찾기도 변경
    });

    console.log('✅ 수정 성공:', {
      id: updatedPrompt.id,
      title: updatedPrompt.title,
      description: updatedPrompt.description,
      isFavorite: updatedPrompt.isFavorite,
      category: updatedPrompt.category,
    });

    // 4. 수정된 내용 확인
    console.log('\n🔍 수정 후 해당 프롬프트 재조회:');
    const refreshedPrompts = await PromptService.getPrompts();
    const changedPrompt = refreshedPrompts.find(p => p.id === testPrompt.id);
    
    if (changedPrompt) {
      console.log('✅ 변경사항이 데이터베이스에 반영되었습니다:');
      console.log(`  제목: ${changedPrompt.title}`);
      console.log(`  설명: ${changedPrompt.description}`);
      console.log(`  즐겨찾기: ${changedPrompt.isFavorite}`);
    } else {
      console.log('❌ 프롬프트를 찾을 수 없습니다.');
    }

    // 5. 원래 상태로 복구
    console.log(`\n🔄 원래 상태로 복구 중...`);
    
    await PromptService.updatePrompt(testPrompt.id, {
      title: originalTitle,
      description: originalDescription,
      isFavorite: testPrompt.isFavorite,
    });

    console.log('✅ 복구 완료');

    // 6. 복구 확인
    console.log('\n🔍 복구 후 해당 프롬프트 재조회:');
    const finalPrompts = await PromptService.getPrompts();
    const restoredPrompt = finalPrompts.find(p => p.id === testPrompt.id);
    
    if (restoredPrompt) {
      console.log('✅ 원래 상태로 복구되었습니다:');
      console.log(`  제목: ${restoredPrompt.title}`);
      console.log(`  설명: ${restoredPrompt.description}`);
      console.log(`  즐겨찾기: ${restoredPrompt.isFavorite}`);
    } else {
      console.log('❌ 프롬프트를 찾을 수 없습니다.');
    }

    console.log('\n🎉 프롬프트 수정 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    if (error instanceof Error) {
      console.error('오류 메시지:', error.message);
      console.error('스택 트레이스:', error.stack);
    }
  }
}

// 스크립트 실행
testPromptUpdate();