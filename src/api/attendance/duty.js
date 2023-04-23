import request from '@/utils/requestattend'

export function getMyDutys(data) {
  return request({
    url: '/attend/my/query-dutys',
    method: 'post',
    data
  })
}
