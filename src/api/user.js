import request from '@/utils/request.js'

// 管理员登录
export const userLoginService = (loginData) => {
  return request.post('/admin/auth/login', loginData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 管理员注册
export const userRegisterService = (registerData) => {
  return request.post('/admin/auth/register', registerData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取当前管理员信息
export const getUserInfoService = () => {
  return request.get('/admin/auth/info')
}

// 修改密码
export const updatePasswordService = (data) => {
  return request.put('/admin/auth/updatePwd', data)
}

// ========== 用户管理相关接口 ==========

// 分页查询用户
export const getUserListService = (params) => {
  return request.get('/admin/user', { params })
}

// 更改用户状态
export const updateUserStatusService = (id, data) => {
  return request.put(`/admin/user/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 删除用户
export const deleteUserService = (id) => {
  return request.delete(`/admin/user/${id}`)
}

