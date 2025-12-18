<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">试题管理</h1>
      <p class="text-gray-600">题目列表、添加/修改题目、导入题库</p>
    </div>
    <!-- 批量删除确认模态 -->
    <div v-if="showBulkDelete" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-semibold">确认批量删除</h3>
          <button @click="showBulkDelete = false">×</button>
        </div>
        <div class="p-6">
          <p class="mb-4">确认删除选中的 {{ selected.length }} 道试题？此操作不可恢复。</p>
          <div class="flex justify-end space-x-3">
            <button @click="showBulkDelete = false" class="px-4 py-2 border border-gray-300 rounded-lg">取消</button>
            <button @click="doBulkDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg">确定删除</button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between mb-4">
      <div class="flex space-x-2">
        <input v-model="query" type="text" placeholder="搜索题目..." class="px-4 py-2 border border-gray-300 rounded-lg w-64" />
        <select v-model="filterType" class="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="">所有类型</option>
          <option value="单选题">单选题</option>
          <option value="多选题">多选题</option>
          <option value="判断题">判断题</option>
        </select>
        <button @click="search" class="bg-blue-600 text-white px-4 py-2 rounded-lg">筛选</button>
      </div>

      <div class="space-x-2">
        <button @click="openAdd" class="bg-blue-600 text-white px-4 py-2 rounded-lg">新增试题</button>
        <label class="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg cursor-pointer">
          导入题库
          <input @change="importFile" type="file" accept=".csv" class="hidden" />
        </label>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3">
              <input type="checkbox" @change="toggleSelectAll($event)" :checked="allVisibleSelected" />
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">试题ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">题目内容</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">类型</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">科目</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="q in paged" :key="q.id" class="table-row">
            <td class="px-4 py-3">
              <input type="checkbox" :value="q.id" v-model="selected" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{q.id}}</td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{{q.text}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{q.type}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{q.subject}}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button @click="edit(q)" class="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
              <button @click="remove(q)" class="text-red-600 hover:text-red-800">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 批量操作工具栏 -->
    <div v-if="selected.length > 0" class="mt-3 flex items-center justify-between bg-white p-3 rounded-lg shadow">
      <div class="text-sm text-gray-700">已选择 {{ selected.length }} 道试题</div>
      <div class="flex items-center space-x-2">
        <button @click="confirmBulkDelete" class="px-3 py-1 bg-red-600 text-white rounded">批量删除</button>
      </div>
    </div>

    <!-- modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-semibold">{{ editMode ? '编辑试题' : '新增试题' }}</h3>
          <button @click="closeModal">×</button>
        </div>
        <div class="p-6 grid grid-cols-1 gap-4">
          <div>
            <label class="block text-gray-700 mb-2">题目内容</label>
            <textarea v-model="form.text" class="w-full border border-gray-300 rounded-lg px-4 py-2" rows="3"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2">类型</label>
              <select v-model="form.type" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>单选题</option>
                <option>多选题</option>
                <option>判断题</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 mb-2">科目</label>
              <select v-model="form.subject" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>科目一</option>
                <option>科目四</option>
              </select>
            </div>
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
  name: 'QuestionManagement',
  data() {
    return {
      questions: [
        { id: 'Q00123', text: '驾驶机动车在高速公路上行驶，遇有雾、雨、雪等能见度低于100米的恶劣气象条件时，应如何行驶？', type: '单选题', subject: '科目一' },
        { id: 'Q00578', text: '当车辆发生碰撞时，关于安全气囊的说法，下列哪项是正确的？', type: '多选题', subject: '科目四' }
      ],
      query: '',
      filterType: '',
      page: 1,
      perPage: 10,
      showModal: false,
      editMode: false,
      form: { id: null, text: '', type: '单选题', subject: '科目一' }
      ,
      selected: [],
      showBulkDelete: false
    }
  },
  computed: {
    filtered() {
      return this.questions.filter(q => {
        const mq = !this.query || q.text.includes(this.query) || q.id.includes(this.query)
        const mt = !this.filterType || q.type === this.filterType
        return mq && mt
      })
    },
    paged() { return this.filtered.slice((this.page-1)*this.perPage, this.page*this.perPage) },
    allVisibleSelected() {
      if (!this.paged || this.paged.length === 0) return false
      return this.paged.every(q => this.selected.includes(q.id))
    }
  },
  methods: {
    search() { this.page = 1 },
    toggleSelectAll(e) {
      const checked = e.target.checked
      const ids = this.paged.map(q => q.id)
      if (checked) {
        this.selected = Array.from(new Set(this.selected.concat(ids)))
      } else {
        this.selected = this.selected.filter(id => !ids.includes(id))
      }
    },
    confirmBulkDelete() {
      if (this.selected.length === 0) return
      this.showBulkDelete = true
    },
    doBulkDelete() {
      this.questions = this.questions.filter(q => !this.selected.includes(q.id))
      this.selected = []
      this.showBulkDelete = false
      if (this.page > Math.max(1, Math.ceil(this.filtered.length / this.perPage))) {
        this.page = Math.max(1, Math.ceil(this.filtered.length / this.perPage))
      }
    },
    openAdd() { this.editMode = false; this.form = { id: Date.now().toString().slice(-6), text: '', type: '单选题', subject: '科目一' }; this.showModal = true },
    edit(q) { this.editMode = true; this.form = Object.assign({}, q); this.showModal = true },
    closeModal() { this.showModal = false },
    save() {
      if (!this.form.text) return alert('请输入题目内容')
      if (this.editMode) {
        const idx = this.questions.findIndex(x => x.id === this.form.id)
        if (idx !== -1) this.questions.splice(idx,1,Object.assign({},this.form))
      } else {
        this.questions.unshift(Object.assign({},this.form))
      }
      this.closeModal()
    },
    remove(q) { this.questions = this.questions.filter(x => x.id !== q.id) },
    importFile(e) {
      const f = e.target.files[0]
      if (!f) return
      const reader = new FileReader()
      reader.onload = () => {
        const lines = reader.result.split(/\r?\n/).filter(Boolean)
        lines.forEach((ln, i) => {
          const cols = ln.split(',')
          // 简单 CSV: id,text,type,subject
          if (cols.length >= 4) {
            this.questions.unshift({ id: cols[0], text: cols[1], type: cols[2], subject: cols[3] })
          }
        })
        alert('导入完成')
      }
      reader.readAsText(f)
    }
  }
}
</script>
