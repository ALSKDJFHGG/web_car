<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">考试配置</h1>
      <p class="text-gray-600">创建模拟考试、设置题量/时间/及格线等</p>
    </div>

    <div class="bg-white rounded-xl shadow p-6">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 mb-2">考试名称</label>
          <input v-model="form.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label class="block text-gray-700 mb-2">考试时长（分钟）</label>
          <input v-model.number="form.duration" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label class="block text-gray-700 mb-2">及格分数</label>
          <input v-model.number="form.passScore" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label class="block text-gray-700 mb-2">试题数量</label>
          <input v-model.number="form.totalQuestions" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button @click="createExam" class="px-6 py-3 bg-blue-600 text-white rounded-lg">创建模拟考试</button>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="text-lg font-semibold">已创建的模拟考试</h2>
      <div v-if="exams.length===0" class="text-gray-500 mt-2">暂无模拟考试</div>
      <ul class="mt-3 space-y-2">
        <li v-for="e in exams" :key="e.id" class="p-3 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <div class="font-medium">{{e.name}}</div>
            <div class="text-sm text-gray-500">{{e.totalQuestions}}题 • {{e.duration}} 分钟 • 及格 {{e.passScore}}</div>
          </div>
          <div class="space-x-2">
            <button @click="start(e)" class="px-3 py-1 bg-green-600 text-white rounded">开始</button>
            <button @click="remove(e)" class="px-3 py-1 border border-gray-300 rounded">删除</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamConfig',
  data() {
    return {
      form: { name: '', duration: 45, passScore: 90, totalQuestions: 50 },
      exams: []
    }
  },
  methods: {
    createExam() {
      if (!this.form.name) return alert('请输入考试名称')
      const e = Object.assign({ id: Date.now().toString().slice(-6) }, this.form)
      this.exams.unshift(e)
      this.form = { name: '', duration: 45, passScore: 90, totalQuestions: 50 }
    },
    start(e) { alert(`准备开始：${e.name}`) },
    remove(e) { this.exams = this.exams.filter(x => x.id !== e.id) }
  }
}
</script>
