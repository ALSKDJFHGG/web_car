<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">用户管理</h1>
      <p class="text-gray-600">管理系统注册学员和教师账号</p>
    </div>

    <div class="flex justify-between mb-4">
      <div class="flex space-x-2">
        <input v-model="query" type="text" placeholder="搜索用户..." class="px-4 py-2 border border-gray-300 rounded-lg w-64" />
        <select v-model="filterRole" class="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="">所有角色</option>
          <option value="学员">学员</option>
          <option value="教师">教师</option>
          <option value="管理员">管理员</option>
        </select>
        <button @click="search" class="bg-blue-600 text-white px-4 py-2 rounded-lg">搜索</button>
      </div>

      <div class="space-x-2">
        <button @click="openAdd" class="bg-blue-600 text-white px-4 py-2 rounded-lg">新增用户</button>
        <button @click="exportCsv" class="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg">导出数据</button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">用户ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">姓名</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">手机号</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">角色</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">注册时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in pagedUsers" :key="user.id" class="table-row">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{user.id}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{user.name}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{user.phone}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{user.role}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{user.createdAt}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button @click="edit(user)" class="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                <button @click="toggleDisable(user)" :class="user.disabled ? 'text-green-600' : 'text-red-600'">{{ user.disabled ? '启用' : '禁用' }}</button>
                <button @click="remove(user)" class="text-red-600 hover:text-red-800 ml-3">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <p class="text-sm text-gray-600">显示 {{start+1}}-{{end}} 条，共 {{filtered.length}} 条记录</p>
      <div class="flex space-x-2">
        <button @click="prevPage" class="px-3 py-1 border border-gray-300 rounded-md">上一页</button>
        <button v-for="p in pages" :key="p" @click="goPage(p)" :class="p===page ? 'px-3 py-1 bg-blue-600 text-white rounded-md' : 'px-3 py-1 border border-gray-300 rounded-md'">{{p}}</button>
        <button @click="nextPage" class="px-3 py-1 border border-gray-300 rounded-md">下一页</button>
      </div>
    </div>

    <!-- modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-semibold">{{ editMode ? '编辑用户' : '新增用户' }}</h3>
          <button @click="closeModal">×</button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">姓名</label>
            <input v-model="form.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">手机号</label>
            <input v-model="form.phone" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">角色</label>
            <select v-model="form.role" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option>学员</option>
              <option>教师</option>
              <option>管理员</option>
            </select>
          </div>
          <div class="flex justify-end mt-6 space-x-3">
            <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="save" class="px-4 py-2 bg-blue-600 text-white rounded-lg">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      users: [
        { id: '100234', name: '张明', phone: '138****5678', role: '学员', createdAt: '2025-11-25', disabled: false },
        { id: '100235', name: '李思', phone: '152****9012', role: '学员', createdAt: '2025-11-28', disabled: false },
        { id: 'T1003', name: '王教练', phone: '139****3456', role: '教师', createdAt: '2025-12-05', disabled: false }
      ],
      query: '',
      filterRole: '',
      page: 1,
      perPage: 10,
      showModal: false,
      editMode: false,
      form: { id: null, name: '', phone: '', role: '学员' }
    }
  },
  computed: {
    filtered() {
      return this.users.filter(u => {
        const matchQ = !this.query || u.name.includes(this.query) || u.id.includes(this.query) || u.phone.includes(this.query)
        const matchRole = !this.filterRole || u.role === this.filterRole
        return matchQ && matchRole
      })
    },
    pages() {
      return Array.from({ length: Math.max(1, Math.ceil(this.filtered.length / this.perPage)) }, (_, i) => i + 1)
    },
    start() { return (this.page - 1) * this.perPage },
    end() { return Math.min(this.start + this.perPage, this.filtered.length) },
    pagedUsers() { return this.filtered.slice(this.start, this.start + this.perPage) }
  },
  methods: {
    search() { this.page = 1 },
    prevPage() { if (this.page > 1) this.page-- },
    nextPage() { if (this.page < this.pages.length) this.page++ },
    goPage(p) { this.page = p },
    openAdd() { this.editMode = false; this.form = { id: Date.now().toString().slice(-6), name: '', phone: '', role: '学员' }; this.showModal = true },
    edit(user) { this.editMode = true; this.form = Object.assign({}, user); this.showModal = true },
    closeModal() { this.showModal = false },
    save() {
      if (!this.form.name) return alert('请输入姓名')
      if (this.editMode) {
        const idx = this.users.findIndex(u => u.id === this.form.id)
        if (idx !== -1) this.users.splice(idx, 1, Object.assign({}, this.form))
      } else {
        this.users.unshift(Object.assign({ createdAt: new Date().toISOString().slice(0,10), disabled:false }, this.form))
      }
      this.closeModal()
    },
    remove(user) {
      if (!confirm(`确认删除用户 ${user.name} (${user.id})？此操作不可恢复。`)) return
      this.users = this.users.filter(u => u.id !== user.id)
      // adjust current page if necessary
      if (this.page > Math.max(1, Math.ceil(this.filtered.length / this.perPage))) {
        this.page = Math.max(1, Math.ceil(this.filtered.length / this.perPage))
      }
    },
    toggleDisable(user) { user.disabled = !user.disabled },
    exportCsv() {
      const csv = this.users.map(u => [u.id,u.name,u.phone,u.role,u.createdAt].join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click(); URL.revokeObjectURL(url)
    }
  }
}
</script>
