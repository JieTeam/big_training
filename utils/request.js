import Api from "./api";
const state = false;  // 环境状态， true正式， false测试
const formal = 'https://www.xxx.com'; // 正式
const test = 'https://test.xxx.com'; // 测试
const http = state ? formal : test; // 最终使用

// 登录
export function getLogin(params) {
  return Api.request('GET', 'https://api.weixin.qq.com/sns/jscode2session', params).then(res => res);
}