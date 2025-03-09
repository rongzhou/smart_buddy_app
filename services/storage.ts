import AsyncStorage from '@react-native-async-storage/async-storage';

// 存储键前缀
const PREFIX = 'smartstudy_';

// 存储键定义
const STORAGE_KEYS = {
  USER_TOKEN: `${PREFIX}user_token`,
  USER_INFO: `${PREFIX}user_info`,
  QUESTION_HISTORY: `${PREFIX}question_history`,
  FAVORITES: `${PREFIX}favorites`,
  SETTINGS: `${PREFIX}settings`,
};

// 存储服务
const storageService = {
  // 用户认证相关
  auth: {
    // 保存用户令牌
    saveToken: async (token: string): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
      } catch (error) {
        console.error('保存令牌失败', error);
        throw error;
      }
    },

    // 获取用户令牌
    getToken: async (): Promise<string | null> => {
      try {
        return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      } catch (error) {
        console.error('获取令牌失败', error);
        return null;
      }
    },

    // 删除用户令牌（登出）
    removeToken: async (): Promise<void> => {
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      } catch (error) {
        console.error('删除令牌失败', error);
        throw error;
      }
    },

    // 保存用户信息
    saveUserInfo: async (userInfo: any): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
      } catch (error) {
        console.error('保存用户信息失败', error);
        throw error;
      }
    },

    // 获取用户信息
    getUserInfo: async (): Promise<any | null> => {
      try {
        const userInfoStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
        return userInfoStr ? JSON.parse(userInfoStr) : null;
      } catch (error) {
        console.error('获取用户信息失败', error);
        return null;
      }
    },

    // 清除所有用户数据（完全登出）
    clearUserData: async (): Promise<void> => {
      try {
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.USER_TOKEN,
          STORAGE_KEYS.USER_INFO,
        ]);
      } catch (error) {
        console.error('清除用户数据失败', error);
        throw error;
      }
    },
  },

  // 题目历史记录
  questionHistory: {
    // 添加历史记录
    addQuestion: async (question: any): Promise<void> => {
      try {
        const historyStr = await AsyncStorage.getItem(STORAGE_KEYS.QUESTION_HISTORY);
        const history = historyStr ? JSON.parse(historyStr) : [];
        
        // 检查是否已存在相同ID的题目
        const existingIndex = history.findIndex((q: any) => q.id === question.id);
        
        if (existingIndex !== -1) {
          // 更新已存在的题目
          history[existingIndex] = { ...question, timestamp: Date.now() };
        } else {
          // 添加新题目（最多保存50条）
          history.unshift({ ...question, timestamp: Date.now() });
          if (history.length > 50) {
            history.pop();
          }
        }
        
        await AsyncStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(history));
      } catch (error) {
        console.error('添加题目历史记录失败', error);
        throw error;
      }
    },

    // 获取历史记录
    getHistory: async (): Promise<any[]> => {
      try {
        const historyStr = await AsyncStorage.getItem(STORAGE_KEYS.QUESTION_HISTORY);
        return historyStr ? JSON.parse(historyStr) : [];
      } catch (error) {
        console.error('获取题目历史记录失败', error);
        return [];
      }
    },

    // 清除历史记录
    clearHistory: async (): Promise<void> => {
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.QUESTION_HISTORY);
      } catch (error) {
        console.error('清除题目历史记录失败', error);
        throw error;
      }
    },
  },

  // 收藏夹
  favorites: {
    // 添加收藏
    addFavorite: async (item: any): Promise<void> => {
      try {
        const favoritesStr = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
        
        // 检查是否已收藏
        if (!favorites.some((f: any) => f.id === item.id)) {
          favorites.unshift({ ...item, favoritedAt: Date.now() });
          await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        }
      } catch (error) {
        console.error('添加收藏失败', error);
        throw error;
      }
    },

    // 移除收藏
    removeFavorite: async (itemId: string): Promise<void> => {
      try {
        const favoritesStr = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (favoritesStr) {
          const favorites = JSON.parse(favoritesStr);
          const updatedFavorites = favorites.filter((f: any) => f.id !== itemId);
          await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
        }
      } catch (error) {
        console.error('移除收藏失败', error);
        throw error;
      }
    },

    // 获取所有收藏
    getFavorites: async (): Promise<any[]> => {
      try {
        const favoritesStr = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        return favoritesStr ? JSON.parse(favoritesStr) : [];
      } catch (error) {
        console.error('获取收藏失败', error);
        return [];
      }
    },

    // 检查项目是否已收藏
    isFavorite: async (itemId: string): Promise<boolean> => {
      try {
        const favoritesStr = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (!favoritesStr) return false;
        
        const favorites = JSON.parse(favoritesStr);
        return favorites.some((f: any) => f.id === itemId);
      } catch (error) {
        console.error('检查收藏状态失败', error);
        return false;
      }
    },
  },

  // 应用设置
  settings: {
    // 保存设置
    saveSettings: async (settings: any): Promise<void> => {
      try {
        const currentSettingsStr = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        const currentSettings = currentSettingsStr ? JSON.parse(currentSettingsStr) : {};
        const updatedSettings = { ...currentSettings, ...settings };
        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('保存设置失败', error);
        throw error;
      }
    },

    // 获取所有设置
    getSettings: async (): Promise<any> => {
      try {
        const settingsStr = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settingsStr ? JSON.parse(settingsStr) : {};
      } catch (error) {
        console.error('获取设置失败', error);
        return {};
      }
    },

    // 获取单个设置项
    getSetting: async (key: string, defaultValue: any = null): Promise<any> => {
      try {
        const settingsStr = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!settingsStr) return defaultValue;
        
        const settings = JSON.parse(settingsStr);
        return settings[key] !== undefined ? settings[key] : defaultValue;
      } catch (error) {
        console.error('获取设置项失败', error);
        return defaultValue;
      }
    },

    // 重置所有设置
    resetSettings: async (): Promise<void> => {
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
      } catch (error) {
        console.error('重置设置失败', error);
        throw error;
      }
    },
  },

  // 缓存清理
  cache: {
    // 计算缓存大小（近似值）
    calculateCacheSize: async (): Promise<number> => {
      try {
        let totalSize = 0;
        const keys = await AsyncStorage.getAllKeys();
        
        for (const key of keys) {
          if (key.startsWith(PREFIX)) {
            const value = await AsyncStorage.getItem(key);
            if (value) {
              totalSize += value.length;
            }
          }
        }
        
        return totalSize;
      } catch (error) {
        console.error('计算缓存大小失败', error);
        return 0;
      }
    },

    // 清除所有缓存（除了用户认证信息）
    clearCache: async (): Promise<void> => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(key => 
          key.startsWith(PREFIX) && 
          key !== STORAGE_KEYS.USER_TOKEN && 
          key !== STORAGE_KEYS.USER_INFO
        );
        
        if (cacheKeys.length > 0) {
          await AsyncStorage.multiRemove(cacheKeys);
        }
      } catch (error) {
        console.error('清除缓存失败', error);
        throw error;
      }
    },
  },
};

export default storageService;