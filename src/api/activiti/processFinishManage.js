import request from '@/utils/request'
// 表格数据
export function getTableList (params) {
  return request({
    url: '/system/actProcessIns/getFinishedProcess',
    method: 'get',
    params
  })
}
// 删除
export function delData (params) {
  return request({
    url: `/system/actProcessIns/delHistoricInsByIds/${params}`,
    method: 'post'
  })
}
