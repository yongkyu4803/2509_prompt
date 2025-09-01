# Supabase 카테고리 테이블 설정

카테고리 관리 기능이 작동하려면 Supabase 데이터베이스에 categories 테이블을 생성해야 합니다.

## 1. Supabase Dashboard에서 SQL 실행

1. [Supabase Dashboard](https://rxwztfdnragffxbmlscf.supabase.co) 에 접속
2. 좌측 메뉴에서 "SQL Editor" 선택
3. "New query" 버튼 클릭
4. 아래 SQL 코드를 복사하여 붙여넣기
5. "Run" 버튼 클릭하여 실행

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  border_color TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default categories
INSERT INTO categories (label, color, bg_color, border_color, is_default) VALUES
  ('개발', 'text-purple-700', 'bg-purple-100', 'border-purple-200', TRUE),
  ('마케팅', 'text-blue-700', 'bg-blue-100', 'border-blue-200', TRUE),
  ('분석', 'text-green-700', 'bg-green-100', 'border-green-200', TRUE),
  ('창작', 'text-yellow-700', 'bg-yellow-100', 'border-yellow-200', TRUE),
  ('비즈니스', 'text-red-700', 'bg-red-100', 'border-red-200', TRUE);

-- Update prompts table to use text category instead of enum
ALTER TABLE prompts ALTER COLUMN category TYPE TEXT;

-- Create RLS policies for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow all users to read categories
CREATE POLICY "Categories are readable by all users" ON categories
  FOR SELECT USING (true);

-- Only authenticated users can modify categories (can be further restricted to admin users)
CREATE POLICY "Categories are modifiable by authenticated users" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 2. 실행 후 확인

SQL 실행이 완료되면:

1. 테이블이 생성되었는지 확인: 좌측 메뉴 "Table Editor" → "categories" 테이블 확인
2. 기본 카테고리 5개가 삽입되었는지 확인
3. prompts 테이블의 category 컬럼이 TEXT 타입으로 변경되었는지 확인

## 3. 애플리케이션 테스트

SQL 실행 후 웹 애플리케이션을 새로고침하면:

- 카테고리가 데이터베이스에서 로드됨
- 관리자 모드에서 "카테고리 관리" 메뉴가 작동함
- 카테고리 추가/수정/삭제가 데이터베이스에 저장됨
- 페이지 새로고침 후에도 변경사항이 유지됨

## 오류 발생 시

만약 일부 SQL문이 오류를 발생시키면:

1. **테이블이 이미 존재** 오류: 정상적인 경우이므로 무시
2. **컬럼이 이미 존재** 오류: 정상적인 경우이므로 무시  
3. **권한 관련 오류**: Supabase 프로젝트 소유자 권한으로 로그인했는지 확인
4. **기타 오류**: 각 SQL 문을 개별적으로 실행해보기

## 백업 방법

현재 스크립트로도 기본 카테고리를 생성할 수 있습니다:

```bash
node scripts/setup-categories.js
```

이 스크립트는 테이블이 있으면 기본 카테고리를 삽입하고, 없으면 수동 생성 안내를 제공합니다.