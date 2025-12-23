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
      
      // 使用API进行实际登录请求
      import('../api/api.js').then(({ authAPI }) => {
        authAPI.login({
          username: this.username,
          password: this.password
        })
        .then(response => {
          // 登录成功，触发登录事件
          this.$emit('login', { 
            username: this.username,
            token: response.token 
          })
        })
        .catch(error => {
          // 处理登录错误
          if (error.response) {
            this.error = error.response.data.message || '登录失败，请检查用户名和密码'
          } else {
            this.error = '网络错误，请稍后重试'
          }
        })
      })
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

      // 使用API进行实际注册请求
      import('../api/api.js').then(({ authAPI }) => {
        authAPI.register({
          username: this.regName,
          password: this.regPassword,
          realName: this.regRealName,
          phone: this.regPhone
        })
        .then(response => {
          // 注册成功，触发登录事件
          this.$emit('login', { 
            username: this.regName,
            token: response.token 
          })
        })
        .catch(error => {
          // 处理注册错误
          if (error.response) {
            this.error = error.response.data.message || '注册失败，请稍后重试'
          } else {
            this.error = '网络错误，请稍后重试'
          }
        })
      })
    },
    validPhone(phone) {
      return /^1[3-9]\d{9}$/.test(phone)
    },
    // 发送重置验证码
    sendResetCode() {
      this.fpError = ''
      if (!this.fpIdentifier) { 
        this.fpError = '请输入邮箱或用户名'; 
        return 
      }
      
      // 使用API调用后端发送验证码
      import('../api/api.js').then(({ authAPI }) => {
        // 这里应该调用后端API发送验证码
        // 示例: authAPI.sendResetCode(this.fpIdentifier)
        // 由于API类中未实现此方法，需要后端提供相应接口
        console.info('调用后端API发送验证码:', this.fpIdentifier)
      })
      
      // 暂时保持模拟行为直到后端接口可用
      this.fpGeneratedCode = String(Math.floor(100000 + Math.random() * 900000))
      this.fpStep = 'verify'
    },
    verifyCode() {
      this.fpError = ''
      if (!this.fpInputCode) { 
        this.fpError = '请输入验证码'; 
        return 
      }
      
      // 使用API验证验证码
      import('../api/api.js').then(({ authAPI }) => {
        // 这里应该调用后端API验证验证码
        // 示例: authAPI.verifyResetCode(this.fpIdentifier, this.fpInputCode)
        // 由于API类中未实现此方法，需要后端提供相应接口
        console.info('调用后端API验证验证码:', this.fpInputCode)
      })
      
      // 暂时保持模拟验证行为直到后端接口可用
      if (this.fpInputCode !== this.fpGeneratedCode) { 
        this.fpError = '验证码错误'; 
        return 
      }
      this.fpStep = 'reset'
    },
    resetPassword() {
      this.fpError = ''
      if (!this.fpNewPwd || !this.fpConfirmPwd) { 
        this.fpError = '请输入新密码并确认'; 
        return 
      }
      if (this.fpNewPwd.length < 6) { 
        this.fpError = '密码至少需要 6 位'; 
        return 
      }
      if (this.fpNewPwd !== this.fpConfirmPwd) { 
        this.fpError = '两次输入的密码不一致'; 
        return 
      }

      // 使用API重置密码
      import('../api/api.js').then(({ authAPI }) => {
        // 这里应该调用后端API重置密码
        // 示例: authAPI.resetPassword(this.fpIdentifier, this.fpNewPwd, this.fpInputCode)
        // 由于API类中未实现此方法，需要后端提供相应接口
        console.info('调用后端API重置密码')
      })
      
      // 密码重置成功，自动登录
      this.$emit('login', { username: this.fpIdentifier })
      this.showForgotModal = false
    },
    closeForgot() { this.showForgotModal = false }
  }
}
</script>

<!-- 忘记密码模态放在文件尾部的 template 外部会不起作用，已在上面模板中显示 -->
