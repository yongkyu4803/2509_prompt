'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserPermissions, ROLE_DISPLAY } from '@/lib/auth';

export function usePermissions() {
  const { role, permissions } = useAuth();

  return {
    role,
    permissions,
    hasPermission: (permission: keyof UserPermissions) => permissions[permission],
    roleDisplay: ROLE_DISPLAY[role],
    isAdmin: role === 'admin',
    isViewer: role === 'viewer',
  };
}