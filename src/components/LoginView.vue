<template>
  <div id="login-page" class="page-container active-page flex items-center justify-center min-h-screen">
    <div class="bg-gradient-to-br from-blue-50 to-gray-100 w-full max-w-md p-8 rounded-2xl shadow-xl">
      <div class="text-center mb-8">
        <iconify-icon icon="mdi:steering" class="text-5xl text-blue-600 mx-auto"></iconify-icon>
        <h1 class="text-2xl font-bold text-gray-800 mt-4">驾照考试管理系统</h1>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-md">
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">用户名</label>
          <input v-model="username" type="text" id="username" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition">
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-2">密码</label>
          <input v-model="password" type="password" id="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition">
        </div>

        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <input v-model="remember" type="checkbox" id="remember" class="w-4 h-4 text-blue-600 rounded">
            <label for="remember" class="ml-2 text-gray-600">记住密码</label>
          </div>
          <a href="#" class="text-blue-600 hover:underline">忘记密码?</a>
        </div>

        <button @click="onLogin" id="login-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300">
          登录系统
        </button>
      </div>

      <div class="mt-6 text-center text-gray-500 text-sm">
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
      username: '',
      password: '',
      remember: false
    }
  },
  methods: {
    onLogin() {
      if (this.username === 'admin' && this.password === '123456') {
        this.$emit('login', { username: this.username })
      } else {
        alert('用户名或密码错误，请使用 admin/123456 登录')
      }
    }
  }
}
</script>
