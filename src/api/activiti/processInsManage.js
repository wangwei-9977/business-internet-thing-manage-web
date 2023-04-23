import request from '@/utils/request'
// 表格数据
export function getTableList (params) {
  return request({
    url: '/system/actProcessIns/getRunningProcess',
    method: 'get',
    params
  })
}
// 激活 挂起
export function updateInsStatus (data) {
  return request({
    url: '/system/actProcessIns/updateInsStatus',
    method: 'post',
    data
  })
}
// 删除
export function delData (params) {
  return request({
    url: `/system/actProcessIns/delInsByIds/${params}`,
    method: 'post'
  })
}
