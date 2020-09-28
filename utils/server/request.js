import Api from "./api";
import { baseUrl } from './config'

// 抽取每周一测题目
export const getWeektoPicApi = (params) => {
    return Api.request('POST', `${baseUrl}/bt/training/week/extractQuestion?userId=${params.userId}`, params);
}

// 提交每周一测答题
export const subWeekAnswerApi = (params) => {
    return Api.request('POST', `${baseUrl}/bt/training/week/submit`, params);
}