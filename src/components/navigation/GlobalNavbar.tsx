'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Sparkles, GraduationCap, LogIn, LogOut, Crown, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';

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
  const { isAdmin, isLoggedIn, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // 현재 활성 탭 결정
  const getActiveTab = () => {
    if (pathname.startsWith('/study')) return 'study';
    if (pathname.startsWith('/library')) return 'library';
    // 루트 경로는 라이브러리로 간주
    return 'library';
  };

  const activeTab = getActiveTab();

  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 브랜드 로고 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GQ-AI prompt</h1>
            </div>
          </div>

          {/* 네비게이션 탭과 권한 표시 */}
          <div className="flex items-center gap-4">
            {/* 권한 상태 표시 */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                isAdmin 
                  ? "bg-purple-100 text-purple-700 border border-purple-200" 
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              )}>
                {isAdmin ? <Crown size={14} /> : <Eye size={14} />}
                <span>{isAdmin ? '관리자' : '읽기전용'}</span>
              </div>
              
              <button
                onClick={handleAuthAction}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isLoggedIn
                    ? "text-red-600 hover:bg-red-50"
                    : "text-purple-600 hover:bg-purple-50"
                )}
              >
                {isLoggedIn ? (
                  <>
                    <LogOut size={16} />
                    <span className="hidden sm:inline">로그아웃</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span className="hidden sm:inline">관리자</span>
                  </>
                )}
              </button>
            </div>

            {/* 네비게이션 탭 */}
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

      </div>

      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
}