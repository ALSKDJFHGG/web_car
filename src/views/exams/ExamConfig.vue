<template>
  <div class="exam-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>考试配置</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            创建试题
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="试题名称">
            <el-input
              v-model="searchForm.paperName"
              placeholder="请输入试题名称"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input
              v-model.number="searchForm.userId"
              placeholder="请输入用户ID"
              clearable
              style="width: 150px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="试题ID">
            <el-input
              v-model.number="searchForm.paperId"
              placeholder="请输入试题ID"
              clearable
              style="width: 150px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 试题列表表格 -->
      <el-table
        v-loading="loading"
        :data="examList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="paperId" label="试题ID" width="100" />
        <el-table-column prop="paperName" label="试题名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="subject" label="科目" width="100">
          <template #default="{ row }">
            <el-tag :type="getSubjectTagType(row.subject)">
              {{ row.subject || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalQuestions" label="总题数" width="100" />
        <el-table-column prop="examTime" label="考试时长" width="150">
          <template #default="{ row }">
            {{ formatExamTime(row.examTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="createByuser" label="创建人" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 创建试题对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建试题"
      width="600px"
      @close="handleCreateDialogClose"
    >
      <el-form
        ref="examFormRef"
        :model="examForm"
        :rules="examFormRules"
        label-width="100px"
      >
        <el-form-item label="试题名称" prop="examName">
          <el-input
            v-model="examForm.examName"
            placeholder="请输入试题名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-radio-group v-model="examForm.subject">
            <el-radio label="科目一">科目一</el-radio>
            <el-radio label="科目四">科目四</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目数量" prop="totalQuestions">
          <el-input-number
            v-model="examForm.totalQuestions"
            :min="1"
            :max="200"
            placeholder="请输入题目数量"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="考试时长" prop="examTime">
          <el-input-number
            v-model="examForm.examTime"
            :min="1"
            :max="300"
            placeholder="请输入考试时长（分钟）"
            style="width: 100%"
          />
          <span style="margin-left: 10px; color: #909399">分钟</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="试题详情 - 考生考试信息"
      width="900px"
    >
      <el-table
        v-loading="detailLoading"
        :data="examDetailList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="userId" label="考生ID" width="100" />
        <el-table-column prop="userName" label="考生姓名" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalScore" label="最终得分" width="100">
          <template #default="{ row }">
            <el-tag :type="row.totalScore >= 90 ? 'success' : 'danger'">
              {{ row.totalScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="passStatus" label="是否及格" width="100">
          <template #default="{ row }">
            <el-tag :type="row.passStatus ? 'success' : 'danger'">
              {{ row.passStatus ? '及格' : '不及格' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, View, Delete } from '@element-plus/icons-vue'
import { createExamService, getExamListService, getExamDetailService, deleteExamService } from '@/api/exam.js'

// 加载状态
const loading = ref(false)
const detailLoading = ref(false)
const submitLoading = ref(false)

// 试题列表
const examList = ref([])

// 搜索表单
const searchForm = reactive({
  paperName: '',
  userId: undefined,
  paperId: undefined
})

// 分页
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 创建试题对话框
const createDialogVisible = ref(false)
const examFormRef = ref(null)

// 试题表单
const examForm = reactive({
  examName: '',
  subject: '科目一',
  totalQuestions: 100,
  examTime: 90
})

// 表单验证规则
const examFormRules = {
  examName: [
    { required: true, message: '请输入试题名称', trigger: 'blur' },
    { min: 1, max: 50, message: '试题名称长度在1到50个字符', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: '请选择科目', trigger: 'change' }
  ],
  totalQuestions: [
    { required: true, message: '请输入题目数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 200, message: '题目数量在1到200之间', trigger: 'blur' }
  ],
  examTime: [
    { required: true, message: '请输入考试时长', trigger: 'blur' },
    { type: 'number', min: 1, max: 300, message: '考试时长在1到300分钟之间', trigger: 'blur' }
  ]
}

// 查看详情对话框
const detailDialogVisible = ref(false)
const examDetailList = ref([])
const currentExamId = ref(null)

// 获取试题列表
const fetchExamList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      paperName: searchForm.paperName || undefined,
      userId: searchForm.userId || undefined,
      paperId: searchForm.paperId || undefined
    }
    const res = await getExamListService(params)
    if (res.code === 0 || res.code === 200) {
      examList.value = res.data?.list || []
      // 处理分页信息
      if (res.data?.pagination) {
        pagination.total = res.data.pagination.total || 0
        pagination.pageNum = res.data.pagination.page || pagination.pageNum
        pagination.pageSize = res.data.pagination.size || pagination.pageSize
      } else {
        // 如果没有分页信息，使用列表长度
        pagination.total = examList.value.length
      }
    }
  } catch (error) {
    console.error('获取试题列表失败:', error)
    ElMessage.error('获取试题列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchExamList()
}

// 重置
const handleReset = () => {
  searchForm.paperName = ''
  searchForm.userId = undefined
  searchForm.paperId = undefined
  pagination.pageNum = 1
  fetchExamList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNum = 1
  fetchExamList()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.pageNum = page
  fetchExamList()
}

// 新增试题
const handleAdd = () => {
  // 重置表单
  Object.assign(examForm, {
    examName: '',
    subject: '科目一',
    totalQuestions: 100,
    examTime: 90
  })
  createDialogVisible.value = true
}

// 提交创建试题
const handleSubmit = async () => {
  if (!examFormRef.value) return
  await examFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const data = {
          examName: examForm.examName,
          subject: examForm.subject,
          totalQuestions: examForm.totalQuestions,
          examTime: examForm.examTime
        }
        const res = await createExamService(data)
        if (res.code === 0 || res.code === 200) {
          ElMessage.success('创建试题成功')
          createDialogVisible.value = false
          fetchExamList()
        }
      } catch (error) {
        console.error('创建试题失败:', error)
        ElMessage.error('创建试题失败，请重试')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 关闭创建对话框
const handleCreateDialogClose = () => {
  if (examFormRef.value) {
    examFormRef.value.resetFields()
  }
}

// 查看详情
const handleViewDetail = async (row) => {
  currentExamId.value = row.paperId
  detailDialogVisible.value = true
  detailLoading.value = true
  try {
    const res = await getExamDetailService(row.paperId)
    if (res.code === 0 || res.code === 200) {
      examDetailList.value = res.data?.list || []
      if (examDetailList.value.length === 0) {
        ElMessage.info('暂无考生考试信息')
      }
    }
  } catch (error) {
    console.error('获取试题详情失败:', error)
    ElMessage.error('获取试题详情失败，请重试')
  } finally {
    detailLoading.value = false
  }
}

// 删除试题
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除试题 "${row.paperName || '该试题'}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const res = await deleteExamService(row.paperId)
    if (res.code === 0 || res.code === 200) {
      ElMessage.success('删除成功')
      // 实时从列表中移除
      const index = examList.value.findIndex(e => e.paperId === row.paperId)
      if (index > -1) {
        examList.value.splice(index, 1)
        pagination.total = pagination.total - 1
      }
      // 如果当前页没有数据了，返回上一页
      if (examList.value.length === 0 && pagination.pageNum > 1) {
        pagination.pageNum = pagination.pageNum - 1
        fetchExamList()
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除试题失败:', error)
      ElMessage.error('删除试题失败，请重试')
    }
  }
}

// 格式化考试时长
const formatExamTime = (examTime) => {
  if (!examTime && examTime !== 0) return '-'
  // 如果是数字，格式化为分钟显示
  if (typeof examTime === 'number') {
    return `${examTime}分钟`
  }
  // 如果是字符串，尝试转换为数字
  const minutes = parseInt(examTime)
  if (!isNaN(minutes)) {
    return `${minutes}分钟`
  }
  return examTime
}

// 获取科目标签类型
const getSubjectTagType = (subject) => {
  if (!subject) return 'info'
  const subjectStr = String(subject).trim()
  if (subjectStr === '科目一' || subjectStr === 'km1') {
    return 'primary'
  } else if (subjectStr === '科目四' || subjectStr === 'km4') {
    return 'success'
  }
  return 'info'
}

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  // 如果已经是格式化好的字符串，直接返回
  if (typeof dateTime === 'string') {
    return dateTime
  }
  // 如果是日期对象，格式化
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 组件挂载时获取试题列表
onMounted(() => {
  fetchExamList()
})
</script>

<style scoped>
.exam-config {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
