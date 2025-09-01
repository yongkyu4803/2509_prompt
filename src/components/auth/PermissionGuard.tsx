'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserPermissions } from '@/lib/auth';

interface PermissionGuardProps {
  permission: keyof UserPermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  disabled?: boolean;
}

// 권한 기반으로 컴포넌트를 보여주거나 숨기는 래퍼
export function PermissionGuard({ 
  permission, 
  children, 
  fallback = null,
  disabled = false 
}: PermissionGuardProps) {
  const { hasPermission, role, permissions } = usePermissions();
  
  const canAccess = hasPermission(permission);
  
  console.log(`PermissionGuard - permission: ${permission}, role: ${role}, canAccess: ${canAccess}, permissions:`, permissions);
  
  if (!canAccess) {
    return <>{fallback}</>;
  }
  
  // disabled 상태일 때 비활성화된 버전 렌더링
  if (disabled) {
    return (
      <div className="opacity-50 pointer-events-none cursor-not-allowed">
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
}

// 권한이 없을 때 보여줄 대체 컴포넌트들
export function NoPermissionMessage({ action }: { action: string }) {
  const { roleDisplay } = usePermissions();
  
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">
      <span>{roleDisplay.icon}</span>
      <span>{action} 권한이 없습니다. ({roleDisplay.label})</span>
    </div>
  );
}