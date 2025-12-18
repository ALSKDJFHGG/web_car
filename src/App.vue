<template>
  <div>
    <LoginView v-if="!isAuth" @login="handleLogin" />
    <AdminPanel v-else @logout="handleLogout" />
  </div>
</template>

<script>
import { ref } from 'vue'
import LoginView from './components/LoginView.vue'
import AdminPanel from './components/AdminPanel.vue'

export default {
  components: { LoginView, AdminPanel },
  setup() {
    const isAuth = ref(false)
    function handleLogin(payload) {
      isAuth.value = true
    }
    function handleLogout() {
      // 清理登录态（前端模拟）
      isAuth.value = false
      alert('已登出')
    }
    return { isAuth, handleLogin, handleLogout }
  }
}
</script>

<style>
/* Global helper classes from original template */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.page-container { /* display: none; */ }
.active-page { display: block; }
.sidebar-item:hover { background-color: #f0f0f0; }
.sidebar-item.active { background-color: #1890FF; color: white; }
.data-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.table-row:hover { background-color: #f9f9f9; }
</style>
