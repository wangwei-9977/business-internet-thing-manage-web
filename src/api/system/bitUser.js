import request from '@/utils/request'

// 查询员工列表
export function listBitUser(query) {
  return request({
    url: '/system/bitUser/list',
    method: 'get',
    params: query
  })
}

// 查询员工详细
export function getBitUser(id) {
  return request({
    url: '/system/bitUser/' + id,
    method: 'get'
  })
}

// 新增员工
export function addBitUser(data) {
  return request({
    url: '/system/bitUser',
    method: 'post',
    data: data
  })
}

// 修改员工
export function updateBitUser(data) {
  return request({
    url: '/system/bitUser',
    method: 'put',
    data: data
  })
}

// 删除员工
export function delBitUser(id) {
  return request({
    url: '/system/bitUser/' + id,
    method: 'delete'
  })
}
