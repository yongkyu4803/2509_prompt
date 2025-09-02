'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserPermissions, ROLE_DISPLAY } from '@/lib/auth';

export function usePermissions() {
  const { role, permissions } = useAuth();

  // 디버깅: 권한 훅 호출시마다 로그
  console.log('🔐 [usePermissions] 훅 호출:', {
    role,
    permissions,
    roleDisplay: ROLE_DISPLAY[role],
    isAdmin: role === 'admin',
    isViewer: role === 'viewer',
  });

  return {
    role,
    permissions,
    hasPermission: (permission: keyof UserPermissions) => {
      const result = permissions[permission];
      console.log(`🔍 [hasPermission] ${permission} = ${result}`, { permissions });
      return result;
    },
    roleDisplay: ROLE_DISPLAY[role],
    isAdmin: role === 'admin',
    isViewer: role === 'viewer',
  };
}