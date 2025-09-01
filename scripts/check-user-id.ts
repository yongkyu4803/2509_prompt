import { supabase } from '../src/lib/supabase';

async function checkUserIds() {
  console.log('🔍 데이터베이스의 user_id 현황 조사 중...\n');

  try {
    // 모든 프롬프트의 user_id 조회
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('user_id, title, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 데이터베이스 조회 실패:', error);
      return;
    }

    if (!prompts || prompts.length === 0) {
      console.log('📭 데이터베이스에 프롬프트가 없습니다.');
      return;
    }

    // user_id별로 그룹핑
    const userGroups: Record<string, unknown[]> = {};
    prompts.forEach(prompt => {
      if (!userGroups[prompt.user_id]) {
        userGroups[prompt.user_id] = [];
      }
      userGroups[prompt.user_id].push(prompt);
    });

    console.log(`📊 총 ${prompts.length}개의 프롬프트가 발견되었습니다.\n`);
    
    Object.keys(userGroups).forEach((userId, index) => {
      const userPrompts = userGroups[userId];
      console.log(`${index + 1}. User ID: "${userId}"`);
      console.log(`   📝 프롬프트 수: ${userPrompts.length}개`);
      console.log(`   📅 최초 생성: ${userPrompts[userPrompts.length - 1].created_at}`);
      console.log(`   📅 최근 생성: ${userPrompts[0].created_at}`);
      
      if (userPrompts.length <= 5) {
        console.log(`   📋 프롬프트 목록:`);
        userPrompts.forEach((prompt, i) => {
          console.log(`      ${i + 1}) ${prompt.title}`);
        });
      } else {
        console.log(`   📋 최근 프롬프트 3개:`);
        userPrompts.slice(0, 3).forEach((prompt, i) => {
          console.log(`      ${i + 1}) ${prompt.title}`);
        });
        console.log(`      ... 외 ${userPrompts.length - 3}개`);
      }
      console.log('');
    });

    // 권장사항 출력
    const userIds = Object.keys(userGroups);
    if (userIds.length === 1) {
      console.log('✅ 모든 프롬프트가 동일한 사용자 ID를 사용하고 있습니다.');
      console.log(`🎯 Target User ID: "${userIds[0]}"`);
    } else if (userIds.length === 2) {
      const serverUser = userGroups['server-user'];
      const webUser = userGroups[userIds.find(id => id !== 'server-user') || ''];
      
      if (serverUser && webUser) {
        console.log('⚠️  두 개의 서로 다른 user_id가 발견되었습니다:');
        console.log(`   📱 웹 클라이언트: "${userIds.find(id => id !== 'server-user')}" (${webUser.length}개)`);
        console.log(`   🖥️  스크립트: "server-user" (${serverUser.length}개)`);
        console.log('\n💡 해결 방안:');
        console.log('   스크립트로 생성된 프롬프트의 user_id를 웹 클라이언트 ID로 변경하면');
        console.log('   웹에서 모든 프롬프트를 볼 수 있습니다.');
      }
    } else {
      console.log(`⚠️  ${userIds.length}개의 서로 다른 user_id가 발견되었습니다.`);
      console.log('   데이터 정리가 필요할 수 있습니다.');
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

// 스크립트 실행
checkUserIds();