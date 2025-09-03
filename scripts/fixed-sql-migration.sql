-- 🔧 수정된 Supabase 카테고리 마이그레이션 SQL
-- Supabase Console > SQL Editor에서 실행

-- ============================================
-- 1단계: 제약조건 제거 (이미 했으면 스�ip)
-- ============================================
ALTER TABLE prompts DROP CONSTRAINT IF EXISTS prompts_category_check;

-- ============================================
-- 2단계: UUID 컬럼 생성 (이미 했으면 스킵)
-- ============================================
-- ALTER TABLE prompts ADD COLUMN category_new UUID;

-- ============================================
-- 3단계: 레거시 → UUID 매핑 (수정된 버전)
-- ============================================

-- 방법 1: 직접 캐스팅
UPDATE prompts SET category_new = 
  CASE 
    WHEN category = 'development' THEN '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2'::UUID
    WHEN category = 'marketing' THEN '437e1cff-0ec1-4d9f-b37f-7a96d8d2a0ae'::UUID
    WHEN category = 'analysis' THEN '960b5ae8-210e-4106-a5a6-e1aba0da0b23'::UUID
    WHEN category = 'creative' THEN '4bd095c7-261d-40f8-aca2-1b450adf0d37'::UUID
    WHEN category = 'business' THEN 'd891db58-09c8-495e-ad9e-453f1d7b4713'::UUID
    ELSE '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2'::UUID
  END;

-- ============================================
-- 4단계: 매핑 결과 확인
-- ============================================
SELECT 
  category as old_category,
  category_new as new_uuid,
  COUNT(*) as count
FROM prompts 
GROUP BY category, category_new
ORDER BY category;

-- ============================================
-- 5단계: 컬럼 교체 (확인 후 실행)
-- ============================================
-- 기존 컬럼 삭제
ALTER TABLE prompts DROP COLUMN category;

-- 새 컬럼을 category로 이름 변경
ALTER TABLE prompts RENAME COLUMN category_new TO category;

-- NOT NULL 제약조건 추가
ALTER TABLE prompts ALTER COLUMN category SET NOT NULL;

-- ============================================
-- 6단계: Foreign Key 생성
-- ============================================
ALTER TABLE prompts 
ADD CONSTRAINT fk_prompts_category 
FOREIGN KEY (category) REFERENCES categories(id);

-- ============================================
-- 7단계: 최종 검증
-- ============================================

-- 타입 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'prompts' AND column_name = 'category';

-- 카테고리별 개수 확인
SELECT c.label, COUNT(p.id) as prompt_count
FROM categories c
LEFT JOIN prompts p ON c.id = p.category
GROUP BY c.id, c.label
ORDER BY c.label;

-- 제약조건 확인
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'prompts' AND constraint_name LIKE '%category%';