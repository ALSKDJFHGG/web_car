<template>
  <div id="admin-panel" class="page-container h-screen flex flex-col active-page">
    <!-- 顶部导航栏 -->
    <header class="bg-blue-600 h-16 flex items-center justify-between px-6 shadow-md">
      <div class="flex items-center">
        <iconify-icon icon="mdi:steering" class="text-2xl text-white"></iconify-icon>
        <span class="text-white font-semibold ml-2">驾照考试管理系统</span>
      </div>

      <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleMenu" class="flex items-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-300">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">管</div>
              <span class="text-white ml-3 font-medium">管理员</span>
              <iconify-icon icon="mdi:chevron-down" class="text-white ml-2"></iconify-icon>
            </button>

            <transition name="fade-scale">
              <div v-if="menuOpen" class="profile-dropdown absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50 ring-1 ring-black ring-opacity-5 overflow-hidden">
                <button @click="openProfile" class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2">
                  <iconify-icon icon="mdi:account-circle" class="text-lg text-gray-600"></iconify-icon>
                  <span>个人中心</span>
                </button>
                <button @click="openChangePwd" class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2">
                  <iconify-icon icon="mdi:lock-reset" class="text-lg text-gray-600"></iconify-icon>
                  <span>修改密码</span>
                </button>
                <div class="border-t"></div>
                <button @click="confirmDelete" class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-red-600">
                  <iconify-icon icon="mdi:account-remove" class="text-lg"></iconify-icon>
                  <span>注销账号</span>
                </button>
                <button @click="logout" class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2">
                  <iconify-icon icon="mdi:logout" class="text-lg text-gray-600"></iconify-icon>
                  <span>登出</span>
                </button>
              </div>
            </transition>
          </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边菜单 -->
      <aside class="w-56 bg-white h-full border-r border-gray-200 flex flex-col">
        <nav class="flex-1 py-4">
          <div :class="['sidebar-item px-6 py-3 cursor-pointer flex items-center', activePage === 'dashboard-page' ? 'active' : '']" @click="switchPage('dashboard-page')">
            <iconify-icon icon="mdi:view-dashboard" class="text-lg mr-3"></iconify-icon>
            <span>控制面板</span>
          </div>
          <div :class="['sidebar-item px-6 py-3 cursor-pointer flex items-center', activePage === 'user-page' ? 'active' : '']" @click="switchPage('user-page')">
            <iconify-icon icon="mdi:account-group" class="text-lg mr-3"></iconify-icon>
            <span>用户管理</span>
          </div>
          <div :class="['sidebar-item px-6 py-3 cursor-pointer flex items-center', activePage === 'question-page' ? 'active' : '']" @click="switchPage('question-page')">
            <iconify-icon icon="mdi:book-education" class="text-lg mr-3"></iconify-icon>
            <span>试题管理</span>
          </div>
          <div :class="['sidebar-item px-6 py-3 cursor-pointer flex items-center', activePage === 'exam-page' ? 'active' : '']" @click="switchPage('exam-page')">
            <iconify-icon icon="mdi:calendar-check" class="text-lg mr-3"></iconify-icon>
            <span>考试配置</span>
          </div>
          <div :class="['sidebar-item px-6 py-3 cursor-pointer flex items-center', activePage === 'log-page' ? 'active' : '']" @click="switchPage('log-page')">
            <iconify-icon icon="mdi:clipboard-list" class="text-lg mr-3"></iconify-icon>
            <span>日志审计</span>
          </div>
        </nav>

        <div class="p-4 border-t border-gray-200 text-center text-gray-500">
          <p class="text-sm">系统版本 2.5.1</p>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="flex-1 bg-gray-50 overflow-auto p-6 hide-scrollbar">
        <!-- 仪表盘页面 -->
          <section v-show="activePage === 'dashboard-page'" id="dashboard-page" class="page-container active-page">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800">控制面板</h1>
            <p class="text-gray-600">欢迎回来，管理员！今天是2025年12月16日</p>
          </div>

          <!-- 数据概览卡片 -->
          <div class="grid grid-cols-4 gap-6 mb-8">
            <div class="data-card bg-white rounded-xl p-5 shadow border-l-4 border-blue-500">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500">今日考试人数</p>
                  <p class="text-2xl font-bold mt-1">128</p>
                </div>
                <iconify-icon icon="mdi:account-clock" class="text-blue-500 text-3xl"></iconify-icon>
              </div>
            </div>

            <div class="data-card bg-white rounded-xl p-5 shadow border-l-4 border-green-500">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500">总用户数</p>
                  <p class="text-2xl font-bold mt-1">2,846</p>
                </div>
                <iconify-icon icon="mdi:account-group" class="text-green-500 text-3xl"></iconify-icon>
              </div>
            </div>

            <div class="data-card bg-white rounded-xl p-5 shadow border-l-4 border-purple-500">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500">题库总数</p>
                  <p class="text-2xl font-bold mt-1">1,250</p>
                </div>
                <iconify-icon icon="mdi:book-open" class="text-purple-500 text-3xl"></iconify-icon>
              </div>
            </div>

            <div class="data-card bg-white rounded-xl p-5 shadow border-l-4 border-amber-500">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-500">系统状态</p>
                  <p class="text-2xl font-bold mt-1 text-green-600">运行中</p>
                </div>
                <iconify-icon icon="mdi:server" class="text-amber-500 text-3xl"></iconify-icon>
              </div>
            </div>
          </div>

          <!-- 近期活动 表格等（略） -->
        </section>

        <!-- 管理页面占位：将使用独立组件 -->
        <section v-show="activePage === 'user-page'" id="user-page" class="page-container">
          <UserManagement />
        </section>

        <section v-show="activePage === 'question-page'" id="question-page" class="page-container">
          <QuestionManagement />
        </section>

        <section v-show="activePage === 'exam-page'" id="exam-page" class="page-container">
          <ExamConfig />
        </section>

        <section v-show="activePage === 'log-page'" id="log-page" class="page-container">
          <LogManagement />
        </section>
      </main>
    </div>

    <!-- 弹窗示例（新增用户） -->
    <div id="user-modal" class="fixed inset-0 bg-transparent flex items-center justify-center hidden" :class="{ 'hidden': !modalOpen }">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div class="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 class="font-semibold">新增用户</h3>
          <button id="close-modal" class="text-white" @click="closeModal">×</button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">姓名</label>
            <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">手机号</label>
            <input type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">角色</label>
            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option>学员</option>
              <option>教师</option>
              <option>管理员</option>
            </select>
          </div>
          <div class="flex justify-end mt-6 space-x-3">
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 个人中心模态 -->
    <transition name="scale-fade">
      <div v-if="showProfileModal" class="fixed inset-0 bg-transparent flex items-center justify-center" @click.self="showProfileModal=false">
        <div class="modal-card bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div class="modal-header p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center">
            <h3 class="font-semibold">个人中心</h3>
            <button @click="showProfileModal=false" class="text-white text-xl">×</button>
          </div>
          <div class="p-6">
            <div class="mb-4 flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">管</div>
              <div>
                <div class="font-medium">{{ user.name }}</div>
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </div>
            </div>
            <div class="divide-y">
              <div class="py-3 profile-field"><strong>用户名：</strong> {{ user.username }}</div>
              <div class="py-3 profile-field"><strong>姓名：</strong> {{ user.name }}</div>
              <div class="py-3 profile-field"><strong>邮箱：</strong> {{ user.email }}</div>
            </div>
            <div class="flex justify-end mt-6 space-x-3">
              <button @click="openChangePwd" class="btn-outline">修改密码</button>
              <button @click="showProfileModal=false" class="btn-primary">关闭</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 修改密码模态 -->
    <transition name="scale-fade">
      <div v-if="showPwdModal" class="fixed inset-0 bg-transparent flex items-center justify-center" @click.self="showPwdModal=false">
        <div class="modal-card bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div class="modal-header p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center">
            <h3 class="font-semibold">修改密码</h3>
            <button @click="showPwdModal=false" class="text-white text-xl">×</button>
          </div>
          <div class="p-6">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">旧密码</label>
              <input v-model="oldPwd" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">新密码</label>
              <input v-model="newPwd" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">确认新密码</label>
              <input v-model="confirmPwd" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
            <div class="flex justify-end mt-6 space-x-3">
              <button @click="showPwdModal=false" class="btn-outline">取消</button>
              <button @click="onSavePwd" class="btn-primary">保存</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 注销确认 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-transparent flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-semibold">确认注销账号</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-700 mb-4">注销账号将删除您的个人信息并退出系统，操作不可恢复。确定要继续吗？</p>
          <div class="flex justify-end space-x-3">
            <button @click="showDeleteConfirm=false" class="px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="doDeleteAccount" class="px-4 py-2 bg-red-600 text-white rounded-lg">确认注销</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserManagement from './UserManagement.vue'
import QuestionManagement from './QuestionManagement.vue'
import ExamConfig from './ExamConfig.vue'
import LogManagement from './LogManagement.vue'

export default {
  name: 'AdminPanel',
  components: { UserManagement, QuestionManagement, ExamConfig, LogManagement },
  data() {
    return {
      activePage: 'dashboard-page',
      modalOpen: false,
      menuOpen: false,
      showProfileModal: false,
      showPwdModal: false,
      showDeleteConfirm: false,
      user: { name: '管理员', username: 'admin', email: 'admin@example.com' },
      oldPwd: '',
      newPwd: '',
      confirmPwd: ''
    }
  },
  methods: {
    switchPage(page) {
      this.activePage = page
    },
    openModal() {
      this.modalOpen = true
    },
    closeModal() {
      this.modalOpen = false
    }
    ,toggleMenu() { this.menuOpen = !this.menuOpen },
    openProfile() { this.menuOpen = false; this.showProfileModal = true },
    openChangePwd() { this.menuOpen = false; this.showPwdModal = true },
    confirmDelete() { this.menuOpen = false; this.showDeleteConfirm = true },
    logout() { this.$emit('logout') },
    doDeleteAccount() {
      // 模拟注销：在真实场景应调用后端API
      alert('账号已注销')
      this.showDeleteConfirm = false
      this.$emit('logout')
    },
    doChangePassword(oldPwd, newPwd) {
      // 前端模拟校验（可替换为 API 调用）
      if (!oldPwd || !newPwd) return alert('请填写完整')
      this.showPwdModal = false
      alert('密码修改成功')
    },
    onSavePwd() {
      if (this.newPwd !== this.confirmPwd) {
        alert('两次密码不一致')
        return
      }
      this.doChangePassword(this.oldPwd, this.newPwd)
      this.oldPwd = this.newPwd = this.confirmPwd = ''
    }
  }
}
</script>

<style scoped>
/* small scoped styles if needed */
.sidebar-item.active { background-color: #1890FF; color: white; }

.profile-field { font-size: 0.95rem }

/* profile dropdown */
.profile-dropdown button { background: transparent; border: none; width: 100%; }

/* modal card + header */
.modal-card { border-radius: 12px; }
.modal-header { border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }

/* unified buttons */
.btn-primary { background: linear-gradient(180deg,#2563eb,#1e40af); color: white; padding: 0.5rem 1rem; border-radius: 8px; }
.btn-outline { border: 1px solid #d1d5db; color: #374151; padding: 0.5rem 1rem; border-radius: 8px; background: white }
.btn-danger { background: linear-gradient(180deg,#dc2626,#b91c1c); color: white; padding: 0.5rem 1rem; border-radius: 8px; }

/* transitions */
.fade-scale-enter-active, .fade-scale-leave-active { transition: all 180ms ease; }
.fade-scale-enter-from { opacity: 0; transform: scale(0.96); }
.fade-scale-enter-to { opacity: 1; transform: scale(1); }
.fade-scale-leave-from { opacity: 1; transform: scale(1); }
.fade-scale-leave-to { opacity: 0; transform: scale(0.96); }

.scale-fade-enter-active, .scale-fade-leave-active { transition: all 200ms cubic-bezier(.2,.8,.2,1); }
.scale-fade-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.scale-fade-enter-to { opacity: 1; transform: translateY(0) scale(1); }
.scale-fade-leave-from { opacity: 1; transform: translateY(0) scale(1); }
.scale-fade-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }

.profile-dropdown { min-width: 12rem }

</style>
