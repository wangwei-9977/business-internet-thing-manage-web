import request from '@/utils/request'

export function getTableList (params) {
  return request.get('/system/actBusiness/listData', {
    params
  })
}

export function getFirstNode (params) {
  return request({
    url: '/system/actProcessIns/getFirstNode',
    method: 'get',
    params
  })
}
// 提交申请
export function apply (data) {
  return request.post('/system/actBusiness/apply', data)
}
// 删除
export function delData (params) {
  return request({
    url: '/system/actBusiness/delByIds',
    method: 'delete',
    params
  })
}
// 撤回
export function cancel (data) {
  return request({
    url: '/system/actBusiness/cancel',
    method: 'post',
    data
  })
}
