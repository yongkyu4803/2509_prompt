-- 프롬프트 테이블의 카테고리 체크 제약 조건 수정
-- 기존의 문자열 기반 카테고리 제약을 제거하여 UUID 카테고리 ID를 허용

-- 1. 기존 체크 제약 조건 제거
ALTER TABLE prompts DROP CONSTRAINT IF EXISTS prompts_category_check;

-- 2. 카테고리 컬럼이 categories 테이블의 ID를 참조하도록 외래 키 제약 조건 추가
-- (이미 categories 테이블이 있다고 가정)
ALTER TABLE prompts 
ADD CONSTRAINT fk_prompts_category 
FOREIGN KEY (category) REFERENCES categories(id) ON DELETE SET NULL;

-- 3. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);

-- 4. 확인용 쿼리 (선택사항)
-- SELECT conname, contype, confrelid::regclass as referenced_table
-- FROM pg_constraint 
-- WHERE conrelid = 'prompts'::regclass;