import { baseUrl } from './config'
import Api from './api'

// 校验用户信息
export const ApiCheckUser = (params) => {
  return Api.request('POST', `${baseUrl}/bt/login/enforcerValid`, params).then(res => res);
}

// 获取open_id
export const ApiGetOpenId = (code) => {
  return Api.request('POST', `${baseUrl}/bt/login/auth?code=${code}`, {}).then(res => res);
}

// 登录
export const ApiGetLogin = (params) => {
  return Api.request('POST', `${baseUrl}/bt/login/doLogin`, params).then(res => res);
}

// 根据openId 获取用户信息
export const ApiGetUserMsgByOpenId = (userId) => {
  return Api.request('POST', `${baseUrl}/bt/login/getByUserId?userId=${userId}`, {});
}

// 城区
export const ApiGetRegion = () => {
  return Api.request('POST', `${baseUrl}/bt/region/query`, {}).then(res => res);
}

/**
 * 
 * @param { 点赞用户id } curUserId 
 * @param { 被点赞用户id } userId 
 */
export const ApiLikeVAlid = (curUserId, userId) => {
  return Api.request('POST', `${baseUrl}/bt/like/valid?curUserId=${curUserId}&userId=${userId}`, {
    notShowError: true,
  }).then(res => res);
}


// 点赞
export const ApiDoLike = (curUserId, userId) => {
  return Api.request('POST', `${baseUrl}/bt/like/doLike?curUserId=${curUserId}&userId=${userId}`, {
    notShowError: true,
  }).then(res => res);
}

// 管理员登录
export const adminLoginApi = (params) => {
    return Api.request('POST', `${baseUrl}/bt/login/doLoginAdmin`, params)
}



