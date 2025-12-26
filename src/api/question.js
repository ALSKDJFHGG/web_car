import request from '@/utils/request.js'

// 分页查询题目列表
export const getQuestionListService = (params) => {
  return request.get('/admin/questions', { params })
}

// 获取题目详情
export const getQuestionDetailService = (id) => {
  return request.get(`/admin/questions/${id}`)
}

// 创建题目
export const createQuestionService = (data) => {
  return request.post('/admin/questions', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 更新题目
export const updateQuestionService = (id, data) => {
  return request.put(`/admin/questions/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 删除题目
export const deleteQuestionService = (id) => {
  return request.delete(`/admin/questions/${id}`)
}

// 批量删除题目
export const batchDeleteQuestionService = (ids) => {
  return request.patch('/admin/questions/batch', { ids }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取题目统计信息
export const getQuestionStatisticsService = () => {
  return request.get('/admin/questions/statistics')
}

// 获取题型列表
export const getQuestionTypesService = () => {
  return request.get('/admin/question-types')
}

// 获取科目枚举
export const getSubjectsService = () => {
  return request.get('/admin/subjects')
}

// 导入题库（如果后端有实现）
export const importQuestionsService = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/admin/questions/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
