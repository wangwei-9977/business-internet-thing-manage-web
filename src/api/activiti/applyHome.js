import request from '@/utils/request'

export function getProcessDataList (params) {
  return request({
    url: '/system/activiti_process/listData',
    method: 'get',
    params
  })
}
