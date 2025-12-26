<template>
  <div class="question-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>试题管理</span>
          <div>
            <!-- <el-button type="success" @click="handleImport">
              <el-icon><Upload /></el-icon>
              导入题库
            </el-button> -->
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增题目
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入题目内容关键词"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="科目">
            <el-select
              v-model="searchForm.subject"
              placeholder="请选择科目"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="subject in subjects"
                :key="subject.code"
                :label="subject.name"
                :value="subject.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="题型">
            <el-select
              v-model="searchForm.typeId"
              placeholder="请选择题型"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="type in questionTypes"
                :key="type.typeId"
                :label="type.typeName"
                :value="Number(type.typeId)"
              />
            </el-select>
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

      <!-- 题目表格 -->
      <el-table
        v-loading="loading"
        :data="questionList"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="questionId" label="ID" width="80" />
        <el-table-column prop="subject" label="科目" width="100">
          <template #default="{ row }">
            <el-tag :type="row.subject === '科目一' ? 'primary' : 'success'">
              {{ row.subject }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="typeId" label="题型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.typeId)">
              {{ getTypeName(row.typeId) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="题目内容" min-width="300" show-overflow-tooltip />
        <el-table-column prop="imageUrl" label="图片" width="120">
          <template #default="{ row }">
            <el-image
              v-if="row.imageUrl"
              :src="getImageUrl(row.imageUrl)"
              :preview-src-list="[getImageUrl(row.imageUrl)]"
              fit="cover"
              style="width: 60px; height: 60px; cursor: pointer"
              :preview-teleported="true"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" link size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
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

      <!-- 批量操作 -->
      <div v-if="selectedQuestions.length > 0" class="batch-actions">
        <el-alert
          :title="`已选择 ${selectedQuestions.length} 项`"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <el-button type="danger" size="small" @click="handleBatchDelete">
              批量删除
            </el-button>
          </template>
        </el-alert>
      </div>
    </el-card>

    <!-- 新增/编辑题目对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form
        ref="questionFormRef"
        :model="questionForm"
        :rules="questionFormRules"
        label-width="100px"
      >
        <el-form-item label="科目" prop="subject">
          <el-radio-group v-model="questionForm.subject">
            <el-radio label="科目一">科目一</el-radio>
            <el-radio label="科目四">科目四</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题型" prop="typeId">
          <el-select v-model="questionForm.typeId" placeholder="请选择题型" @change="handleTypeChange">
              <el-option
                v-for="type in questionTypes"
                :key="type.typeId"
                :label="type.typeName"
                :value="Number(type.typeId)"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="题目内容" prop="content">
          <el-input
            v-model="questionForm.content"
            type="textarea"
            :rows="3"
            placeholder="请输入题目内容"
          />
        </el-form-item>
        <!-- <el-form-item label="题目图片" prop="imageUrl">
          <el-input
            v-model="questionForm.imageUrl"
            placeholder="请输入图片URL（可选）"
          />
        </el-form-item> -->
        <el-form-item label="选项" prop="options">
          <div v-for="(option, index) in questionForm.options" :key="index" class="option-item">
            <el-input
              v-model="option.label"
              placeholder="选项标签"
              style="width: 80px"
              disabled
            />
            <el-input
              v-model="option.content"
              placeholder="选项内容"
              style="flex: 1; margin: 0 10px"
            />
            <el-checkbox v-model="option.isCorrect">正确答案</el-checkbox>
            <el-button
              v-if="questionForm.options.length > 2"
              type="danger"
              link
              @click="removeOption(index)"
            >
              删除
            </el-button>
          </div>
          <el-button
            v-if="canAddOption"
            type="primary"
            link
            @click="addOption"
          >
            <el-icon><Plus /></el-icon>
            添加选项
          </el-button>
        </el-form-item>
        <el-form-item label="解析" prop="explanation">
          <el-input
            v-model="questionForm.explanation"
            type="textarea"
            :rows="2"
            placeholder="请输入题目解析（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 导入题库对话框 -->
    <!-- <el-dialog
      v-model="importDialogVisible"
      title="导入题库"
      width="500px"
    >
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1"
        accept=".xlsx,.xls,.csv"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 Excel 文件（.xlsx, .xls）和 CSV 文件
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="importLoading" @click="handleImportSubmit">
          确定导入
        </el-button>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Edit,
  Delete,
  Upload,
  Picture,
  UploadFilled
} from '@element-plus/icons-vue'
import {
  getQuestionListService,
  getQuestionDetailService,
  createQuestionService,
  updateQuestionService,
  deleteQuestionService,
  batchDeleteQuestionService,
  getQuestionTypesService,
  getSubjectsService,
  importQuestionsService
} from '@/api/question.js'

// 加载状态
const loading = ref(false)
const submitLoading = ref(false)
const importLoading = ref(false)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  subject: '',
  typeId: undefined
})

// 题目列表
const questionList = ref([])

// 分页信息
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 选中的题目
const selectedQuestions = ref([])

// 科目和题型
const subjects = ref([])
const questionTypes = ref([])

// 对话框
const dialogVisible = ref(false)
const importDialogVisible = ref(false)
const dialogTitle = ref('新增题目')
const questionFormRef = ref(null)
const uploadRef = ref(null)
const importFile = ref(null)

// 题目表单
const questionForm = reactive({
  questionId: null,
  subject: '科目一',
  typeId: 1,
  content: '',
  imageUrl: '',
  options: [
    { label: 'A', content: '', isCorrect: false },
    { label: 'B', content: '', isCorrect: false }
  ],
  explanation: ''
})

// 表单验证规则
const questionFormRules = {
  subject: [
    { required: true, message: '请选择科目', trigger: 'change' }
  ],
  typeId: [
    { required: true, message: '请选择题型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入题目内容', trigger: 'blur' }
  ],
  options: [
    {
      validator: (rule, value, callback) => {
        if (!value || value.length < 2) {
          callback(new Error('至少需要2个选项'))
          return
        }
        const hasCorrect = value.some(opt => opt.isCorrect)
        if (!hasCorrect) {
          callback(new Error('至少需要设置一个正确答案'))
          return
        }
        const hasEmpty = value.some(opt => !opt.content)
        if (hasEmpty) {
          callback(new Error('选项内容不能为空'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ]
}

// 计算属性
const canAddOption = computed(() => {
  if (questionForm.typeId === 2) {
    // 判断题只有2个选项
    return questionForm.options.length < 2
  }
  // 单选和多选最多4个选项
  return questionForm.options.length < 4
})

// 获取题目列表
const fetchQuestionList = async () => {
  loading.value = true
  try {
    // 将科目代码转换为中文名称（km1 -> 科目一, km4 -> 科目四）
    let subjectParam = undefined
    if (searchForm.subject) {
      subjectParam = searchForm.subject === 'km1' ? '科目一' : '科目四'
    }
    
    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      subject: subjectParam,
      typeId: searchForm.typeId || undefined
    }
    const res = await getQuestionListService(params)
    if (res.code === 0 || res.code === 200) {
      questionList.value = res.data?.list || []
      // 处理分页字段：后端返回的是 page, size, total, pages
      if (res.data?.pagination) {
        pagination.total = res.data.pagination.total || 0
        pagination.pageNum = res.data.pagination.page || pagination.pageNum
        pagination.pageSize = res.data.pagination.size || pagination.pageSize
      }
    }
  } catch (error) {
    console.error('获取题目列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取科目和题型
const fetchBaseData = async () => {
  // 先设置默认值，确保下拉框有选项
  subjects.value = [
    { code: 'km1', name: '科目一' },
    { code: 'km4', name: '科目四' }
  ]
  questionTypes.value = [
    { typeId: 1, typeName: '单选题' },
    { typeId: 2, typeName: '判断题' },
    { typeId: 3, typeName: '多选题' }
  ]
  
  try {
    const [subjectsRes, typesRes] = await Promise.all([
      getSubjectsService(),
      getQuestionTypesService()
    ])
    if (subjectsRes.code === 0 || subjectsRes.code === 200) {
      if (subjectsRes.data && subjectsRes.data.length > 0) {
        subjects.value = subjectsRes.data
      }
    }
    if (typesRes.code === 0 || typesRes.code === 200) {
      if (typesRes.data && typesRes.data.length > 0) {
        questionTypes.value = typesRes.data
      }
    }
    
    // 如果接口返回失败或数据为空，使用默认值
    if (subjects.value.length === 0) {
      subjects.value = [
        { code: 'km1', name: '科目一' },
        { code: 'km4', name: '科目四' }
      ]
    }
    if (questionTypes.value.length === 0) {
      questionTypes.value = [
        { typeId: 1, typeName: '单选题' },
        { typeId: 2, typeName: '判断题' },
        { typeId: 3, typeName: '多选题' }
      ]
    }
  } catch (error) {
    console.error('获取基础数据失败:', error)
    // 接口失败时使用默认值
    subjects.value = [
      { code: 'km1', name: '科目一' },
      { code: 'km4', name: '科目四' }
    ]
    questionTypes.value = [
      { typeId: 1, typeName: '单选题' },
      { typeId: 2, typeName: '判断题' },
      { typeId: 3, typeName: '多选题' }
    ]
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchQuestionList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.subject = ''
  searchForm.typeId = undefined
  pagination.pageNum = 1
  fetchQuestionList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNum = 1
  fetchQuestionList()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.pageNum = page
  fetchQuestionList()
}

// 选择改变
const handleSelectionChange = (selection) => {
  selectedQuestions.value = selection
}

// 新增题目
const handleAdd = () => {
  dialogTitle.value = '新增题目'
  Object.assign(questionForm, {
    questionId: null,
    subject: '科目一',
    typeId: 1,
    content: '',
    imageUrl: '',
    options: [
      { label: 'A', content: '', isCorrect: false },
      { label: 'B', content: '', isCorrect: false }
    ],
    explanation: ''
  })
  dialogVisible.value = true
}

// 编辑题目
const handleEdit = async (row) => {
  dialogTitle.value = '编辑题目'
  try {
    const res = await getQuestionDetailService(row.questionId)
    if (res.code === 0 || res.code === 200) {
      const data = res.data
      Object.assign(questionForm, {
        questionId: data.questionId,
        subject: data.subject,
        typeId: data.typeId,
        content: data.content,
        imageUrl: data.imageUrl || '',
        options: data.options ? data.options.map(opt => ({
          label: opt.label,
          content: opt.content,
          isCorrect: opt.isCorrect
        })) : [],
        explanation: data.explanation || ''
      })
      dialogVisible.value = true
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
    ElMessage.error('获取题目详情失败，请重试')
  }
}

// 删除题目
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除题目 "${row.content ? row.content.substring(0, 20) + '...' : '该题目'}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const res = await deleteQuestionService(row.questionId)
    if (res.code === 0 || res.code === 200) {
      ElMessage.success('删除成功')
      // 实时从列表中移除，不需要刷新整个列表
      const index = questionList.value.findIndex(q => q.questionId === row.questionId)
      if (index > -1) {
        questionList.value.splice(index, 1)
        pagination.total = pagination.total - 1
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除题目失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedQuestions.value.length === 0) {
    ElMessage.warning('请选择要删除的题目')
    return
  }
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedQuestions.value.length} 道题目吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const ids = selectedQuestions.value.map(q => q.questionId)
    const res = await batchDeleteQuestionService(ids)
    if (res.code === 0 || res.code === 200) {
      ElMessage.success('批量删除成功')
      // 实时从列表中移除已删除的题目
      const deletedIds = new Set(ids)
      questionList.value = questionList.value.filter(q => !deletedIds.has(q.questionId))
      pagination.total = pagination.total - ids.length
      selectedQuestions.value = []
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败，请重试')
    }
  }
}

// 题型改变
const handleTypeChange = (typeId) => {
  // 根据题型调整选项
  if (typeId === 2) {
    // 判断题：只有 √ 和 ×
    questionForm.options = [
      { label: '√', content: '正确', isCorrect: false },
      { label: '×', content: '错误', isCorrect: false }
    ]
  } else {
    // 单选题和多选题：A, B, C, D
    const labels = ['A', 'B', 'C', 'D']
    questionForm.options = labels.slice(0, 2).map(label => ({
      label,
      content: '',
      isCorrect: false
    }))
  }
}

// 添加选项
const addOption = () => {
  if (questionForm.typeId === 2) return // 判断题不能添加选项
  const labels = ['A', 'B', 'C', 'D']
  const nextLabel = labels[questionForm.options.length]
  if (nextLabel) {
    questionForm.options.push({
      label: nextLabel,
      content: '',
      isCorrect: false
    })
  }
}

// 删除选项
const removeOption = (index) => {
  questionForm.options.splice(index, 1)
  // 重新分配标签
  if (questionForm.typeId !== 2) {
    const labels = ['A', 'B', 'C', 'D']
    questionForm.options.forEach((opt, idx) => {
      opt.label = labels[idx]
    })
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!questionFormRef.value) return
  await questionFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const data = {
          subject: questionForm.subject,
          typeId: questionForm.typeId,
          content: questionForm.content,
          imageUrl: questionForm.imageUrl || null,
          options: questionForm.options.map(opt => ({
            label: opt.label,
            content: opt.content,
            isCorrect: opt.isCorrect
          })),
          explanation: questionForm.explanation || null
        }
        let res
        if (questionForm.questionId) {
          // 编辑 - 使用 PUT /api/v1/admin/questions/{id}
          res = await updateQuestionService(questionForm.questionId, data)
          if (res.code === 0 || res.code === 200) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            // 实时更新列表中的该项，不需要刷新整个列表
            const index = questionList.value.findIndex(q => q.questionId === questionForm.questionId)
            if (index > -1) {
              // 更新列表中的题目信息
              Object.assign(questionList.value[index], {
                subject: data.subject,
                typeId: data.typeId,
                content: data.content,
                imageUrl: data.imageUrl
              })
            } else {
              // 如果找不到，重新获取列表
              fetchQuestionList()
            }
          }
        } else {
          // 新增
          res = await createQuestionService(data)
          if (res.code === 0 || res.code === 200) {
            ElMessage.success('创建成功')
            dialogVisible.value = false
            // 新增后重新获取列表（因为需要获取新创建的ID等信息）
            fetchQuestionList()
          }
        }
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('操作失败，请重试')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 导入题库
// const handleImport = () => {
//   importDialogVisible.value = true
// }

// 文件改变
// const handleFileChange = (file) => {
//   importFile.value = file.raw
// }

// 提交导入
// const handleImportSubmit = async () => {
//   if (!importFile.value) {
//     ElMessage.warning('请选择要导入的文件')
//     return
//   }
//   importLoading.value = true
//   try {
//     const res = await importQuestionsService(importFile.value)
//     if (res.code === 0 || res.code === 200) {
//       ElMessage.success('导入成功')
//       importDialogVisible.value = false
//       importFile.value = null
//       if (uploadRef.value) {
//         uploadRef.value.clearFiles()
//       }
//       fetchQuestionList()
//     }
//   } catch (error) {
//     console.error('导入失败:', error)
//   } finally {
//     importLoading.value = false
//   }
// }

// 对话框关闭
const handleDialogClose = () => {
  if (questionFormRef.value) {
    questionFormRef.value.clearValidate()
  }
}

// 获取题型名称
const getTypeName = (typeId) => {
  const type = questionTypes.value.find(t => t.typeId === typeId)
  return type ? type.typeName : `题型${typeId}`
}

// 获取题型标签类型
const getTypeTagType = (typeId) => {
  const types = {
    1: 'primary',
    2: 'success',
    3: 'warning'
  }
  return types[typeId] || ''
}

// 图片URL拼接
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  
  // 如果已经是完整URL（以http://或https://开头），直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // 新的图片地址格式：http://t7sxw4srx.hd-bkt.clouddn.com/images/k1_image1.png
  const baseImageUrl = 'http://t7sxw4srx.hd-bkt.clouddn.com'
  
  // 处理相对路径
  let imagePath = imageUrl
  
  // 如果以 / 开头，去掉开头的 /
  if (imagePath.startsWith('/')) {
    imagePath = imagePath.substring(1)
  }
  
  // 如果路径中已经包含 images/，直接拼接
  if (imagePath.startsWith('images/')) {
    return `${baseImageUrl}/${imagePath}`
  }
  
  // 如果路径不包含 images/，添加 images/ 前缀
  // 例如：k1_image1.png -> images/k1_image1.png
  return `${baseImageUrl}/images/${imagePath}`
}

// 格式化日期
// 初始化
onMounted(() => {
  fetchBaseData()
  fetchQuestionList()
})
</script>

<style scoped>
.question-list {
  padding: 0;
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

.batch-actions {
  margin-top: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.question-detail {
  padding: 10px 0;
}

.question-content,
.question-options,
.question-explanation {
  margin-top: 20px;
}

.question-content h4,
.question-options h4,
.question-explanation h4 {
  margin-bottom: 10px;
  color: #303133;
}

.question-options ul {
  list-style: none;
  padding: 0;
}

.question-options li {
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.question-image {
  margin-top: 10px;
}
</style>
