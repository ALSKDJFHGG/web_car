<template>
  <div class="dashboard">
    <el-card class="welcome-card">
      <h1>欢迎来到驾考题库管理系统</h1>
      <p>管理员后台主界面</p>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12" v-for="stat in statistics" :key="stat.title">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="30"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>题目统计</span>
              <el-button type="primary" link @click="refreshStatistics">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </template>
          <div v-if="questionStats" class="statistics-content">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="总题目数">
                <span class="stat-number">{{ questionStats.total || 0 }}</span>
              </el-descriptions-item>
            </el-descriptions>
            
            <div style="margin-top: 20px">
              <h4>按科目统计</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="科目一">
                  <el-tag type="primary">{{ questionStats.bySubject?.['科目一'] || questionStats.bySubject?.km1 || 0 }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="科目四">
                  <el-tag type="success">{{ questionStats.bySubject?.['科目四'] || questionStats.bySubject?.km4 || 0 }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
            
            <div style="margin-top: 20px">
              <h4>按题型统计</h4>
              <el-descriptions :column="3" border>
                <el-descriptions-item label="单选题">
                  <el-tag type="primary">{{ questionStats.byType?.[1] || 0 }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="判断题">
                  <el-tag type="success">{{ questionStats.byType?.[2] || 0 }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="多选题">
                  <el-tag type="warning">{{ questionStats.byType?.[3] || 0 }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <div v-else class="loading-content">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span style="margin-left: 10px">加载中...</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <el-row :gutter="10">
            <el-col :span="12" v-for="action in quickActions" :key="action.title">
              <el-button 
                type="primary" 
                :icon="action.icon" 
                style="width: 100%; margin-bottom: 10px"
                @click="handleQuickAction(action.path)"
              >
                {{ action.title }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, User, EditPen, List, Refresh, Loading } from '@element-plus/icons-vue'
import { getQuestionStatisticsService } from '@/api/question.js'

const router = useRouter()

// 统计数据
const questionStats = ref(null)
const loading = ref(false)

// 统计卡片
const statistics = ref([
  { title: '总题目数', value: '-', icon: 'Document', color: '#67C23A' },
  { title: '科目一', value: '-', icon: 'Document', color: '#909399' }
])

// 快捷操作
const quickActions = [
  { title: '添加题目', icon: Document, path: '/questions?action=add' },
  { title: '用户管理', icon: User, path: '/users' },
  { title: '考试配置', icon: EditPen, path: '/exams' },
  { title: '查看日志', icon: List, path: '/logs' }
]

// 获取题目统计信息
const fetchQuestionStatistics = async () => {
  loading.value = true
  try {
    const res = await getQuestionStatisticsService()
    if (res.code === 0 || res.code === 200) {
      questionStats.value = res.data
      
      // 更新统计卡片
      if (res.data) {
        statistics.value[0].value = res.data.total || 0
        statistics.value[1].value = res.data.bySubject?.['科目一'] || res.data.bySubject?.km1 || 0
      }
    }
  } catch (error) {
    console.error('获取题目统计失败:', error)
  } finally {
    loading.value = false
  }
}

// 刷新统计
const refreshStatistics = () => {
  fetchQuestionStatistics()
}

// 处理快捷操作
const handleQuickAction = (path) => {
  router.push(path)
}

// 初始化
onMounted(() => {
  fetchQuestionStatistics()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.welcome-card {
  text-align: center;
  margin-bottom: 20px;
}

.welcome-card h1 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 24px;
}

.welcome-card p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 15px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistics-content {
  padding: 10px 0;
}

.statistics-content h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.stat-number {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.loading-content {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}
</style>
