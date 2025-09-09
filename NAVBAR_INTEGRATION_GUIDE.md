# 내비게이션 바 통합 가이드

GQ-AI Prompt Library의 내비게이션 바를 다른 사이트에 동일하게 적용하기 위한 작업 지시서입니다.

## 📋 사전 요구사항

### 1. 기술 스택
- **Next.js** (App Router 방식)
- **React 18+**
- **TypeScript**
- **Tailwind CSS**

### 2. 필수 패키지 설치
```bash
npm install lucide-react clsx tailwind-merge
```

### 3. 필수 의존성
- `next/link`
- `next/navigation` (usePathname)

## 🗂️ 파일 구조

```
src/
├── components/
│   └── navigation/
│       └── GlobalNavbar.tsx      # 메인 내비게이션 컴포넌트
├── lib/
│   └── utils.ts                  # 유틸리티 함수 (cn 함수)
└── app/
    └── layout.tsx               # 내비게이션 적용
```

## 📁 1단계: 유틸리티 함수 생성

### `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 📁 2단계: 내비게이션 컴포넌트 생성

### `src/components/navigation/GlobalNavbar.tsx`
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Sparkles, GraduationCap, ExternalLink, Mail } from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

const tabs: NavTab[] = [
  {
    id: 'library',
    label: '프롬프트 라이브러리',
    href: '/library',
    icon: BookOpen
  },
  {
    id: 'study',
    label: '프롬프트 스터디',
    href: '/study',
    icon: GraduationCap
  }
];

export default function GlobalNavbar() {
  const pathname = usePathname();
  
  // 현재 활성 탭 결정
  const getActiveTab = () => {
    if (pathname.startsWith('/study')) return 'study';
    if (pathname.startsWith('/library')) return 'library';
    // 루트 경로는 라이브러리로 간주
    return 'library';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 브랜드 로고 */}
          <Link href="https://prompt-parkyongkyus-projects.vercel.app/library" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GQ-AI prompt</h1>
            </div>
          </Link>

          {/* 네비게이션 탭 */}
          <div className="flex items-center gap-4">
            {/* 데스크톱 네비게이션 탭 */}
            <div className="hidden sm:flex bg-gray-100 rounded-lg p-1 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200',
                      'text-sm font-medium whitespace-nowrap',
                      isActive
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* 모바일 네비게이션 탭 */}
            <div className="flex sm:hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={cn(
                      'flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors',
                      'text-xs font-medium',
                      isActive
                        ? 'text-purple-700'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <Icon size={16} />
                    <span>{tab.label.split(' ')[1]}</span>
                  </Link>
                );
              })}
            </div>

            {/* 문의하기 링크 */}
            <a
              href="mailto:gq.newslens@gmail.com"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
            >
              <Mail size={16} />
              <span className="hidden sm:inline">문의하기</span>
            </a>

            {/* AI Learning Platform 링크 */}
            <a
              href="https://gq-ai.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">AI Learning platform</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

## 📁 3단계: 레이아웃에 내비게이션 적용

### `src/app/layout.tsx`
```typescript
import GlobalNavbar from '@/components/navigation/GlobalNavbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <GlobalNavbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
```

## 🎨 4단계: Tailwind CSS 설정

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## ⚙️ 5단계: 커스터마이징 가이드

### 브랜드 정보 변경
```typescript
// GlobalNavbar.tsx의 48-55줄
<Link href="YOUR_MAIN_SITE_URL" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
    <Sparkles className="text-white" size={18} />
  </div>
  <div>
    <h1 className="text-lg font-bold text-gray-900">YOUR_BRAND_NAME</h1>
  </div>
</Link>
```

### 탭 메뉴 수정
```typescript
// GlobalNavbar.tsx의 15-28줄
const tabs: NavTab[] = [
  {
    id: 'your-page-id',
    label: '메뉴명',
    href: '/your-route',
    icon: YourIcon
  },
  // 추가 탭들...
];
```

### 외부 링크 수정
```typescript
// 문의하기 이메일 변경 (111-118줄)
<a href="mailto:your-email@domain.com">

// 외부 플랫폼 링크 변경 (119-129줄)  
<a href="https://your-platform.com">
```

### 활성 탭 로직 수정
```typescript
// GlobalNavbar.tsx의 34-39줄
const getActiveTab = () => {
  if (pathname.startsWith('/your-route1')) return 'your-id1';
  if (pathname.startsWith('/your-route2')) return 'your-id2';
  return 'default-id';
};
```

## 🎯 6단계: 스타일 커스터마이징

### 색상 테마 변경
```typescript
// 보라색 테마를 다른 색으로 변경
'bg-purple-600' → 'bg-blue-600'
'text-purple-700' → 'text-blue-700'
'hover:bg-purple-50' → 'hover:bg-blue-50'
```

### 레이아웃 조정
```typescript
// 내비게이션 높이 변경
'h-16' → 'h-20'

// 최대 너비 변경  
'max-w-7xl' → 'max-w-6xl'

// 패딩 조정
'px-4 sm:px-6 lg:px-8' → 'px-6 sm:px-8 lg:px-12'
```

## ✅ 체크리스트

### 설치 확인
- [ ] Next.js 프로젝트 생성
- [ ] 필수 패키지 설치 (`lucide-react`, `clsx`, `tailwind-merge`)
- [ ] Tailwind CSS 설정

### 파일 생성
- [ ] `src/lib/utils.ts` 생성
- [ ] `src/components/navigation/GlobalNavbar.tsx` 생성
- [ ] 레이아웃에 내비게이션 추가

### 커스터마이징
- [ ] 브랜드명 및 로고 URL 수정
- [ ] 탭 메뉴 라우트 설정
- [ ] 외부 링크 URL 수정
- [ ] 활성 탭 로직 조정

### 테스트
- [ ] 데스크톱 화면에서 정상 동작
- [ ] 모바일 화면에서 반응형 확인
- [ ] 라우팅 및 활성 상태 확인
- [ ] 외부 링크 동작 확인

## 🔧 문제 해결

### 자주 발생하는 오류

1. **"cn is not a function" 오류**
   - `src/lib/utils.ts` 파일이 없거나 잘못 구성됨
   - `clsx`, `tailwind-merge` 패키지 미설치

2. **"usePathname is not a function" 오류**
   - Next.js App Router를 사용하지 않거나 버전 13 미만
   - `'use client'` 지시문 누락

3. **스타일이 적용되지 않음**
   - Tailwind CSS 설정 문제
   - CSS 파일 import 누락

4. **아이콘이 표시되지 않음**
   - `lucide-react` 패키지 미설치
   - 아이콘 import 누락

## 📞 지원

문제가 발생하거나 추가 커스터마이징이 필요한 경우:
- 이메일: gq.newslens@gmail.com
- 참고 사이트: https://prompt-parkyongkyus-projects.vercel.app/

---

**작성일**: 2024년 9월 9일  
**버전**: 1.0  
**대상**: Next.js + TypeScript + Tailwind CSS 프로젝트