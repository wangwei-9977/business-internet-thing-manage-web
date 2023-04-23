import request from '@/utils/request'
// 表格数据
export function getTableList (params) {
  return request({
    url: '/system/activiti/models/modelListData',
    method: 'get',
    params
  })
}
// 发布
export function addDeployment (params) {
  return request({
    url: `/system/activiti/models/deployment/${params}`,
    method: 'get'
  })
}
// 删除
export function delData (params) {
  return request({
    url: `/system/activiti/models/delete/${params}`,
    method: 'get'
  })
}
