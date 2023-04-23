import request from '@/utils/request'
// 表格数据
export function getTableList(params) {
  return request({
    url: '/system/activiti_process/listData',
    method: 'get',
    params
  })
}
// 复制为模型
export function convertToModel (data) {
  return request({
    url: '/system/activiti_process/convertToModel',
    method: 'post',
    data
  })
}
// 删除
export function delData (data) {
  return request({
    url: '/system/activiti_process/delByIds',
    method: 'DELETE',
    params:data
  })
}
// 编辑
export function editData (data) {
  return request({
    url: '/system/activiti_process/updateInfo',
    method: 'post',
    data
  })
}
// 启用 禁用
export function updateStatus (data) {
  return request({
    url: '/system/activiti_process/updateStatus',
    method: 'post',
    data
  })
}
// 节点流程
export function getProcessNode (data) {
  return request({
    url: '/system/activiti_process/getProcessNode',
    method: 'get',
    params: data
  })
}
// 节点设置保存
export function editNodeUser (data) {
  return request({
    url: '/system/activiti_process/editNodeUser',
    method: 'post',
    data
  })
}
