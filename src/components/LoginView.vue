<template>
  <div id="login-page" class="page-container active-page w-full h-screen flex items-center justify-center" style="min-height:100vh;display:flex;align-items:center;justify-content:center;">
    <div class="bg-gradient-to-br from-blue-50 to-gray-100 w-full max-w-md p-6 rounded-2xl shadow-xl">
      <div class="text-center mb-6">
        <iconify-icon icon="mdi:steering" class="text-5xl text-blue-600 mx-auto"></iconify-icon>
        <h1 class="text-2xl font-bold text-gray-800 mt-3">驾照考试管理系统</h1>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-md">
        <div class="flex mb-4 rounded-md overflow-hidden border border-gray-100">
          <button :class="mode==='login' ? 'flex-1 py-2 bg-blue-600 text-white' : 'flex-1 py-2 text-gray-600'" @click="mode='login'">登录</button>
          <button :class="mode==='register' ? 'flex-1 py-2 bg-blue-600 text-white' : 'flex-1 py-2 text-gray-600'" @click="mode='register'">注册</button>
        </div>

        <p v-if="error" class="text-sm text-red-600 mb-3">{{ error }}</p>

        <form @submit.prevent="mode==='login' ? onLogin() : onRegister()">
          <div v-if="mode==='login'">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">用户名</label>
              <input v-model="username" type="text" id="username" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">密码</label>
              <input v-model="password" type="password" id="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition">
            </div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <input v-model="remember" type="checkbox" id="remember" class="w-4 h-4 text-blue-600 rounded">
                <label for="remember" class="ml-2 text-gray-600">记住密码</label>
              </div>
              <a href="#" class="text-blue-600 hover:underline">忘记密码?</a>
            </div>
            <button type="submit" id="login-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300">登录系统</button>
          </div>

          <div v-else class="space-y-3">
            <div>
              <label class="block text-gray-700 mb-2">用户名</label>
              <input v-model="regName" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-gray-700 mb-2">邮箱</label>
              <input v-model="regEmail" type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-gray-700 mb-2">密码</label>
              <input v-model="regPassword" type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-gray-700 mb-2">确认密码</label>
              <input v-model="regConfirm" type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>

            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">注册并登录</button>
          </div>
        </form>
      </div>

      <div class="mt-4 text-center text-gray-500 text-sm">
        <p>技术支持 © 2025-12-16</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  emits: ['login'],
  data() {
    return {
      mode: 'login',
      username: '',
      password: '',
      remember: false,
      // register
      regName: '',
      regEmail: '',
      regPassword: '',
      regConfirm: '',
      error: ''
    }
  },
  methods: {
    onLogin() {
      this.error = ''
      if (!this.username || !this.password) {
        this.error = '请填写用户名和密码。'
        return
      }
      if (this.username === 'admin' && this.password === '123456') {
        this.$emit('login', { username: this.username })
      } else {
        this.error = '用户名或密码错误，请使用 admin/123456 登录'
      }
    },
    validEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
    onRegister() {
      this.error = ''
      if (!this.regName || !this.regEmail || !this.regPassword || !this.regConfirm) {
        this.error = '请完整填写注册信息。'
        return
      }
      if (!this.validEmail(this.regEmail)) {
        this.error = '请输入有效的邮箱地址。'
        return
      }
      if (this.regPassword.length < 6) {
        this.error = '密码至少需要 6 位。'
        return
      }
      if (this.regPassword !== this.regConfirm) {
        this.error = '两次输入的密码不一致。'
        return
      }

      // 模拟注册成功并自动登录
      setTimeout(() => {
        this.$emit('login', { username: this.regName })
      }, 600)
    }
  }
}
</script>
