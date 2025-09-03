-- 🔧 Supabase 카테고리 시스템 마이그레이션 SQL 명령어들
-- Supabase Console > SQL Editor에서 순서대로 실행하세요

-- ============================================
-- 1단계: 기존 제약조건 제거
-- ============================================
ALTER TABLE prompts DROP CONSTRAINT IF EXISTS prompts_category_check;

-- ============================================ 
-- 2단계: 카테고리 컬럼을 UUID 타입으로 변경
-- ============================================

-- 방법 A: 직접 변환 시도 (실패할 수 있음)
-- ALTER TABLE prompts ALTER COLUMN category TYPE UUID USING category::UUID;

-- 방법 B: 안전한 방법 (권장)
-- 새 UUID 컬럼 생성
ALTER TABLE prompts ADD COLUMN category_new UUID;

-- 레거시 값을 실제 카테고리 UUID로 매핑
UPDATE prompts SET category_new = (
  CASE category
    WHEN 'development' THEN '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2'::UUID
    WHEN 'marketing' THEN '437e1cff-0ec1-4d9f-b37f-7a96d8d2a0ae'::UUID
    WHEN 'analysis' THEN '960b5ae8-210e-4106-a5a6-e1aba0da0b23'::UUID
    WHEN 'creative' THEN '4bd095c7-261d-40f8-aca2-1b450adf0d37'::UUID
    WHEN 'business' THEN 'd891db58-09c8-495e-ad9e-453f1d7b4713'::UUID
    ELSE '91a38be2-3dca-4c28-a7c7-bce2ed9d54d2'::UUID -- 기본값 (기본 프롬프트)
  END
);

-- 기존 컬럼 삭제하고 새 컬럼을 category로 rename
ALTER TABLE prompts DROP COLUMN category;
ALTER TABLE prompts RENAME COLUMN category_new TO category;

-- NOT NULL 제약조건 추가
ALTER TABLE prompts ALTER COLUMN category SET NOT NULL;

-- ============================================
-- 3단계: Foreign Key 제약조건 생성
-- ============================================
ALTER TABLE prompts 
ADD CONSTRAINT fk_prompts_category 
FOREIGN KEY (category) REFERENCES categories(id);

-- ============================================
-- 4단계: 검증
-- ============================================

-- 컬럼 타입 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'prompts' AND column_name = 'category';

-- 카테고리별 프롬프트 개수 확인
SELECT c.label, COUNT(p.id) as prompt_count
FROM categories c
LEFT JOIN prompts p ON c.id = p.category
GROUP BY c.id, c.label
ORDER BY c.label;

-- 제약조건 확인
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'prompts' AND constraint_name LIKE '%category%';

-- ============================================
-- 완료 후 확인사항:
-- ============================================
-- 1. prompts.category 타입이 UUID로 변경됨
-- 2. 모든 카테고리 값이 올바른 UUID로 매핑됨  
-- 3. Foreign Key 제약조건이 생성됨
-- 4. 웹사이트에서 프롬프트 수정이 정상 작동함