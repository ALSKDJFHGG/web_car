<template>
  <div class="user-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="用户名">
            <el-input
              v-model="searchForm.userName"
              placeholder="请输入用户名"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
              v-model.number="searchForm.phone"
              placeholder="请输入手机号"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="用户状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
              <el-option label="正常" :value="1" />
              <el-option label="禁用" :value="0" />
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

      <!-- 用户表格 -->
      <el-table
        v-loading="loading"
        :data="userList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="status" label="用户状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              :type="row.status ? 'warning' : 'success'"
              link
              size="small"
              @click="handleChangeStatus(row)"
            >
              <el-icon><Switch /></el-icon>
              {{ row.status ? '禁用' : '启用' }}
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete, Switch } from '@element-plus/icons-vue'
import {
  getUserListService,
  updateUserStatusService,
  deleteUserService
} from '@/api/user.js'

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  userName: '',
  phone: undefined,
  status: undefined
})

// 用户列表
const userList = ref([])

// 分页信息
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      userName: searchForm.userName || undefined,
      phone: searchForm.phone || undefined,
      status: searchForm.status !== undefined ? searchForm.status : undefined
    }
    const res = await getUserListService(params)
    if (res.code === 0 || res.code === 200) {
      userList.value = res.data?.list || []
      // 处理分页信息
      if (res.data?.pagination) {
        pagination.total = res.data.pagination.total || 0
        pagination.pageNum = res.data.pagination.page || pagination.pageNum
        pagination.pageSize = res.data.pagination.size || pagination.pageSize
      } else {
        // 如果没有分页信息，使用列表长度
        pagination.total = userList.value.length
      }
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败，请重试')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchUserList()
}

// 重置
const handleReset = () => {
  searchForm.userName = ''
  searchForm.phone = undefined
  searchForm.status = undefined
  pagination.pageNum = 1
  fetchUserList()
}

// 刷新
const handleRefresh = () => {
  fetchUserList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNum = 1
  fetchUserList()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.pageNum = page
  fetchUserList()
}

// 更改用户状态
const handleChangeStatus = async (row) => {
  const newStatus = row.status ? 0 : 1
  const statusText = newStatus ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(
      `确定要${statusText}用户 "${row.username || '该用户'}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const data = {
      userId: row.userId,
      status: newStatus
    }
    const res = await updateUserStatusService(row.userId, data)
    if (res.code === 0 || res.code === 200) {
      ElMessage.success(`${statusText}成功`)
      // 实时更新列表中的状态
      row.status = newStatus === 1
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更改用户状态失败:', error)
      ElMessage.error('更改用户状态失败，请重试')
    }
  }
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username || '该用户'}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const res = await deleteUserService(row.userId)
    if (res.code === 0 || res.code === 200) {
      ElMessage.success('删除成功')
      // 实时从列表中移除
      const index = userList.value.findIndex(u => u.userId === row.userId)
      if (index > -1) {
        userList.value.splice(index, 1)
        pagination.total = pagination.total - 1
      }
      // 如果当前页没有数据了，返回上一页
      if (userList.value.length === 0 && pagination.pageNum > 1) {
        pagination.pageNum = pagination.pageNum - 1
        fetchUserList()
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败，请重试')
    }
  }
}

// 组件挂载时获取用户列表
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-list {
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
</style>
