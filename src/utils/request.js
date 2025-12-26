// 导入axios
import axios from 'axios';
import { ElMessage } from 'element-plus'

// 定义一个变量,记录公共的前缀
const baseURL = '/api/v1';
const instance = axios.create({ baseURL })

// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 请求前的回调
        // 添加token
        
        // 注意：这里不能直接调用 useTokenStore()，因为它依赖于 Vue 应用上下文
        // 只能在组件或 setup 函数中使用
        // 从 localStorage 获取 token
        // 根据JWT文档，token需要以 "Bearer {token}" 格式放在 Authorization header 中
        const token = localStorage.getItem('token');
        if (token) {
            // 确保token不包含Bearer前缀（如果包含则移除）
            const cleanToken = token.replace(/^Bearer\s+/i, '');
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (err) => {
        // 请求错误的回调
        console.error('请求拦截器错误:', err);
        return Promise.reject(err);
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    result => {
        // 根据JWT文档，token在响应体的data中，格式为：
        // { "code": 200, "message": "success", "data": { "token": "...", "userInfo": {...} } }
        // 不需要从响应头获取token，直接返回响应数据即可
        
        // 判断业务状态码
        if (result.data.code === 0 || result.data.code === 200) {
            return result.data;
        }

        // 操作失败
        const errorMsg = result.data.msg || result.data.message || '服务异常';
        ElMessage.error(errorMsg);
        
        // 异步操作的状态转换为失败
        return Promise.reject(result.data);
    },
    err => {
        console.error('响应拦截器错误:', err);
        
        // 修复：安全地访问 err.response
        if (err.response) {
            // 判断响应状态码
            if (err.response.status === 401) {
                ElMessage.error('请先登录');
                // 清除本地token
                localStorage.removeItem('token');
                // 跳转到登录页
                window.location.href = '/login'; // 使用 window.location 而不是 router
            } else {
                const errorMsg = err.response.data?.msg || 
                                err.response.data?.message || 
                                `服务异常 (${err.response.status})`;
                ElMessage.error(errorMsg);
            }
        } else {
            // 没有 response，可能是网络错误或请求被取消
            if (err.message && err.message.includes('timeout')) {
                ElMessage.error('请求超时，请检查网络连接');
            } else if (err.message && err.message.includes('Network Error')) {
                ElMessage.error('网络错误，请检查网络连接');
            } else {
                ElMessage.error('请求失败，请稍后重试');
            }
        }
       
        return Promise.reject(err);
    }
)

export default instance;