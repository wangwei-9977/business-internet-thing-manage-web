import request from '@/utils/requestattend'

export function saveClock(data) {
  return request({
    url: '/attend/clock/create',
    method: 'post',
    data
  })
}

export function getClocks(data) {
  return request({
    url: '/attend/my/query-clocks',
    method: 'post',
    data
  })
}

export function deleteClock(data) {
  return request({
    url: '/attend/clock/del',
    method: 'post',
    data
  })
}

