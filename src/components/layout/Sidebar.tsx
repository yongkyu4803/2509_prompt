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
  /* CATEGORY_DISABLED: onCategoryManagementOpen?: () => void; */
}

const menuItems = [
  { id: 'all', label: '모든 프롬프트', icon: BookOpen },
  { id: 'favorites', label: '즐겨찾기', icon: Star },
  { id: 'add', label: '프롬프트 추가', icon: Plus },
];

export default function Sidebar({ activeMenu, onMenuChange, totalPrompts, /* CATEGORY_DISABLED: onCategoryManagementOpen */ }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      'bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 flex flex-col',
      isCollapsed ? 'w-16' : 'w-72'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-purple-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">프롬프트 라이브러리</h1>
              <p className="text-purple-200 text-sm">{totalPrompts}개의 프롬프트</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            // 프롬프트 추가 버튼은 관리자 권한이 있을 때만 표시
            if (item.id === 'add') {
              return (
                <PermissionGuard key={item.id} permission="canCreate">
                  <button
                    onClick={() => onMenuChange(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left',
                      isActive 
                        ? 'bg-purple-600 text-white' 
                        : 'text-purple-100 hover:bg-purple-700 hover:text-white'
                    )}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </button>
                </PermissionGuard>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={() => onMenuChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left',
                  isActive 
                    ? 'bg-purple-600 text-white' 
                    : 'text-purple-100 hover:bg-purple-700 hover:text-white'
                )}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-purple-700">
        <RoleDisplay />
        
        {!isCollapsed && (
          <div className="mt-4 space-y-2">
            <Link
              href="/study"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-purple-100 hover:bg-purple-700 hover:text-white transition-colors"
            >
              <BookOpen size={18} />
              <span className="text-sm">학습 자료</span>
            </Link>
            
            <Link
              href="/how-to-use"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-purple-100 hover:bg-purple-700 hover:text-white transition-colors"
            >
              <User size={18} />
              <span className="text-sm">사용법 안내</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}