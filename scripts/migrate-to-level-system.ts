import { supabase } from '../src/lib/supabase';

/**
 * 🎯 단계별 학습 시스템으로 마이그레이션
 * 
 * 기존 프롬프트 제목을 분석하여 적절한 레벨 태그를 추가
 * 예: "국정감사 전략" → "[중급] 국정감사 전략"
 */

// 키워드 기반 레벨 분류 로직
const LEVEL_KEYWORDS = {
  beginner: ['기본', '초보', '입문', '시작', '간단', '쉬운', '기초'],
  intermediate: ['실무', '활용', '적용', '전략', '분석', '작성', '정리'], 
  advanced: ['고급', '전문', '심층', '복합', '통합', '최적화', '자동화'],
  expert: ['전문가', '마스터', '고도화', '혁신', '창의적', '독창적', '맞춤형']
};

const LEVEL_TAGS = {
  beginner: '[초급]',
  intermediate: '[중급]', 
  advanced: '[고급]',
  expert: '[심화]'
};

function detectLevel(title: string, description: string = ''): string {
  const text = (title + ' ' + description).toLowerCase();
  
  // 이미 레벨 태그가 있는지 확인
  if (/^\[[^\]]+\]/.test(title)) {
    return 'skip'; // 이미 태그가 있음
  }
  
  let scores = {
    beginner: 0,
    intermediate: 0, 
    advanced: 0,
    expert: 0
  };
  
  // 키워드 점수 계산
  Object.entries(LEVEL_KEYWORDS).forEach(([level, keywords]) => {
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scores[level as keyof typeof scores] += 1;
      }
    });
  });
  
  // 최고 점수 레벨 선택
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'intermediate'; // 기본값
  
  const bestLevel = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
  return bestLevel || 'intermediate';
}

async function migrateToLevelSystem() {
  console.log('🎯 단계별 학습 시스템 마이그레이션 시작...\n');

  try {
    // 1. 현재 모든 프롬프트 조회
    console.log('📊 현재 프롬프트 분석 중...');
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('id, title, description');

    if (error) throw error;

    console.log(`총 ${prompts?.length || 0}개의 프롬프트를 발견했습니다.\n`);

    if (!prompts || prompts.length === 0) {
      console.log('❌ 마이그레이션할 프롬프트가 없습니다.');
      return;
    }

    // 2. 각 프롬프트의 레벨 분석 및 통계
    const levelStats = {
      skip: 0,
      beginner: 0,
      intermediate: 0,
      advanced: 0, 
      expert: 0
    };

    const updates: Array<{id: string, level: string, newTitle: string}> = [];

    prompts.forEach(prompt => {
      const level = detectLevel(prompt.title, prompt.description || '');
      levelStats[level as keyof typeof levelStats]++;
      
      if (level !== 'skip') {
        const tag = LEVEL_TAGS[level as keyof typeof LEVEL_TAGS];
        updates.push({
          id: prompt.id,
          level,
          newTitle: `${tag} ${prompt.title}`
        });
      }
    });

    // 3. 통계 출력
    console.log('📊 레벨 분석 결과:');
    Object.entries(levelStats).forEach(([level, count]) => {
      const emoji = {
        skip: '⏭️',
        beginner: '🌱', 
        intermediate: '📈',
        advanced: '🚀',
        expert: '💎'
      }[level];
      
      const label = {
        skip: '이미 태그됨',
        beginner: '초급',
        intermediate: '중급', 
        advanced: '고급',
        expert: '심화'
      }[level];
      
      console.log(`  ${emoji} ${label}: ${count}개`);
    });

    console.log(`\n📝 업데이트 대상: ${updates.length}개 프롬프트\n`);

    // 4. 사용자 확인 (실제 환경에서는 주석 해제)
    // console.log('계속 진행하시겠습니까? (수동으로 확인 필요)');
    
    // 5. 배치 업데이트 실행
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      try {
        console.log(`🔄 "${update.newTitle}" 업데이트 중...`);
        
        const { error: updateError } = await supabase
          .from('prompts')
          .update({ 
            title: update.newTitle,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id);

        if (updateError) {
          console.error(`❌ ${update.id}: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`✅ ${update.id}: 업데이트 성공`);
          successCount++;
        }
      } catch (err) {
        console.error(`💥 ${update.id}: 처리 중 오류`, err);
        errorCount++;
      }
    }

    // 6. 최종 결과
    console.log('\n🎉 마이그레이션 완료!');
    console.log(`📊 결과:`);
    console.log(`  ✅ 성공: ${successCount}개`);
    console.log(`  ❌ 실패: ${errorCount}개`);
    console.log(`  ⏭️ 스킵: ${levelStats.skip}개 (이미 태그됨)`);

    // 7. 검증
    console.log('\n🔍 업데이트 검증 중...');
    const { data: updatedPrompts, error: verifyError } = await supabase
      .from('prompts')
      .select('title')
      .like('title', '[%]%')
      .limit(5);

    if (!verifyError && updatedPrompts) {
      console.log('✅ 업데이트된 프롬프트 예시:');
      updatedPrompts.forEach((prompt, index) => {
        console.log(`  ${index + 1}. ${prompt.title}`);
      });
    }

  } catch (error) {
    console.error('💥 마이그레이션 중 오류:', error);
  }
}

// 실행
if (require.main === module) {
  migrateToLevelSystem();
}