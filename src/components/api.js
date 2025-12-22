// 模拟API调用函数 - 实际项目中应替换为真实HTTP请求
export const authApi = {
  // 模拟存储用户数据
  users: [
    { username: 'admin', realName: '管理员', phone: '13800138000', email: 'admin@example.com', password: 'Password123' }
  ],
  
  login: async function(credentials) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟网络错误情况 (5%概率)
    if (Math.random() < 0.05) {
      throw new Error('网络错误，请稍后重试');
    }
    
    // 查找用户 - 支持用户名、手机号或邮箱登录
    const user = this.users.find(u => 
      u.username === credentials.username || 
      u.phone === credentials.username || 
      u.email === credentials.username
    );
    
    // 验证密码
    if (user && user.password === credentials.password) {
      return {
        success: true,
        user: { 
          username: user.username,
          phone: user.phone,
          email: user.email
        },
        token: 'fake-jwt-token-' + Date.now()
      };
    } else {
      throw new Error('用户名或密码错误');
    }
  },
  
  register: async function(userData) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 900));
    
    // 模拟网络错误情况 (5%概率)
    if (Math.random() < 0.05) {
      throw new Error('网络错误，请稍后重试');
    }
    
    // 检查用户名是否已存在
    if (this.users.some(u => u.username === userData.username)) {
      throw new Error('用户名已存在');
    }
    
    // 检查手机号是否已存在
    if (this.users.some(u => u.phone === userData.phone)) {
      throw new Error('手机号已被注册');
    }
    
    // 添加新用户
    this.users.push({
      username: userData.username,
      realName: userData.realName,
      phone: userData.phone,
      password: userData.password
    });
    
    return {
      success: true,
      message: `用户 ${userData.username} 已创建`
    };
  },

  // 添加获取所有用户的方法，便于测试
  getAllUsers: function() {
    return this.users;
  },

  // 添加清空用户方法，便于测试
  clearAllUsers: function() {
    this.users = [];
  },

  // 添加重置为默认用户的方法，便于测试
  resetToDefault: function() {
    this.users = [
      { username: 'admin', realName: '管理员', phone: '13800138000', email: 'admin@example.com', password: 'Password123' }
    ];
  }
};