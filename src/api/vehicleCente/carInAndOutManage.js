import request from '@/utils/request'

export function getTableDataList (params) {
  return request.get('', {
    params
  })
}
