import axios from 'axios';
import {Message, MessageBox} from 'element-ui';
import store from '../store';
import {getToken} from '@/utils/auth';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  baseURL: 'http://172.20.112.56:9001',
  // baseURL: 'http://106.55.45.216',
  timeout: 30000 // 请求超时时间
});

export function requestData(reqData) {
  return {
    request_source: '',
    verify_code: '',
    request_time: new Date().getTime(),
    token: store.getters.token ? getToken() : '',
    content: reqData
  };
}

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (config.method === 'post') {
      //application/json
      if (!config.type) {
        config.data = requestData(config.data);
      }
      console.log(config.data)
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.result_code !== 5000) {
      Message({
        message: res.result_desc,
        type: 'error',
        duration: 5 * 1000
      });

      // 5008:非法的token; 5012:其他客户端登录了;  5014:Token 过期了;
      if (res.result_code === 5008 || res.result_code === 5012 || res.result_code === 5014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        });
      }
      return Promise.reject('error');
    } else {
      return response.data;
    }
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: '发生未知错误,请联系管理员.',
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service
