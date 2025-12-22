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
              <a href="#" @click.prevent="openForgot" class="text-blue-600 hover:underline">忘记密码?</a>
            </div>
            <button type="submit" id="login-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300">登录系统</button>
          </div>

          <div v-else class="space-y-3">
            <div>
              <label class="block text-gray-700 mb-2">用户名</label>
              <input v-model="regName" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-gray-700 mb-2">密码</label>
              <input v-model="regPassword" type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-gray-700 mb-2">真实姓名</label>
              <input v-model="regRealName" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-gray-700 mb-2">手机号码</label>
              <input v-model="regPhone" type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">注册并登录</button>
          </div>
        </form>
      </div>

      <div class="mt-4 text-center text-gray-500 text-sm">
        <p>技术支持 © 2025-12-16</p>
      </div>
      <!-- 忘记密码模态 -->
      <div v-if="showForgotModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div class="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <h3 class="font-semibold">找回密码</h3>
            <button @click="closeForgot" class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:bg-blue-700">×</button>
          </div>
          <div class="p-6">
            <div v-if="fpStep === 'request'">
              <p class="text-sm text-gray-600 mb-3">请输入注册时使用的邮箱或用户名，我们将发送重置验证码。</p>
              <div class="mb-3">
                <input v-model="fpIdentifier" type="text" placeholder="邮箱或用户名" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              </div>
              <p v-if="fpError" class="text-sm text-red-600 mb-3">{{ fpError }}</p>
              <div class="flex justify-end space-x-2">
                <button @click="closeForgot" class="px-4 py-2 border border-gray-300 rounded-lg">取消</button>
                <button @click="sendResetCode" class="px-4 py-2 bg-blue-600 text-white rounded-lg">发送验证码</button>
              </div>
            </div>

            <div v-else-if="fpStep === 'verify'">
              <p class="text-sm text-gray-600 mb-2">验证码已发送到您填写的邮箱/手机（测试环境验证码显示如下）。</p>
              <p class="text-sm text-gray-500 mb-3">测试验证码：<strong class="text-blue-600">{{ fpGeneratedCode }}</strong></p>
              <div class="mb-3">
                <input v-model="fpInputCode" type="text" placeholder="请输入验证码" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              </div>
              <p v-if="fpError" class="text-sm text-red-600 mb-3">{{ fpError }}</p>
              <div class="flex justify-end space-x-2">
                <button @click="sendResetCode" class="px-4 py-2 border border-gray-300 rounded-lg">重发验证码</button>
                <button @click="verifyCode" class="px-4 py-2 bg-blue-600 text-white rounded-lg">验证</button>
              </div>
            </div>

            <div v-else-if="fpStep === 'reset'">
              <p class="text-sm text-gray-600 mb-3">设置新密码：</p>
              <div class="mb-3">
                <input v-model="fpNewPwd" type="password" placeholder="新密码（至少6位）" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              </div>
              <div class="mb-3">
                <input v-model="fpConfirmPwd" type="password" placeholder="确认新密码" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              </div>
              <p v-if="fpError" class="text-sm text-red-600 mb-3">{{ fpError }}</p>
              <div class="flex justify-end space-x-2">
                <button @click="closeForgot" class="px-4 py-2 border border-gray-300 rounded-lg">取消</button>
                <button @click="resetPassword" class="px-4 py-2 bg-blue-600 text-white rounded-lg">重置并登录</button>
              </div>
            </div>
          </div>
        </div>
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
      regPassword: '',
      regRealName: '',
      regPhone: '',
      error: '',
      // 忘记密码流程
      showForgotModal: false,
      fpIdentifier: '', // 邮箱或用户名
      fpStep: 'request', // request -> verify -> reset
      fpGeneratedCode: '',
      fpInputCode: '',
      fpNewPwd: '',
      fpConfirmPwd: '',
      fpError: ''
    }
  },
  methods: {
    openForgot() {
      this.fpIdentifier = ''
      this.fpStep = 'request'
      this.fpGeneratedCode = ''
      this.fpInputCode = ''
      this.fpNewPwd = ''
      this.fpConfirmPwd = ''
      this.fpError = ''
      this.showForgotModal = true
    },
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
      // 修改验证逻辑，移除邮箱和确认密码相关验证
      if (!this.regName || !this.regRealName || !this.regPhone || !this.regPassword) {
        this.error = '请完整填写注册信息。'
        return
      }
      
      if (!this.validPhone(this.regPhone)) {
        this.error = '请输入有效的手机号码。'
        return
      }
      
      if (this.regPassword.length < 6) {
        this.error = '密码至少需要 6 位。'
        return
      }

      // 模拟注册成功并自动登录
      setTimeout(() => {
        this.$emit('login', { username: this.regName })
      }, 600)
    },
    validPhone(phone) {
      return /^1[3-9]\d{9}$/.test(phone)
    },
    // 发送重置验证码（模拟）
    sendResetCode() {
      this.fpError = ''
      if (!this.fpIdentifier) { this.fpError = '请输入邮箱或用户名'; return }
      // 简单邮箱校验可选
      // 生成 6 位验证码
      this.fpGeneratedCode = String(Math.floor(100000 + Math.random() * 900000))
      this.fpStep = 'verify'
      // 在真实环境中，此处应调用后端 API 发送邮件/短信；模拟时我们在界面显示 code
      // 记录日志（可选）
      console.info('模拟验证码已发送：', this.fpGeneratedCode)
    },
    verifyCode() {
      this.fpError = ''
      if (!this.fpInputCode) { this.fpError = '请输入验证码'; return }
      if (this.fpInputCode !== this.fpGeneratedCode) { this.fpError = '验证码错误'; return }
      this.fpStep = 'reset'
    },
    resetPassword() {
      this.fpError = ''
      if (!this.fpNewPwd || !this.fpConfirmPwd) { this.fpError = '请输入新密码并确认'; return }
      if (this.fpNewPwd.length < 6) { this.fpError = '密码至少需要 6 位'; return }
      if (this.fpNewPwd !== this.fpConfirmPwd) { this.fpError = '两次输入的密码不一致'; return }
      // 如果新密码与旧密码相同，可以提示（此处无法验证旧密码，除非与后端比对）
      // 重置成功（模拟）
      alert('密码重置成功，请使用新密码登录（测试环境会自动登录）')
      // 可选择自动登录（模拟）
      this.$emit('login', { username: this.fpIdentifier })
      this.showForgotModal = false
    },
    closeForgot() { this.showForgotModal = false }
  }
}
</script>

<!-- 忘记密码模态放在文件尾部的 template 外部会不起作用，已在上面模板中显示 -->
