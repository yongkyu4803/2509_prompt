'use client';

import { useState, useEffect } from 'react';
import { UserRole, UserPermissions, getUserRole, getUserPermissions, hasPermission, ROLE_DISPLAY } from '@/lib/auth';

export function usePermissions() {
  const [role, setRole] = useState<UserRole>('viewer');
  const [permissions, setPermissions] = useState<UserPermissions>({
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canToggleFavorite: false,
    canViewAll: true,
  });

  useEffect(() => {
    const currentRole = getUserRole();
    const currentPermissions = getUserPermissions();
    
    console.log('usePermissions useEffect - currentRole:', currentRole);
    console.log('usePermissions useEffect - currentPermissions:', currentPermissions);
    
    setRole(currentRole);
    setPermissions(currentPermissions);
  }, []);

  return {
    role,
    permissions,
    hasPermission: (permission: keyof UserPermissions) => permissions[permission],
    roleDisplay: ROLE_DISPLAY[role],
    isAdmin: role === 'admin',
    isViewer: role === 'viewer',
  };
}