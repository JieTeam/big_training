import Api from "./api";
import { baseUrl } from './config'

/**
 * 每周一测
 */

// 抽取每周一测题目
export const getWeektoPicApi = (params) => {
    return Api.request('POST', `${baseUrl}/bt/training/week/extractQuestion?userId=${params.userId}`, params);
}

// 提交每周一测答题
export const subWeekAnswerApi = (params) => {
    return Api.request('POST', `${baseUrl}/bt/training/week/submit`, params);
}


/**
 * 排行榜
 * params { 
 *  type: 1个人 2省 3市 4县 
 * }
 */

// 获取答题人展示排行榜信息
export const getRankListApi = (params) => {
    return Api.request('POST', `${baseUrl}/bt/rank/getRankList?type=${params.type}`);
}

// 错题库
export const getWrongQuestionList = (userId) => {
    return Api.request('POST', `${baseUrl}/bt/question/wrongList?userId=${userId}`);
}


/**
 * 战绩
 */
export const getTrainListApi = (params) => {
    return Api.request('POST', `${baseUrl}/bt/rank/getTrainList?userId=${params.userId}&trainType=${params.trainType}`);
}

// 省份数据统计
export const getProvinceData = (userId) => {
    return Api.request('POST', `${baseUrl}/bt/rank/getProvinceBattleResult?userId=${userId}`);
}

// 省内排行榜
export const getProvinceCityListApi = (params) => {
    return Api.request("POST",`${baseUrl}/bt/rank/getProvinceCityList?pvcode=${params.pvcode}&pvtype=${params.pvtype}`)
}

// 荣耀墙
export const getAwardList = (userId, region_code) => {
    return Api.request("POST",`${baseUrl}/bt/rank/getAwardList?userId=${userId}${region_code?'&region_code=' + region_code :''}`)
}