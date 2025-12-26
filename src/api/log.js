import request from '@/utils/request.js'

// 获取操作日志
export const getOperationLogService = (params) => {
  return request.get('/admin/log', { params })
}
