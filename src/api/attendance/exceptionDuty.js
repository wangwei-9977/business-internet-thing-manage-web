import request from '@/utils/request'

// 查询每月异常考勤统计列表
export function listExceptionDuty(query) {
  return request({
    url: '/attendance/exceptionMonthDuty/list',
    method: 'get',
    params: query
  })
}

// 查询每月异常考勤统计详细
export function getExceptionDuty(id) {
  return request({
    url: '/attendance/exceptionMonthDuty/' + id,
    method: 'get'
  })
}

// 新增每月异常考勤统计
export function addExceptionDuty(data) {
  return request({
    url: '/attendance/exceptionMonthDuty',
    method: 'post',
    data: data
  })
}

// 修改每月异常考勤统计
export function updateExceptionDuty(data) {
  return request({
    url: '/attendance/exceptionMonthDuty',
    method: 'put',
    data: data
  })
}

// 删除每月异常考勤统计
export function delExceptionDuty(id) {
  return request({
    url: '/attendance/exceptionMonthDuty/' + id,
    method: 'delete'
  })
}

// 导出每月异常考勤统计
export function exportExceptionDuty(query) {
  return request({
    url: '/attendance/exceptionMonthDuty/export',
    method: 'get',
    params: query
  })
}