import './Login.css'
import { authApi } from './api.js'

export function initLogin(container) {
  if (!container) return

  container.innerHTML = `
    <div class="login-wrap">
      <div class="login-card">
        <div class="tabs">
          <button class="tab active" data-mode="login">登录</button>
          <button class="tab" data-mode="register">注册</button>
        </div>

        <form id="authForm">
          <h1 class="login-title">登录</h1>

          <div class="fields login-fields">
            <div class="field">
              <label for="username">用户名或邮箱</label>
              <input type="text" id="username" placeholder="请输入用户名或邮箱" autocomplete="username" />
            </div>
            <div class="field">
              <label for="password">密码</label>
              <input type="password" id="password" placeholder="请输入密码" autocomplete="current-password" />
            </div>
          </div>

          <div class="fields register-fields hidden">
            <div class="field">
              <label for="reg_username">用户名</label>
              <input type="text" id="reg_username" placeholder="请输入用户名" autocomplete="username" />
            </div>
            <div class="field">
              <label for="reg_password">密码</label>
              <input type="password" id="reg_password" placeholder="设置密码（至少8位，包含大小写字母和数字）" autocomplete="new-password" />
            </div>
            <div class="field">
              <label for="reg_realname">真实姓名</label>
              <input type="text" id="reg_realname" placeholder="请输入真实姓名" />
            </div>
            <div class="field">
              <label for="reg_phone">手机号码</label>
              <input type="tel" id="reg_phone" placeholder="请输入手机号码" autocomplete="tel" />
            </div>
          </div>

          <div class="actions">
            <label class="remember"><input type="checkbox" id="remember" /> 记住我</label>
            <button type="submit" class="btn">登录</button>
          </div>
          <p id="error" class="error"></p>
        </form>
      </div>
    </div>
  `

  const tabs = container.querySelectorAll('.tab')
  const loginFields = container.querySelector('.login-fields')
  const registerFields = container.querySelector('.register-fields')
  const titleEl = container.querySelector('.login-title')
  const submitBtn = container.querySelector('button[type="submit"]')
  const form = container.querySelector('#authForm')
  const errorEl = container.querySelector('#error')
  const rememberCheckbox = container.querySelector('#remember')

  let mode = 'login'

  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'))
    t.classList.add('active')
    mode = t.dataset.mode
    if (mode === 'login') {
      loginFields.classList.remove('hidden')
      registerFields.classList.add('hidden')
      titleEl.textContent = '登录'
      submitBtn.textContent = '登录'
      errorEl.textContent = ''
    } else {
      loginFields.classList.add('hidden')
      registerFields.classList.remove('hidden')
      titleEl.textContent = '注册'
      submitBtn.textContent = '注册'
      errorEl.textContent = ''
    }
  }))

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // 添加手机号验证函数
  function validPhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  // 添加密码强度验证函数
  function validatePassword(password) {
    // 至少8位，包含大小写字母和数字
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  // 添加保存认证信息到本地存储的函数
  function saveAuthInfo(userInfo, token, rememberMe) {
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  }

  // 添加从本地存储加载认证信息的函数
  function loadAuthInfo() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo'));
    return { token, userInfo };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorEl.textContent = ''

    if (mode === 'login') {
      const username = form.querySelector('#username').value.trim()
      const password = form.querySelector('#password').value
      const rememberMe = rememberCheckbox.checked
      
      if (!username || !password) {
        errorEl.textContent = '请填写用户名和密码。'
        return
      }

      // 添加简单的输入验证
      if (username.length < 3) {
        errorEl.textContent = '用户名至少需要3个字符。'
        return
      }

      submitBtn.disabled = true
      submitBtn.textContent = '登录中...'
      
      try {
        // 调用真实API进行登录
        const result = await authApi.login({ username, password });
        
        // 保存认证信息
        saveAuthInfo(result.user, result.token, rememberMe);
        
        // 登录成功处理
        container.innerHTML = `<div class="login-success"><h2>登录成功</h2><p>欢迎，${result.user.username}！</p></div>`
        
        // 触发登录成功事件，让其他组件知道用户已登录
        window.dispatchEvent(new CustomEvent('user-login', { detail: result.user }));
      } catch (err) {
        errorEl.textContent = err.message || '登录失败，请稍后重试';
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = '登录'
      }
      return
    }

    // 注册流程
    const rUser = form.querySelector('#reg_username').value.trim()
    const rPass = form.querySelector('#reg_password').value
    const rRealName = form.querySelector('#reg_realname').value.trim()
    const rPhone = form.querySelector('#reg_phone').value.trim()

    if (!rUser || !rPass || !rRealName || !rPhone) {
      errorEl.textContent = '请完整填写注册信息。'
      return
    }
    
    if (rUser.length < 3) {
      errorEl.textContent = '用户名至少需要3个字符。'
      return
    }
    
    if (!validPhone(rPhone)) {
      errorEl.textContent = '请输入有效的手机号码。'
      return
    }
    
    // 使用更强的密码验证
    if (!validatePassword(rPass)) {
      errorEl.textContent = '密码至少8位，需包含大小写字母和数字。'
      return
    }

    submitBtn.disabled = true
    submitBtn.textContent = '注册中...'
    
    try {
      // 调用真实API进行注册
      const result = await authApi.register({
        username: rUser,
        password: rPass,
        realName: rRealName,
        phone: rPhone
      });
      
      // 注册成功处理
      container.innerHTML = `<div class="login-success"><h2>注册成功</h2><p>${result.message}，请登录。</p></div>`
    } catch (err) {
      errorEl.textContent = err.message || '注册失败，请稍后重试';
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = '注册'
    }
  })
  
  // 页面加载时检查是否有保存的认证信息
  const { token, userInfo } = loadAuthInfo();
  if (token && userInfo) {
    // 如果已有认证信息，直接显示登录成功页面并触发登录事件
    container.innerHTML = `<div class="login-success"><h2>登录成功</h2><p>欢迎，${userInfo.username}！</p></div>`
    window.dispatchEvent(new CustomEvent('user-login', { detail: userInfo }));
  }
}