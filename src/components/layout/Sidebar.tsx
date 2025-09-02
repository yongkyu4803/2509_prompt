'use client';

import { useState } from 'react';
import { BookOpen, Plus, Star, Menu, X, Settings, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { RoleDisplay } from '@/components/ui/ReadOnlyBadge';
import Link from 'next/link';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  totalPrompts: number;
  onCategoryManagementOpen?: () => void;
}

const menuItems = [
  { id: 'all', label: '모든 프롬프트', icon: BookOpen },
  { id: 'favorites', label: '즐겨찾기', icon: Star },
  { id: 'add', label: '프롬프트 추가', icon: Plus },
];

export default function Sidebar({ activeMenu, onMenuChange, totalPrompts, onCategoryManagementOpen }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const handleMenuClick = (menuId: string) => {
    onMenuChange(menuId);
    setIsMobileOpen(false); // 모바일에서 메뉴 선택 후 사이드바 닫기
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col gap-3 p-6 border-b border-gray-200">
            <Link href="/library" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">프롬프트 라이브러리</h1>
              </div>
            </Link>
            
            {/* Role Display - 데스크톱에서만 표시 */}
            <div className="hidden lg:block">
              <RoleDisplay showDescription />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;

                // 프롬프트 추가는 관리자만 가능
                if (item.id === 'add') {
                  return (
                    <li key={item.id}>
                      <PermissionGuard permission="canCreate">
                        <button
                          onClick={() => handleMenuClick(item.id)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                            isActive
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          <Icon size={18} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      </PermissionGuard>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                        isActive
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* 관리자 전용 설정 */}
            <PermissionGuard permission="canCreate">
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">관리</h3>
                <button
                  onClick={() => {
                    console.log('카테고리 관리 버튼 클릭됨');
                    onCategoryManagementOpen?.();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={18} />
                  <span className="font-medium">카테고리 관리</span>
                </button>
              </div>
            </PermissionGuard>
          </nav>

          {/* Contact Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">문의하기</h4>
                  <p className="text-xs text-gray-500">궁금한 점이 있으신가요?</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a 
                  href="mailto:gq.newslens@gmail.com"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  gq.newslens@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              총 {totalPrompts}개의 프롬프트를 찾았습니다
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}