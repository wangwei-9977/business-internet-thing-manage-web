import request from '@/utils/request'
// 表格数据
export function getTableList(params) {
  return request({
    url: '/system/actTask/todoList',
    method: 'get',
    params
  })
}
// 通过
export function pass (data) {
  return request({
    url: '/system/actTask/pass',
    method: 'post',
    data
  })
}
// 驳回至发起人
export function back (data) {
  return request({
    url: '/system/actTask/back',
    method: 'post',
    data
  })
}
// 自定义驳回
export function backToTask (data) {
  return request({
    url: '/system/actTask/backToTask',
    method: 'post',
    data
  })
}
// 委托
export function delegate (data) {
  return request({
    url: '/system/actTask/delegate',
    method: 'post',
    data
  })
}
// 获取发起人
export function getBackList (id) {
  return request({
    url: `/system/actTask/getBackList/${id}`,
    method: 'get'
  })
}
//获取节点人员
export function getNode (data) {
  return request({
    url: `/system/activiti_process/getNode`,
    method: 'get',
    params: data
  })
}
//
export function getNodeList (params) {
  return request({
    url: '/system/activiti_process/getNextNode',
    method: 'get',
    params
  })
}
