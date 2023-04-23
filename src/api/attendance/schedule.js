import request from '@/utils/requestattend';

export function getList(data) {
  return request({
    url: '/attend/schedule/query-schedule',
    method: 'post',
    data
  });
}

export function addSchedule(data) {
  return request({
    url: '/attend/org/query-roles',
    method: 'post',
    data
  });
}

export function deleteSchedule(data) {
  return request({
    url: '/attend/schedule/delete-schedule',
    method: 'post',
    data
  });
}

export function getSchedule(data) {
  return request({
    url: '/attend/schedule/query-schedule-by-id',
    method: 'post',
    data
  });
}

export function saveSchedule(data) {
  return request({
    url: '/attend/schedule/save-schedule',
    method: 'post',
    data
  });
}

/**
 * 查看个人具体班次
 * @param data
 */
export function getPersonSchedule(data) {
  return request({
    url: '/attend/schedule/query-classes-by-id',
    method: 'post',
    data
  });
}

/**
 * 批量更新排班（周期排班）
 * @param data
 */
export function updatePersonSchedule(data) {
  return request({
    url: '/attend/schedule/update-users-schedule',
    method: 'post',
    data
  });
}

/**
 * 批量更新排班（每日班次）
 * @param data
 */
export function updatePersonShifts(data) {
  return request({
    url: '/attend/schedule/update-classes-by-id',
    method: 'post',
    data
  });
}
