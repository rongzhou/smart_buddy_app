import AsyncStorage from '@react-native-async-storage/async-storage';

// API 基础 URL
const API_BASE_URL = 'https://api.example.com'; // 替换为实际的 API 地址

// 获取认证令牌
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('获取令牌失败', error);
    return null;
  }
};

// 构建请求选项
const createRequestOptions = async (method: string, body?: any, requiresAuth: boolean = true) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (requiresAuth) {
    const token = await getToken();
    if (token) {
      (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  return options;
};

// 处理 API 响应
const handleResponse = async (response: Response) => {
  const text = await response.text();
  let data;
  try {
    data = text && JSON.parse(text);
  } catch (error) {
    console.error('解析响应数据失败', error);
    data = text;
  }

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

// API 封装
const api = {
  // 用户认证
  auth: {
    // 用户注册
    register: async (userData: any) => {
      const options = await createRequestOptions('POST', userData, false);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, options);
      return handleResponse(response);
    },

    // 用户登录
    login: async (credentials: { username: string; password: string }) => {
      const options = await createRequestOptions('POST', credentials, false);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, options);
      return handleResponse(response);
    },

    // 获取用户资料
    getUserProfile: async () => {
      const options = await createRequestOptions('GET');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, options);
      return handleResponse(response);
    },

    // 更新用户资料
    updateUserProfile: async (userData: any) => {
      const options = await createRequestOptions('PUT', userData);
      const response = await fetch(`${API_BASE_URL}/api/user/update`, options);
      return handleResponse(response);
    },
  },

  // 图像处理
  image: {
    // 上传图像
    upload: async (formData: FormData) => {
      const token = await getToken();
      const options: RequestInit = {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      };
      const response = await fetch(`${API_BASE_URL}/api/image/upload`, options);
      return handleResponse(response);
    },

    // 获取 OCR 结果
    getResult: async (taskId: string) => {
      const options = await createRequestOptions('GET');
      const response = await fetch(`${API_BASE_URL}/api/image/result/${taskId}`, options);
      return handleResponse(response);
    },
  },

  // 题目解析
  question: {
    // 分析题目
    analyze: async (ocrResult: any) => {
      const options = await createRequestOptions('POST', ocrResult);
      const response = await fetch(`${API_BASE_URL}/api/question/analyze`, options);
      return handleResponse(response);
    },

    // 获取解析结果
    getResult: async (taskId: string) => {
      const options = await createRequestOptions('GET');
      const response = await fetch(`${API_BASE_URL}/api/question/result/${taskId}`, options);
      return handleResponse(response);
    },
  },

  // 学习内容
  learning: {
    // 获取推荐题目
    getRecommendations: async (questionId: string) => {
      const options = await createRequestOptions('GET');
      const response = await fetch(`${API_BASE_URL}/api/learning/recommend/${questionId}`, options);
      return handleResponse(response);
    },

    // 提交用户答案
    submitAnswer: async (data: any) => {
      const options = await createRequestOptions('POST', data);
      const response = await fetch(`${API_BASE_URL}/api/learning/submit`, options);
      return handleResponse(response);
    },
  },

  // 数据分析
  analytics: {
    // 获取学习报告
    getReport: async (userId: string) => {
      const options = await createRequestOptions('GET');
      const response = await fetch(`${API_BASE_URL}/api/analytics/report/${userId}`, options);
      return handleResponse(response);
    },
  },

  // 反馈
  feedback: {
    // 提交反馈
    submit: async (feedbackData: any) => {
      const options = await createRequestOptions('POST', feedbackData);
      const response = await fetch(`${API_BASE_URL}/api/feedback/submit`, options);
      return handleResponse(response);
    },
  },
};

export default api;
