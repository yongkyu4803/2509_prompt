import { supabase } from '../src/lib/supabase';

async function migrateUserId() {
  console.log('🔄 User ID 마이그레이션 시작...\n');

  const SOURCE_USER_ID = 'server-user';
  const TARGET_USER_ID = 'user-y2r2japwz';

  try {
    // 1. 마이그레이션 전 현황 확인
    console.log('📊 마이그레이션 전 현황 확인...');
    const { data: beforeData, error: beforeError } = await supabase
      .from('prompts')
      .select('user_id, title')
      .in('user_id', [SOURCE_USER_ID, TARGET_USER_ID]);

    if (beforeError) {
      console.error('❌ 현황 조회 실패:', beforeError);
      return;
    }

    const sourcePrompts = beforeData?.filter(p => p.user_id === SOURCE_USER_ID) || [];
    const targetPrompts = beforeData?.filter(p => p.user_id === TARGET_USER_ID) || [];

    console.log(`   📝 ${SOURCE_USER_ID}: ${sourcePrompts.length}개 프롬프트`);
    console.log(`   📝 ${TARGET_USER_ID}: ${targetPrompts.length}개 프롬프트`);

    if (sourcePrompts.length === 0) {
      console.log('✅ 마이그레이션할 데이터가 없습니다.');
      return;
    }

    // 2. 마이그레이션 실행
    console.log(`\n🚀 ${sourcePrompts.length}개 프롬프트의 user_id를 변경 중...`);
    const { data: updateData, error: updateError } = await supabase
      .from('prompts')
      .update({ user_id: TARGET_USER_ID })
      .eq('user_id', SOURCE_USER_ID)
      .select('id, title');

    if (updateError) {
      console.error('❌ 마이그레이션 실패:', updateError);
      return;
    }

    console.log(`✅ ${updateData?.length || 0}개 프롬프트 마이그레이션 완료!`);

    // 3. 마이그레이션 후 검증
    console.log('\n🔍 마이그레이션 후 검증...');
    const { data: afterData, error: afterError } = await supabase
      .from('prompts')
      .select('user_id, title')
      .in('user_id', [SOURCE_USER_ID, TARGET_USER_ID]);

    if (afterError) {
      console.error('❌ 검증 조회 실패:', afterError);
      return;
    }

    const remainingSource = afterData?.filter(p => p.user_id === SOURCE_USER_ID) || [];
    const finalTarget = afterData?.filter(p => p.user_id === TARGET_USER_ID) || [];

    console.log(`   📝 ${SOURCE_USER_ID}: ${remainingSource.length}개 프롬프트 (남은 것)`);
    console.log(`   📝 ${TARGET_USER_ID}: ${finalTarget.length}개 프롬프트 (통합 후)`);

    if (remainingSource.length === 0) {
      console.log('\n🎉 마이그레이션이 성공적으로 완료되었습니다!');
      console.log(`   이제 웹 클라이언트에서 총 ${finalTarget.length}개의 프롬프트를 볼 수 있습니다.`);
    } else {
      console.log(`\n⚠️  ${remainingSource.length}개의 프롬프트가 아직 마이그레이션되지 않았습니다.`);
    }

    // 4. 변경된 프롬프트 목록 표시
    if (updateData && updateData.length > 0) {
      console.log('\n📋 마이그레이션된 프롬프트 목록:');
      updateData.forEach((prompt, index) => {
        console.log(`   ${index + 1}. ${prompt.title} (ID: ${prompt.id})`);
      });
    }

  } catch (error) {
    console.error('❌ 마이그레이션 중 오류 발생:', error);
  }
}

// 스크립트 실행
migrateUserId();