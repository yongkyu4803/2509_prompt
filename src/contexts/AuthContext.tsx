'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserPermissions, login as authLogin, logout as authLogout, getUserRole, getUserPermissions, isLoggedIn, isAdmin, getLoginSession } from '@/lib/auth';

interface AuthContextType {
  // 상태
  role: UserRole;
  permissions: UserPermissions;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  
  // 함수
  login: (password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('viewer');
  const [permissions, setPermissions] = useState<UserPermissions>({
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canToggleFavorite: false,
    canViewAll: true,
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 인증 상태 새로고침
  const refreshAuth = () => {
    const currentRole = getUserRole();
    const currentPermissions = getUserPermissions();
    const currentLoggedIn = isLoggedIn();
    const currentAdmin = isAdmin();

    console.log('🔄 AuthContext refreshAuth:', {
      currentRole,
      currentPermissions,
      currentLoggedIn,
      currentAdmin
    });

    setRole(currentRole);
    setPermissions(currentPermissions);
    setLoggedIn(currentLoggedIn);
    setAdmin(currentAdmin);
  };

  // 로그인 함수
  const login = async (password: string) => {
    console.log('🔐 [AuthContext] 로그인 시도 시작');
    const result = await authLogin(password);
    
    if (result.success) {
      console.log('✅ [AuthContext] 로그인 성공, 즉시 권한 새로고침');
      refreshAuth();
      
      // 강제 리렌더링을 위한 상태 즉시 업데이트
      const newRole = getUserRole();
      const newPermissions = getUserPermissions();
      const newIsLoggedIn = isLoggedIn();
      const newIsAdmin = isAdmin();
      
      console.log('🔄 [AuthContext] 즉시 상태 업데이트:', {
        newRole,
        newPermissions,
        newIsLoggedIn,
        newIsAdmin
      });
      
      setRole(newRole);
      setPermissions(newPermissions);
      setLoggedIn(newIsLoggedIn);
      setAdmin(newIsAdmin);
    } else {
      console.log('❌ [AuthContext] 로그인 실패:', result.message);
    }
    
    return result;
  };

  // 로그아웃 함수
  const logout = () => {
    authLogout();
    refreshAuth();
  };

  // 초기 로드 및 세션 체크
  useEffect(() => {
    refreshAuth();
    setLoading(false);

    // 세션 만료 체크를 위한 주기적 검사 (1분마다)
    const intervalId = setInterval(() => {
      const session = getLoginSession();
      console.log('🔍 [AuthContext] 세션 체크:', { session, currentLoggedIn: loggedIn });
      if (!session && loggedIn) {
        // 세션이 만료된 경우 상태 업데이트
        console.log('⏰ [AuthContext] 세션 만료 감지, 상태 업데이트');
        refreshAuth();
      }
    }, 1 * 60 * 1000); // 1분

    return () => clearInterval(intervalId);
  }, [loggedIn]);

  const contextValue: AuthContextType = {
    role,
    permissions,
    isLoggedIn: loggedIn,
    isAdmin: admin,
    loading,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}