// src/store/authStore.jsx — 사용자 인증 및 권한 관리
import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from './authConstants';

export { ROLES, PERMISSIONS } from './authConstants';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 사용자 로드 (localStorage 또는 API)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그인
  const login = (email) => {
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서만 사용해야 합니다.');
  }
  return context;
}
