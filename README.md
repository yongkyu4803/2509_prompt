# 국정감사 프롬프트 라이브러리

국정감사를 위한 AI 프롬프트 모음 및 학습 가이드 제공 웹 애플리케이션입니다.

## 기능

### 📚 프롬프트 라이브러리
- 국정감사 관련 프롬프트 모음
- 카테고리별 분류 (보도자료, 이슈분석, 질의서작성, 데이터분석 등)
- 즐겨찾기 및 검색 기능
- 프롬프트 복사 및 활용

### 📖 프롬프트 스터디
- 마크다운 기반 학습 가이드
- 챕터별 구성된 프롬프트 활용법
- 실무 적용 사례 및 팁

### 🔐 권한 관리
- **Admin 모드**: 프롬프트 추가/수정/삭제 가능 (개발용)
- **Viewer 모드**: 읽기 전용 (프로덕션 베타)

## 개발 환경 설정

### 1. 저장소 클론
```bash
git clone https://github.com/yongkyu4803/2509_prompt.git
cd prompt-library
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일 생성:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rxwztfdnragffxbmlscf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 개발 환경: admin 모드 (모든 기능 사용 가능)
NEXT_PUBLIC_USER_ROLE=admin
```

### 4. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 확인

## Vercel 배포 설정

### 환경 변수 설정
Vercel Dashboard → Settings → Environment Variables에서 다음 변수 설정:

```
NEXT_PUBLIC_SUPABASE_URL=https://rxwztfdnragffxbmlscf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3p0ZmRucmFnZmZ4Ym1sc2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzU2MDgsImV4cCI6MjA1ODA1MTYwOH0.KN8cR6_xHHHfuF1odUi9WwzkbOHCmwuRaK0FYe7b0Ig

# 베타 테스트: viewer 모드 (읽기 전용)
NEXT_PUBLIC_USER_ROLE=viewer
```

### 권한 모드 설명
- **Admin**: 프롬프트 추가/수정/삭제, 카테고리 관리 가능
- **Viewer**: 프롬프트 조회 및 복사만 가능 (베타 테스트용)

## 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel
- **Icons**: Lucide React

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
│   ├── category/          # 카테고리 관리
│   ├── prompt/            # 프롬프트 관련
│   └── ui/                # UI 컴포넌트
├── contexts/              # React Context
├── hooks/                 # Custom Hooks
├── lib/                   # 유틸리티 및 설정
└── types/                 # TypeScript 타입 정의
```

## 라이선스

MIT License