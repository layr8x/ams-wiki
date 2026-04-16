// src/store/authStore.jsx — 사용자 인증 및 권한 관리
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  ADMIN: 'admin',       // 관리자 (모든 기능 접근)
  MANAGER: 'manager',   // 실장 (편집, 발행 권한)
  OPERATOR: 'operator', // 운영자 (조회만 가능)
  GUEST: 'guest',       // 비로그인
};

export const PERMISSIONS = {
  VIEW: 'view',         // 조회
  EDIT: 'edit',         // 편집
  PUBLISH: 'publish',   // 발행
  DELETE: 'delete',     // 삭제
  MANAGE_USERS: 'manage_users',
};

// 역할별 권한 매핑
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.PUBLISH, PERMISSIONS.DELETE, PERMISSIONS.MANAGE_USERS],
  [ROLES.MANAGER]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.PUBLISH],
  [ROLES.OPERATOR]: [PERMISSIONS.VIEW],
  [ROLES.GUEST]: [PERMISSIONS.VIEW],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 사용자 로드 (localStorage 또는 API)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // 로그인
  const login = (email, password) => {
    // 실제로는 API 호출
    // 이 예제에서는 간단한 로그인 시뮬레이션
    const mockUser = {
      id: 'user123',
      email,
      name: email.split('@')[0],
      role: ROLES.OPERATOR, // 기본 역할
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      loginTime: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 권한 확인
  const hasPermission = (permission) => {
    if (!user) return ROLE_PERMISSIONS[ROLES.GUEST].includes(permission);
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  };

  // 역할 확인
  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서만 사용해야 합니다.');
  }
  return context;
}
