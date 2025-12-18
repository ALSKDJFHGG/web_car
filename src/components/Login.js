import './Login.css'

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
              <label for="reg_email">邮箱</label>
              <input type="email" id="reg_email" placeholder="请输入邮箱" autocomplete="email" />
            </div>
            <div class="field">
              <label for="reg_password">密码</label>
              <input type="password" id="reg_password" placeholder="设置密码（至少6位）" />
            </div>
            <div class="field">
              <label for="reg_confirm">确认密码</label>
              <input type="password" id="reg_confirm" placeholder="再次输入密码" />
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

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    errorEl.textContent = ''

    if (mode === 'login') {
      const username = form.querySelector('#username').value.trim()
      const password = form.querySelector('#password').value
      if (!username || !password) {
        errorEl.textContent = '请填写用户名和密码。'
        return
      }

      submitBtn.disabled = true
      submitBtn.textContent = '登录中...'
      setTimeout(() => {
        submitBtn.disabled = false
        submitBtn.textContent = '登录'
        if (username === 'admin' && password === 'password') {
          container.innerHTML = `<div class="login-success"><h2>登录成功</h2><p>欢迎，${username}！</p></div>`
        } else {
          errorEl.textContent = '用户名或密码错误（试试 admin / password）。'
        }
      }, 800)
      return
    }

    // 注册流程
    const rUser = form.querySelector('#reg_username').value.trim()
    const rEmail = form.querySelector('#reg_email').value.trim()
    const rPass = form.querySelector('#reg_password').value
    const rConfirm = form.querySelector('#reg_confirm').value

    if (!rUser || !rEmail || !rPass || !rConfirm) {
      errorEl.textContent = '请完整填写注册信息。'
      return
    }
    if (!validEmail(rEmail)) {
      errorEl.textContent = '请输入有效的邮箱地址。'
      return
    }
    if (rPass.length < 6) {
      errorEl.textContent = '密码至少需要 6 位。'
      return
    }
    if (rPass !== rConfirm) {
      errorEl.textContent = '两次输入的密码不一致。'
      return
    }

    submitBtn.disabled = true
    submitBtn.textContent = '注册中...'
    setTimeout(() => {
      submitBtn.disabled = false
      submitBtn.textContent = '注册'
      container.innerHTML = `<div class="login-success"><h2>注册成功</h2><p>用户 ${rUser} 已创建，请登录。</p></div>`
    }, 900)
  })
}
