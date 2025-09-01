const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_CATEGORIES = [
  {
    label: '개발',
    color: 'text-purple-700',
    bg_color: 'bg-purple-100',
    border_color: 'border-purple-200',
    is_default: true,
  },
  {
    label: '마케팅',
    color: 'text-blue-700',
    bg_color: 'bg-blue-100',
    border_color: 'border-blue-200',
    is_default: true,
  },
  {
    label: '분석',
    color: 'text-green-700',
    bg_color: 'bg-green-100',
    border_color: 'border-green-200',
    is_default: true,
  },
  {
    label: '창작',
    color: 'text-yellow-700',
    bg_color: 'bg-yellow-100',
    border_color: 'border-yellow-200',
    is_default: true,
  },
  {
    label: '비즈니스',
    color: 'text-red-700',
    bg_color: 'bg-red-100',
    border_color: 'border-red-200',
    is_default: true,
  },
];

async function setupCategories() {
  try {
    console.log('카테고리 데이터 설정을 시작합니다...');
    
    // 기존 카테고리 확인
    const { data: existingCategories, error: selectError } = await supabase
      .from('categories')
      .select('*');
    
    if (selectError) {
      console.log('카테고리 테이블이 존재하지 않습니다. 테이블을 수동으로 생성해야 합니다.');
      console.log('Supabase Dashboard에서 다음 SQL을 실행하세요:');
      console.log(`
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

-- Create RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are readable by all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are modifiable by authenticated users" ON categories FOR ALL USING (auth.uid() IS NOT NULL);

-- Create trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
      return;
    }
    
    console.log(`기존 카테고리 ${existingCategories?.length || 0}개 발견`);
    
    // 기본 카테고리가 없으면 생성
    if (!existingCategories || existingCategories.length === 0) {
      console.log('기본 카테고리를 생성합니다...');
      
      for (const category of DEFAULT_CATEGORIES) {
        console.log(`카테고리 생성 중: ${category.label}`);
        const { error } = await supabase
          .from('categories')
          .insert(category);
        
        if (error) {
          console.error(`카테고리 생성 실패 (${category.label}):`, error);
        } else {
          console.log(`✓ ${category.label} 카테고리가 생성되었습니다.`);
        }
      }
    } else {
      console.log('기본 카테고리가 이미 존재합니다.');
      existingCategories.forEach(cat => {
        console.log(`- ${cat.label} (${cat.is_default ? '기본' : '사용자정의'})`);
      });
    }
    
    // 최종 확인
    const { data: finalCategories, error: finalError } = await supabase
      .from('categories')
      .select('*');
    
    if (finalError) {
      console.error('카테고리 조회 오류:', finalError);
    } else {
      console.log(`\n설정 완료! 총 ${finalCategories?.length || 0}개의 카테고리가 있습니다.`);
    }
    
  } catch (error) {
    console.error('카테고리 설정 실패:', error);
    process.exit(1);
  }
}

setupCategories();