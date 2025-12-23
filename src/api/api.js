// 导入axios库
import axios from 'axios';

export class AuthAPI {
  constructor(baseURL = 'http://192.168.43.212/api/v1') {
    this.baseURL = baseURL;
    // 创建axios实例
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // 请求拦截器
    this.apiClient.interceptors.request.use(
      (config) => {
        // 添加认证token到请求头
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.apiClient.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        // 处理特定的HTTP错误
        if (error.response) {
          // 服务器响应了错误状态码
          const { status, data } = error.response;
          console.error(`API请求错误 [${status}]:`, data);
          
          // 如果是认证失败，清除本地token
          if (status === 401) {
            this.logout();
          }
        } else if (error.request) {
          // 请求已发出但没有收到响应
          console.error('网络请求错误:', error.request);
        } else {
          // 其他错误
          console.error('请求配置错误:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // 用户登录
  async login(credentials) {
    try {
      const response = await this.apiClient.post('/admin/auth/login', credentials);
      
      // 存储token到localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      return response;
    } catch (error) {
      console.error('登录请求失败:', error);
      throw error;
    }
  }

  // 用户注册
  async register(userData) {
    try {
      const response = await this.apiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('注册请求失败:', error);
      throw error;
    }
  }

  // 检查用户认证状态
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const response = await this.apiClient.get('/auth/me');
      return response;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }

  // 退出登录
  logout() {
    localStorage.removeItem('token');
  }

  // 验证邮箱格式
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 验证密码强度
  validatePassword(password) {
    return password.length >= 6;
  }
}

// 创建API实例
export const authAPI = new AuthAPI();

export class QuestionAPI {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    // 使用已创建的axios实例（避免重复创建）
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // 继承认证拦截器逻辑（与AuthAPI一致）
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.apiClient.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          console.error(`API请求错误 [${status}]:`, data);
          if (status === 401) {
            authAPI.logout();
          }
        } else if (error.request) {
          console.error('网络请求错误:', error.request);
        } else {
          console.error('请求配置错误:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // 分页查询题目列表
  async getQuestionList(page = 1, limit = 10, filters = {}) {
    try {
      const params = { page, limit, ...filters };
      const response = await this.apiClient.get('/admin/questions', { params });
      return response;
    } catch (error) {
      console.error('获取题目列表失败:', error);
      throw error;
    }
  }

  // 创建题目
  async createQuestion(questionData) {
    try {
      const response = await this.apiClient.post('/admin/questions', questionData);
      return response;
    } catch (error) {
      console.error('创建题目失败:', error);
      throw error;
    }
  }

  // 获取题目详情
  async getQuestionDetail(id) {
    try {
      const response = await this.apiClient.get(`/admin/questions/${id}`);
      return response;
    } catch (error) {
      console.error('获取题目详情失败:', error);
      throw error;
    }
  }

  // 更新题目
  async updateQuestion(id, questionData) {
    try {
      const response = await this.apiClient.put(`/admin/questions/${id}`, questionData);
      return response;
    } catch (error) {
      console.error('更新题目失败:', error);
      throw error;
    }
  }

  // 删除单个题目
  async deleteQuestion(id) {
    try {
      const response = await this.apiClient.delete(`/admin/questions/${id}`);
      return response;
    } catch (error) {
      console.error('删除题目失败:', error);
      throw error;
    }
  }

  // 批量删除题目
  async batchDeleteQuestions(ids) {
    try {
      const response = await this.apiClient.patch('/admin/questions/batch', { ids });
      return response;
    } catch (error) {
      console.error('批量删除题目失败:', error);
      throw error;
    }
  }

  // 获取题目统计信息
  async getQuestionStatistics() {
    try {
      const response = await this.apiClient.get('/admin/questions/statistics');
      return response;
    } catch (error) {
      console.error('获取题目统计信息失败:', error);
      throw error;
    }
  }

  // 获取题型列表
  async getQuestionTypes() {
    try {
      const response = await this.apiClient.get('/admin/question-types');
      return response;
    } catch (error) {
      console.error('获取题型列表失败:', error);
      throw error;
    }
  }

  // 获取科目枚举
  async getSubjects() {
    try {
      const response = await this.apiClient.get('/admin/subjects');
      return response;
    } catch (error) {
      console.error('获取科目枚举失败:', error);
      throw error;
    }
  }
}

// 创建题目管理API实例
export const questionAPI = new QuestionAPI();
