export type UserRole = 'admin' | 'viewer';

export interface UserPermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canToggleFavorite: boolean;
  canViewAll: boolean;
}

// 역할별 권한 정의
const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canToggleFavorite: true,
    canViewAll: true,
  },
  viewer: {
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canToggleFavorite: false,
    canViewAll: true,
  },
};

// 현재 사용자 역할 가져오기
export function getUserRole(): UserRole {
  if (typeof window === 'undefined') return 'viewer'; // 서버사이드에서는 기본적으로 viewer
  
  const role = process.env.NEXT_PUBLIC_USER_ROLE as UserRole;
  
  // 유효하지 않은 역할이면 기본적으로 viewer
  if (!role || !['admin', 'viewer'].includes(role)) {
    return 'viewer';
  }
  
  return role;
}

// 현재 사용자 권한 가져오기
export function getUserPermissions(): UserPermissions {
  const role = getUserRole();
  return ROLE_PERMISSIONS[role];
}

// 특정 권한 확인
export function hasPermission(permission: keyof UserPermissions): boolean {
  const permissions = getUserPermissions();
  return permissions[permission];
}

// 역할 표시 정보
export const ROLE_DISPLAY: Record<UserRole, { label: string; icon: string; color: string }> = {
  admin: {
    label: '관리자 모드',
    icon: '👑',
    color: 'text-purple-600',
  },
  viewer: {
    label: '읽기 전용',
    icon: '👁️',
    color: 'text-gray-600',
  },
};

// 역할별 설명
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: '모든 프롬프트를 추가, 수정, 삭제할 수 있습니다.',
  viewer: '프롬프트를 조회하고 복사할 수 있습니다.',
};