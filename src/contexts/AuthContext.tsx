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

    setRole(currentRole);
    setPermissions(currentPermissions);
    setLoggedIn(currentLoggedIn);
    setAdmin(currentAdmin);
  };

  // 로그인 함수
  const login = async (password: string) => {
    const result = await authLogin(password);
    
    if (result.success) {
      refreshAuth();
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

    // 세션 만료 체크를 위한 주기적 검사 (5분마다)
    const intervalId = setInterval(() => {
      const session = getLoginSession();
      if (!session && loggedIn) {
        // 세션이 만료된 경우 상태 업데이트
        refreshAuth();
      }
    }, 5 * 60 * 1000); // 5분

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