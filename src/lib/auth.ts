export type UserRole = 'admin' | 'viewer';

export interface UserPermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canToggleFavorite: boolean;
  canViewAll: boolean;
}

export interface LoginSession {
  isLoggedIn: boolean;
  role: UserRole;
  loginTime: string;
  expiresAt: string;
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

// 관리자 패스워드 (실제 운영에서는 더 안전한 방식으로 관리)
const ADMIN_PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // 'password'의 SHA-256

// 세션 만료 시간 (24시간)
const SESSION_EXPIRE_HOURS = 24;
const STORAGE_KEY = 'admin_session';

// SHA-256 해시 함수
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// 현재 로그인 세션 가져오기
export function getLoginSession(): LoginSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionData = localStorage.getItem(STORAGE_KEY);
    if (!sessionData) return null;
    
    const session: LoginSession = JSON.parse(sessionData);
    
    // 세션 만료 확인
    if (new Date() > new Date(session.expiresAt)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error reading login session:', error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// 현재 사용자 역할 가져오기 (동적 로그인 우선)
export function getUserRole(): UserRole {
  if (typeof window === 'undefined') return 'viewer'; // 서버사이드에서는 기본적으로 viewer
  
  // 1. 동적 로그인 세션 확인 (최우선)
  const session = getLoginSession();
  
  if (session && session.isLoggedIn) {
    return session.role;
  }
  
  // 2. 환경 변수 확인 (폴백)
  const envRole = process.env.NEXT_PUBLIC_USER_ROLE as UserRole;
  
  // 세션이 없고 환경 변수가 유효한 경우에만 환경 변수 사용
  if (envRole && ['admin', 'viewer'].includes(envRole)) {
    return envRole;
  }
  
  // 3. 기본값: viewer
  return 'viewer';
}

// 현재 사용자 권한 가져오기
export function getUserPermissions(): UserPermissions {
  const role = getUserRole();
  const permissions = ROLE_PERMISSIONS[role];
  return permissions;
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

// 관리자 로그인
export async function login(password: string): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined') {
    return { success: false, message: '클라이언트에서만 로그인할 수 있습니다.' };
  }
  
  try {
    const passwordHash = await sha256(password);
    
    if (passwordHash === ADMIN_PASSWORD_HASH) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + SESSION_EXPIRE_HOURS * 60 * 60 * 1000);
      
      const session: LoginSession = {
        isLoggedIn: true,
        role: 'admin',
        loginTime: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      
      return { success: true, message: '관리자 로그인에 성공했습니다.' };
    } else {
      return { success: false, message: '패스워드가 올바르지 않습니다.' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: '로그인 중 오류가 발생했습니다.' };
  }
}

// 로그아웃
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// 로그인 상태 확인
export function isLoggedIn(): boolean {
  const session = getLoginSession();
  return session?.isLoggedIn ?? false;
}

// 관리자인지 확인
export function isAdmin(): boolean {
  const role = getUserRole();
  return role === 'admin';
}