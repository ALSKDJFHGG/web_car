import request from '@/utils/request.js'

// 创建试题
export const createExamService = (data) => {
  return request.post('/admin/exam', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 分页获取试题列表
export const getExamListService = (params) => {
  return request.get('/admin/exam', { params })
}

// 获取试题详细信息（考生考试信息）
export const getExamDetailService = (id) => {
  return request.get(`/admin/exam/${id}`)
}

// 删除试题
export const deleteExamService = (id) => {
  return request.delete(`/admin/exam/${id}`)
}
