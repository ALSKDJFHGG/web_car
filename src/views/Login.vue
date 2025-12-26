<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">{{ isLogin ? '管理员登录' : '管理员注册' }}</h2>
      
      <!-- 登录表单 -->
      <el-form
        v-if="isLogin"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="submitLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            @keyup.enter="submitLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="submitLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-else
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="login-form"
        @submit.prevent="submitRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名（至少2位）"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="realname">
          <el-input
            v-model="registerForm.realname"
            placeholder="请输入真实姓名"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            size="large"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            size="large"
            show-password
            @keyup.enter="submitRegister"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="submitRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="toggle-form">
        <span v-if="isLogin">还没有账号？</span>
        <span v-else>已有账号？</span>
        <el-link type="primary" @click="toggleForm">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Phone, UserFilled } from '@element-plus/icons-vue'
import { userLoginService, userRegisterService } from '@/api/user.js'

const router = useRouter()
const loginFormRef = ref(null)
const registerFormRef = ref(null)
const isLogin = ref(true)
const loading = ref(false)

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  realname: ''
})

// 登录表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, message: '用户名长度不能少于2位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

// 注册表单验证规则
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, message: '用户名长度不能少于2位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  realname: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ]
})

// 切换表单
const toggleForm = () => {
  isLogin.value = !isLogin.value
  if (loginFormRef.value) loginFormRef.value.clearValidate()
  if (registerFormRef.value) registerFormRef.value.clearValidate()
}

// 登录
const submitLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await userLoginService({
          username: loginForm.username,
          password: loginForm.password
        })
        if (res.code === 0 || res.code === 200) {
          console.log('登录成功，返回数据:', res)
          
          // 根据JWT文档，响应格式为：
          // { "code": 200, "message": "success", "data": { "token": "...", "userInfo": {...} } }
          const token = res.data?.token
          const userInfo = res.data?.userInfo || res.data
          
          // 保存token（必须保存，用于后续请求的Authorization header）
          if (token) {
            localStorage.setItem('token', token)
            console.log('Token已保存:', token.substring(0, 20) + '...')
          } else {
            ElMessage.error('登录失败：未获取到token')
            return
          }
          
          // 保存用户信息
          if (userInfo) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
          }
          
          ElMessage.success('登录成功')
          
          // 直接跳转，路由守卫会根据localStorage中的token判断
          router.push('/dashboard').catch(err => {
            console.error('路由跳转失败:', err)
            // 如果路由跳转失败，使用window.location强制跳转
            window.location.href = '/dashboard'
          })
        }
      } catch (error) {
        console.error('登录失败:', error)
        // 错误信息已在拦截器中处理
      } finally {
        loading.value = false
      }
    }
  })
}

// 注册
const submitRegister = async () => {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const registerData = {
          username: registerForm.username,
          phone: registerForm.phone,
          password: registerForm.password,
          realname: registerForm.realname
        }
        console.log('注册请求数据:', registerData)
        const res = await userRegisterService(registerData)
        if (res.code === 0 || res.code === 200) {
          ElMessage.success('注册成功，请登录')
          // 清空注册表单
          Object.assign(registerForm, {
            username: '',
            phone: '',
            password: '',
            confirmPassword: '',
            realname: ''
          })
          // 切换到登录表单
          isLogin.value = true
          // 清空登录表单
          Object.assign(loginForm, {
            username: '',
            password: ''
          })
          // 清除表单验证状态
          if (registerFormRef.value) {
            registerFormRef.value.clearValidate()
          }
          if (loginFormRef.value) {
            loginFormRef.value.clearValidate()
          }
        }
      } catch (error) {
        console.error('注册失败:', error)
        // 错误信息已在拦截器中处理
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
  font-size: 24px;
  font-weight: 500;
}

.login-form {
  margin-top: 20px;
}

.toggle-form {
  text-align: center;
  margin-top: 20px;
  color: #606266;
}

.toggle-form .el-link {
  margin-left: 5px;
}
</style>

