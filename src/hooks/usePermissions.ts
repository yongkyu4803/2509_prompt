'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPermissions, ROLE_DISPLAY } from '@/lib/auth';

export function usePermissions() {
  const { role, permissions } = useAuth();

  // hasPermission 함수를 메모이제이션하여 무한 리렌더링 방지
  const hasPermission = useCallback((permission: keyof UserPermissions) => {
    const result = permissions[permission];
    return result;
  }, [permissions]);

  return {
    role,
    permissions,
    hasPermission,
    roleDisplay: ROLE_DISPLAY[role],
    isAdmin: role === 'admin',
    isViewer: role === 'viewer',
  };
}