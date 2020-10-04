//index.js
// import regeneratorRuntime from "../../utils/runtime.js";   // 使用 async/await 引入

import { ApiGetUserMsgByOpenId } from '../../utils/server/login'
const Utils = require("../../utils/util.js");
const app = getApp(); // 获取应用实例

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rulesBox: false,
    showHonor: false,
    show: false,
    userInfo: {},
  },
  go(e) {
    const type = e.currentTarget.dataset.type || e.target.dataset.type;
    let url = null;
    switch (type) {
      case "honor":
        url = "/pages/honor/index";
        break;
      case "personal":
        url = "/pages/personal/personal";
        break;
      case "fight":
        url = "/pages/fight/index";
        break;
      case "week":
        url = "/pages/week/index";
        break;
      case "knowledgeBase":
        url = '/pages/knowledgeBase/knowledgeBase'
        break;
      case "ranking":
        url = "/pages/ranking/ranking";
        break;
      case "wrongQuestion":
        url = "/pages/wrongQuestion/wrongQuestion";
        break;
      case "record":
        url = "/pages/record/record";
        break;
      default:
        break;
    }
    if (!url) return;
    wx.navigateTo({
      url,
    });
  },
  rulesBoxShow() {
    this.setData({
      rulesBox: !this.data.rulesBox,
    });
  },
  onLoad: function () {
    if (!app.globalData.userInfo || app.globalData.userInfo.login === false) {
      wx.redirectTo({
        url: '/pages/loginType/loginType',
      })
    } else if (app.globalData.userInfo.roleType === '1') {
      wx.redirectTo({
        url: '/pages/adminIndex/adminIndex',
      })
    }
    if (app.globalData.userInfo.login) {
      let showHonor = false
      const userInfo = app.globalData.userInfo
      if (app.globalData.userInfo.roleType === '2') {
        showHonor = false
      } else {
        showHonor = true
      }
      this.setData({
        showHonor,
      })
      wx.showLoading({
        title: '数据加载中...',
      })
      this.getUserInfo(userInfo.userId).then(res => {
        console.log(res)
        wx.hideLoading()
        if(res.code === 1) {
          const { userLevel, winRate, winCount,tieCount, loseCount, score, rank, phoneNo, id, name, 
                    roleType, workingDivision, fullRegionName,likeCount, headUrl } = res.data
          userInfo.userLevel = userLevel; // 等级
          userInfo.winRate = (winRate * 100).toFixed(2); // 胜率
          userInfo.winCount = winCount; // 胜利场次
          userInfo.tieCount = tieCount; // 平局场次
          userInfo.loseCount = loseCount; // 失败场次
          userInfo.rank = rank; // 排名
          userInfo.count = winCount + tieCount + loseCount;
          userInfo.score = score;
          userInfo.phoneNo = phoneNo;
          userInfo.userId = id;
          userInfo.likeCount = likeCount;
          userInfo.name = name;
          userInfo.workingDivision = workingDivision; // 所属区域代码
          userInfo.fullRegionName = fullRegionName;
          // 后台返回的是数字 转字符串
          userInfo.roleType = roleType + '';
          userInfo.avatarUrl = headUrl;

          this.setData({
            userInfo,
            show: true,
          })
        } else {
          this.setData({
            show: true,
          })
        }
      }).catch(err => {
        console.log('>>err', err)
        wx.hideLoading()
        this.setData({show: true,})
      })
    }
  },
  getUserInfo(openId) {
    return new Promise((resovle, reject) => {
      ApiGetUserMsgByOpenId(openId).then(res => {
        // if (res.code === 1) {
          resovle(res)
        // }
      }).catch(() => {
          wx.hideLoading()
      })
    })
  },
  onShareAppMessage() {
    const { openId, userId } = app.globalData.userInfo
    return {
      title: "2020年生态环境保护执法大练兵知识竞赛",
      path:`/pages/shareImg/shareImg?openId=${openId}&userId=${userId}` 
    }
    // return {
    //   title: "2020年生态环境保护执法大练兵知识竞赛",
    //   path:`/pages/shareGood/shareGood?openId=${openId}&userId=${userId}` 
    // }
  }
});
