'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap } from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

const tabs: NavTab[] = [
  {
    id: 'library',
    label: '프롬프트 라이브러리',
    href: '/library',
    icon: BookOpen,
    description: '나만의 프롬프트 모음'
  },
  {
    id: 'study',
    label: '프롬프트 스터디',
    href: '/study',
    icon: GraduationCap,
    description: '학습 가이드 및 실무 팁'
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI 프롬프트 워크스페이스</h1>
            </div>
          </div>

          {/* 네비게이션 탭 */}
          <div className="flex items-center">
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

            {/* 모바일 탭 */}
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
          </div>
        </div>

        {/* 활성 탭 설명 (데스크톱만) */}
        <div className="hidden sm:block pb-3">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <p key={tab.id} className="text-sm text-gray-600">
                {tab.description}
              </p>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}