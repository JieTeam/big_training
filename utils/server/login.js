import { baseUrl } from './config'


// 校验用户信息
export const ApiCheckUser = (params) => {
  return Api.request('POST', `${baseUrl}/bt/login/enforcerValid`, params).then(res => res);
}

// 获取open_id
export const ApiGetOpenId = (params) => {
  return Api.request('POST', `${baseUrl}/bt/login/auth`, params).then(res => res);
}

// 登陆
export const ApiGetLogin = (params) => {
  return Api.request('POST', `${baseUrl}/bt/login/doLogin`, params).then(res => res);
}



