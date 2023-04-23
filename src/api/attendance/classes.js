import request from '@/utils/requestattend'

export function addClasses(data) {
  return request({
    url: '/attend/classes/create',
    method: 'post',
    data
  })
}

export function getClasses(data) {
  return request({
    url: '/attend/my/query-classes',
    method: 'post',
    data
  })
}

export function deleteClasses(data) {
  return request({
    url: '/attend/classes/del',
    method: 'post',
    data
  })
}
