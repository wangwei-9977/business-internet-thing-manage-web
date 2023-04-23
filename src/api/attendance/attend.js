import request from '@/utils/requestattend'

export function getAllAttendState() {
  return request({
    url: '/attend/state/attend-state',
    method: 'get',
    params: { }
  })
}

export function queryDailyData(data) {
  return request({
    url: '/attend/schedule/query-daily-data',
    method: 'post',
    data
  })
}

export function getAllAttendType() {
  var data = {}
  return request({
    url: '/attend/type/attend-type-data',
    method: 'post',
    data
  })
}

export function modifyAttendType(data) {
  return request({
    url: '/attend/type/edit-attend-type',
    method: 'post',
    data
  })
}

export function queryDutyData(data) {
  return request({
    url: '/attend/schedule/query-duty-data',
    method: 'post',
    data
  })
}

export function queryMonthData(data) {
  return request({
    url: '/attend/duty/query-month-data',
    method: 'post',
    data
  })
}

export function queryMyDailyDuty(data) {
  return request({
    url: '/attend/duty/attend-calendar',
    method: 'post',
    data
  })
}

export function queryMyMonthData(data) {
  return request({
    url: '/attend/my/query-month-data',
    method: 'post',
    data
  })
}

export function exportDutyDayExcel(data) {
  return request({
    url: '/attend/duty/export-excel',
    method: 'post',
    data,
    responseType:"blob"
  })
}

