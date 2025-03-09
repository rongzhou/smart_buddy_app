import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { router } from 'expo-router';
import storageService from '../services/storage';
import api from '../services/api';

// 定义上下文类型
interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: any) => Promise<void>;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初始化 - 检查是否已登录
  useEffect(() => {
    // 加载保存的用户信息
    const loadUser = async () => {
      try {
        const token = await storageService.auth.getToken();
        if (token) {
          const userData = await storageService.auth.getUserInfo();
          if (userData) {
            setUser(userData);
          } else {
            // 有令牌但无用户信息，尝试从服务器获取
            try {
              const fetchedUserData = await api.auth.getUserProfile();
              setUser(fetchedUserData);
              await storageService.auth.saveUserInfo(fetchedUserData);
            } catch (error) {
              // API请求失败，清除令牌
              await storageService.auth.removeToken();
            }
          }
        }
      } catch (error) {
        console.error('加载用户信息失败', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 登录方法
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // 在实际应用中，使用API调用
      // const response = await api.auth.login({ username, password });
      // await storageService.auth.saveToken(response.token);
      // await storageService.auth.saveUserInfo(response.user);
      // setUser(response.user);

      // 模拟登录
      const mockUser = {
        id: '1',
        username,
        name: '张同学',
        role: 'student',
        grade: '高中一年级',
        favoriteSubjects: ['数学', '物理'],
      };
      const mockToken = 'mock-token-12345';
      
      await storageService.auth.saveToken(mockToken);
      await storageService.auth.saveUserInfo(mockUser);
      setUser(mockUser);
      
      router.replace('/dashboard');
    } catch (error) {
      console.error('登录失败', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册方法
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // 在实际应用中，使用API调用
      // await api.auth.register(userData);

      // 模拟注册
      console.log('用户注册', userData);
      
      // 注册成功后自动登录
      // await login(userData.username, userData.password);
    } catch (error) {
      console.error('注册失败', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出方法
  const logout = async () => {
    setIsLoading(true);
    try {
      await storageService.auth.clearUserData();
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('登出失败', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 更新用户资料
  const updateUserProfile = async (userData: any) => {
    setIsLoading(true);
    try {
      // 在实际应用中，使用API调用
      // const updatedUser = await api.auth.updateUserProfile(userData);
      
      // 模拟更新
      const updatedUser = { ...user, ...userData };
      await storageService.auth.saveUserInfo(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('更新用户资料失败', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 提供上下文值
  const contextValue = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义钩子，便于使用上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
