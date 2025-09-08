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
  // SIDEBAR_DISABLED: 사이드바 임시 비활성화
  return null;
}