<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">日志管理</h1>
      <p class="text-gray-600">查看登录日志与操作日志</p>
    </div>

    <div class="flex items-center space-x-2 mb-4">
      <select v-model="type" class="px-4 py-2 border border-gray-300 rounded-lg">
        <option value="all">全部</option>
        <option value="login">登录日志</option>
        <option value="op">操作日志</option>
      </select>
      <input v-model="keyword" type="text" placeholder="搜索关键字..." class="px-4 py-2 border border-gray-300 rounded-lg" />
      <button @click="search" class="px-4 py-2 bg-blue-600 text-white rounded-lg">搜索</button>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">操作人员</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">模块</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">类型</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">详情</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="log in filtered" :key="log.id" class="table-row">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{log.time}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{log.user}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{log.module}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{log.type}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{log.detail}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogManagement',
  data() {
    return {
      type: 'all',
      keyword: '',
      logs: [
        { id: 1, time: '2025-12-16 14:25:08', user: '管理员', module: '用户管理', type: '操作', detail: '新增用户 ID:100234' },
        { id: 2, time: '2025-12-16 11:42:35', user: '张老师', module: '试题管理', type: '操作', detail: '编辑试题 Q00578' },
        { id: 3, time: '2025-12-16 09:18:47', user: '管理员', module: '系统设置', type: '操作', detail: '修改考试规则' }
      ]
    }
  },
  computed: {
    filtered() {
      return this.logs.filter(l => {
        const matchType = this.type === 'all' || (this.type === 'login' ? l.type === '登录' : true)
        const matchKeyword = !this.keyword || Object.values(l).join(' ').includes(this.keyword)
        return matchType && matchKeyword
      })
    }
  },
  methods: {
    search() { /* UI-driven; filtered computed updates */ }
  }
}
</script>
